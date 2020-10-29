class ContractsBalancesFetcher {
  constructor(sgrTokenContract, sgnTokenContract) {
    this.sgrTokenContract = sgrTokenContract;
    this.sgnTokenContract = sgnTokenContract;
  }

  getBalances(voters) { 
    return Promise.all([
      this.sgrTokenContract.getBalances(voters),
      this.sgnTokenContract.getBalances(voters),
    ]).then(([sgrVoterBalanceResults, sgnVoterBalanceResults]) => {   
      var voterBalanceResults = [];
      var stakes = [];
      voters.forEach((voter) => {
        var voterSgrBalance = sgrVoterBalanceResults.find(function (balResult) {
          return balResult.voter == voter;
        });

        var voterSgnBalance = sgnVoterBalanceResults.find(function (balResult) {
          return balResult.voter == voter;
        });

        if (typeof voterSgrBalance === "undefined" || typeof voterSgnBalance === "undefined" || !voterSgrBalance || !voterSgnBalance)
          throw "missing voter balance data";
  
        const stake = new Decimal(voterSgrBalance.balance).plus(new Decimal(voterSgnBalance.balance))
        stakes.push(stake);
        
        voterBalanceResults.push(
          new VoterBalanceResult(
            voter,
            new Decimal(voterSgrBalance.balance),
            new Decimal(voterSgnBalance.balance),
            stake,
            new Decimal(0)
          )
        );
      });

      return [stakes, voterBalanceResults];
    })
    .then( ([stakes, voterBalanceResults]) => {
      const democonomyVotePowerCalculator = getVotePowerCalculator(Decimal, stakes);
      
      return voterBalanceResults.map((voterBalanceResult) => {
        voterBalanceResult.votingPower = new Decimal(democonomyVotePowerCalculator(voterBalanceResult.stake));
        return voterBalanceResult;
      });
    });
  }
}

class CSVBalancesFetcher {
  constructor(csvString) {
    this.csvString = csvString;
  }

  getBalances(voters) {
    if (this.voterBalanceResults) {
      return Promise.resolve(this.voterBalanceResults);
    } else {
      return this.loadData(voters).then((n) => this.voterBalanceResults);
    }
  }

  loadData(voters) {
    const result = Papa.parse(this.csvString, {
      header: false,
      delimiter: "auto",
    });

    this.handlePapaCallback(voters, result);

    return Promise.resolve("");
  }
  handlePapaCallback(voters, results, file) {
    var voterBalanceResults = [];
    var parsedData = [];

    if (results.data[0] != "Voter,Sgr,Sgn,VotingPower") throw "unexpected csv header";

    results.data.forEach((resultData) => {
      if (resultData == "Voter,Sgr,Sgn,VotingPower") return;
      const dataSplitted = (resultData + "").split(",");

      if (dataSplitted.length != 4) throw "unexpected csv data length";

      if (dataSplitted[0].startsWith("0x", 0) === false)
        throw "invalid address data";
      if (typeof parseInt(dataSplitted[1]) !== "number")
        throw "invalid sgr balance data";
      if (typeof parseInt(dataSplitted[2]) !== "number")
        throw "invalid sgn balance data";
        if (typeof parseInt(dataSplitted[3]) !== "number")
        throw "invalid voting power data";

      parsedData.push({
        voter: dataSplitted[0],
        sgrBalance: new Decimal(dataSplitted[1]),
        sgnBalance: new Decimal(dataSplitted[2]),
        votingPower: new Decimal(dataSplitted[3])
      });
    });
    
    voters.forEach((voter) => {
      var voterBalances = parsedData.find(function (data) {
        return data.voter.toLowerCase() == voter.toLowerCase();
      });

      if (typeof voterBalances === "undefined" || !voterBalances)
        throw "Local historical balance information (csv file) is missing or doesn't fit the voting contract's starting block. Make sure you have the right file or use an archive node instead.";
      
      const stake = voterBalances.sgrBalance.plus(voterBalances.sgnBalance);
            
      voterBalanceResults.push(
        new VoterBalanceResult(
          voter,
          voterBalances.sgrBalance,
          voterBalances.sgnBalance,
          stake,
          voterBalances.votingPower
        )
      );
    });
    
    
    this.voterBalanceResults = voterBalanceResults;
  }
}

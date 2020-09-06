class ContractsBalancesFetcher {
  constructor(sgaTokenContract, sgnTokenContract) {
    this.sgaTokenContract = sgaTokenContract;
    this.sgnTokenContract = sgnTokenContract;
  }

  getBalances(voters) {
    return Promise.all([
      this.sgaTokenContract.getBalances(voters),
      this.sgnTokenContract.getBalances(voters),
    ]).then(([sgaVoterBalanceResults, sgnVoterBalanceResults]) => {
      var voterBalanceResults = [];
      voters.forEach((voter) => {
        var voterSgaBalance = sgaVoterBalanceResults.find(function (balResult) {
          return balResult.voter == voter;
        });

        var voterSgnBalance = sgnVoterBalanceResults.find(function (balResult) {
          return balResult.voter == voter;
        });

        if (typeof voterSgaBalance === "undefined" || typeof voterSgnBalance === "undefined" || !voterSgaBalance || !voterSgnBalance)
          throw "missing voter balance data";

        voterBalanceResults.push(
          new VoterBalanceResult(
            voter,
            BigInt(voterSgaBalance.balance),
            BigInt(voterSgnBalance.balance)
          )
        );
      });

      return voterBalanceResults;
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
    // Papa.parse(url, {
    //   download: true,
    //   header: false,
    //delimiter: "auto",
    //   complete: handlePapaCompleteCsvData,
    // });

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

    if (results.data[0] != "Voter,Sga,Sgn") throw "unexpected csv header";

    results.data.forEach((resultData) => {
      if (resultData == "Voter,Sga,Sgn") return;
      const dataSplitted = (resultData + "").split(",");

      if (dataSplitted.length != 3) throw "unexpected csv data length";

      if (dataSplitted[0].startsWith("0x", 0) === false)
        throw "invalid address data";
      if (typeof parseInt(dataSplitted[1]) !== "number")
        throw "invalid sga balance data";
      if (typeof parseInt(dataSplitted[2]) !== "number")
        throw "invalid sgn balance data";

      parsedData.push({
        voter: dataSplitted[0],
        sgaBalance: BigInt(dataSplitted[1]),
        sgnBalance: BigInt(dataSplitted[2]),
      });
    });

    
    voters.forEach((voter) => {
      var voterBalances = parsedData.find(function (data) {
        return data.voter.toLowerCase() == voter.toLowerCase();
      });

      if (typeof voterBalances === "undefined" || !voterBalances)
        throw "Local historical balance information (csv file) is missing or doesn't fit the voting contract's starting block. Make sure you have the right file or use an archive node instead.";
      
      voterBalanceResults.push(
        new VoterBalanceResult(
          voter,
          voterBalances.sgaBalance,
          voterBalances.sgnBalance
        )
      );
    });

    this.voterBalanceResults = voterBalanceResults;
  }
}

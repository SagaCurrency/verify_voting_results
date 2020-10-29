class CSVPotentialVotersFetcher {
  constructor(csvString) {
    this.csvString = csvString;
  }

  getAllPotentialVoters() {
    
    if (this.allPotentialVoters) {
      return Promise.resolve(this.allPotentialVoters);
    } else {
      return this.loadData().then((allPotentialVoters) =>{
        this.allPotentialVoters = allPotentialVoters;
        return this.allPotentialVoters;
      });
    }
  }

  loadData() {
    const result = Papa.parse(this.csvString, {
      header: false,
      delimiter: "auto",
    });

    return Promise.resolve(this.handlePapaCallback(result));
  }

  handlePapaCallback(results) {
    var allPotentialVoters = [];

    if (results.data[0] != "Voter,Sgr,Sgn,VotingPower") throw "unexpected csv header";

    results.data.forEach((resultData) => {
      if (resultData == "Voter,Sgr,Sgn,VotingPower") return;
      const dataSplitted = (resultData + "").split(",");

      if (dataSplitted.length != 4) throw "unexpected csv data length";

      if (dataSplitted[0].startsWith("0x", 0) === false)
        throw "invalid address data";
      
      allPotentialVoters.push(dataSplitted[0].toLowerCase());
    });
    return allPotentialVoters;
  }
}

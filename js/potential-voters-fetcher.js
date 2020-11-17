class CSVPotentialVotersFetcher {
  constructor(balancesCSVFile) {
    this.balancesCSVFile = balancesCSVFile;
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

  async loadData() {
    var results =  await new Promise((resolve, reject) => {
      
      Papa.parse(this.balancesCSVFile, {
          skipEmptyLines: true,  
          header: false,
          delimiter: "auto",
          complete: function(results) {
            resolve(results);
          },
          error: function(error) {
            reject(error);
          }
      });
  });

  return Promise.resolve(this.parsePapaResults(results));
}

  parsePapaResults(results) {
    var allPotentialVoters = [];

    results.data.forEach((resultData) => {
      
      const dataSplitted = (resultData + "").split(",");
      
      if (dataSplitted.length != 5) throw "unexpected csv data length";

      if (dataSplitted[0].startsWith("0x", 0) === false)
        throw "invalid address data";
      
      allPotentialVoters.push(dataSplitted[0].toLowerCase());
    });
    return allPotentialVoters;
  }
}

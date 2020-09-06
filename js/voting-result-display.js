class VotingResultDisplay {
  constructor(htmlIdForDisplay) {
    this.htmlIdForDisplay = htmlIdForDisplay;
  }

  loadDetails(overrideFromRow, forTableId, againstTableId, voterResults) {
    const forVoters = voterResults.filter(voterResult => voterResult.isSupport === true);
    const againstVoters = voterResults.filter(voterResult => voterResult.isSupport === false);
    var forCount = 1;
    var againstCount = 1;
    var i;

    var forTable = document.getElementById(forTableId);
    const forTableRowLength = forTable.rows.length;
    for(i=overrideFromRow; i < forTableRowLength; i++){
      forTable.deleteRow(overrideFromRow);
    }

    var againstTable = document.getElementById(againstTableId);
    const againstTableRowLength = againstTable.rows.length;
    for(i=overrideFromRow; i < againstTableRowLength; i++){
      againstTable.deleteRow(overrideFromRow);
    }

    forVoters.forEach((forVoter) => {
      const votingPower = forVoter.sgaBalance + forVoter.sgnBalance;
      this.loadDetailsRow(forTable, forCount, forVoter.voter, votingPower);
      forCount++;
    });

    againstVoters.forEach((againstVoter) => {
    
      const votingPower = againstVoter.sgaBalance + againstVoter.sgnBalance;
      this.loadDetailsRow(againstTable, againstCount, againstVoter.voter, votingPower);
      againstCount++;
    });
  }

  loadSummary(tableId, overrideFromRow, voterResults) {
    const summary = this.getSummary(voterResults);

    var table = document.getElementById(tableId);
    const tableRowLength = table.rows.length;

    for(var i=overrideFromRow; i < tableRowLength; i++){
      table.deleteRow(overrideFromRow);
    }

    this.loadSummaryRow(table, "For", summary.for );
    this.loadSummaryRow(table, "Againts", summary.against );  
  }



  loadSummaryRow(table, title, score) {

    var row = document.createElement("TR");
    var tdTitle = document.createElement("TD");
    var tdScore = document.createElement("TD");

    tdTitle.appendChild(document.createTextNode(title));
    tdScore.appendChild(document.createTextNode(BigInt(score)));
    row.appendChild(tdTitle);
    row.appendChild(tdScore);

    table.appendChild(row);
  }

  loadDetailsRow(table, number, address, votingPower) {
    
    var row = document.createElement("TR");
    var tdNumber = document.createElement("TD");
    var tdAddress = document.createElement("TD");
    var tdVotingPower = document.createElement("TD");


    tdNumber.appendChild(document.createTextNode(number));
    tdAddress.appendChild(document.createTextNode(address.substring(0,20) + "..."));
    tdVotingPower.appendChild(document.createTextNode(BigInt(votingPower)));

    row.appendChild(tdNumber);
    row.appendChild(tdAddress);
    row.appendChild(tdVotingPower);

    table.appendChild(row);
    }

  getSummary(voterResults) {
    var supportsWeight = 0;
    var notSupportsWeight = 0;
    voterResults.forEach((voterResult) => {
      const totalWeight = voterResult.sgaBalance + voterResult.sgnBalance;
      if (voterResult.isSupport) supportsWeight += totalWeight;
      else notSupportsWeight += totalWeight;
    });

    return {
      for : supportsWeight,
      against : notSupportsWeight
    };
  }

}

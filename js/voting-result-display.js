class VotingResultDisplay {
  constructor(htmlIdForDisplay, config) {
    this.htmlIdForDisplay = htmlIdForDisplay;
    this.config = config;
  }

  loadDetails(voterResults) {
    var html = "";
    var rowCount = 0;
    this.config.choices.forEach((choice) => {
      rowCount = 0;
      var rowsHtml = "";
      const choiceVoters = voterResults.filter(voterResult => voterResult.choiceId === choice.choiceId);
      choiceVoters.forEach((voter) => {
      rowCount++;
        rowsHtml += `<tr>
        <td>${rowCount}</td>
        <td>${voter.voter.substring(0,20) + "..."}</td>
        <td>${this.convertStakeToFullUnitString(voter.stake)}</td>
        <td>${voter.votingPower.mul(100).toFixed(2)}%</td>
        </tr>`;
    });

    html +=
      `<div style=" margin-top: 10px; float: left;">
      <table class="details-voting-result">
        <tr>
          <th colspan="4">${choice.choiceName}</th>
        </tr>
        <tr>
          <td style=" font-size: 14px;
          font-weight: bold;">#</td>
          <td style=" font-size: 14px;
          font-weight: bold;">Address</td>
          <td style=" font-size: 14px;
          font-weight: bold;">Stake</td>
          <td style=" font-size: 14px;
          font-weight: bold;">Democonomy Voting Power</td>
        </tr>
        ${rowsHtml}
      </table>
      </div>
      `;
    });

    var detailsTableContainer = document.getElementById("details-tables") ;
    detailsTableContainer.innerHTML = html;
  }

  loadSummary(overrideFromRow, tableId, voterResults) {
    const summary = this.getSummary(voterResults);

    var table = document.getElementById(tableId);
    const tableRowLength = table.rows.length;

    for(var i=overrideFromRow; i < tableRowLength; i++){
      table.deleteRow(overrideFromRow);
    }

    summary.forEach(choice => {
      this.loadSummaryRow(table, this.config.getChoiceName(choice.choiceId) , choice.totalStake, choice.totalVotingPower );
    }); 
  }


  loadSummaryRow(table, name, totalStake, totalVotingPower) {
    var row = document.createElement("TR");
    var tdTitle = document.createElement("TD");
    var tdStake = document.createElement("TD");
    var tdVotingPower = document.createElement("TD");

    tdTitle.appendChild(document.createTextNode(name));
    tdStake.appendChild(document.createTextNode( this.convertStakeToFullUnitString(totalStake)));
    tdVotingPower.appendChild(document.createTextNode(`${totalVotingPower.mul(100).toFixed(2)}%`));
    row.appendChild(tdTitle);
    row.appendChild(tdStake);
    row.appendChild(tdVotingPower);

    table.appendChild(row);
  }

  

  getSummary(voterResults) {
    const result = this.config.choices.map((configChoice) => {
      var totalStake = new Decimal(0);
      var totalVotingPower = new Decimal(0);
      const choiceVoters = voterResults.filter(voterResult => voterResult.choiceId === configChoice.choiceId);
      choiceVoters.forEach((cv) => {
        totalStake = totalStake.plus(cv.stake);
        totalVotingPower = totalVotingPower.plus(cv.votingPower);
      });
      return {
        choiceId : configChoice.choiceId,
        totalStake : totalStake,
        totalVotingPower : totalVotingPower
      };

    } );
    return result;
  }


  convertStakeToFullUnitString(stake) {
    return stake.dividedBy(new Decimal("1e+18")).toFixed()
  }



}


class VoterSupportResult {
  constructor(voter, choiceId) {
    this.voter = voter;
    this.choiceId = choiceId;
  }
}

class VoterBalanceResult {
  constructor(voter, sgrBalance, sgnBalance, stake, votingPower) {
    this.voter = voter;
    this.sgrBalance = sgrBalance;
    this.sgnBalance = sgnBalance;
    this.stake = stake;
    this.votingPower = votingPower;
  }
}

class VoterResult {
  constructor(voter, sgrBalance, sgnBalance, stake, votingPower, choiceId) {
    let sgrBalNumber = sgrBalance;
    let sgnBalNumber = sgnBalance;
    let votingPowerNumber = votingPower;
    let choiceIdNumber = parseInt(choiceId);
    
    
    if (typeof choiceIdNumber !== "number") throw "choiceId must be number";
    if (typeof sgrBalNumber !== "object") throw "sgrBalNumber must be decimal";
    if (typeof sgnBalNumber !== "object") throw "sgnBalNumber must be decimal";
    if (typeof stake !== "object") throw "sgnBalNumber must be decimal";
    if (typeof votingPowerNumber !== "object") throw "votingPowerNumber must be decimal";
    if (typeof voter !== "string") throw "voter must be string";

    this.voter = voter;
    this.sgrBalance = sgrBalNumber;
    this.sgnBalance = sgnBalNumber;
    this.stake = stake;
    this.votingPower = votingPowerNumber;
    this.choiceId = choiceIdNumber;
  }
}

class VotingCalculatorConfig {
  constructor(startBlock, choices) {
    this.choices = choices;
    this.startBlock = startBlock;
    this.balancesCSVUrl = `https://wallet-balances.sogur.com/${startBlock}.csv`;
  }

  getChoiceName(choiceId) {
    const choice = this.choices.find(function (c) {
      return c.choiceId == choiceId;
    });

    if (typeof choice === "undefined" || !choice)
      throw "missing choice data";

    return choice.choiceName;
  }

}

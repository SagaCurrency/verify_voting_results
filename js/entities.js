
class VoterSupportResult {
  constructor(voter, isSupport) {
    this.voter = voter;
    this.isSupport = isSupport;
  }
}

class VoterBalanceResult {
  constructor(voter, sgaBalance, sgnBalance) {
    this.voter = voter;
    this.sgaBalance = sgaBalance;
    this.sgnBalance = sgnBalance;
  }
}

class VoterResult {
  constructor(voter, sgaBalance, sgnBalance, isSupport) {
    let sgaBalNumber = parseInt(sgaBalance);
    let sgnBalNumber = parseInt(sgnBalance);
    if (typeof isSupport !== "boolean") throw "isSupport must be boolean";
    if (typeof sgaBalNumber !== "number") throw "sgaBalNumber must be number";
    if (typeof sgnBalNumber !== "number") throw "sgnBalNumber must be number";
    if (typeof voter !== "string") throw "voter must be string";

    this.voter = voter;
    this.sgaBalance = parseInt(sgaBalance);
    this.sgnBalance = parseInt(sgnBalance);
    this.isSupport = isSupport;
  }
}


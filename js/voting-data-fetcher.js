class DefaultVotingDataFetcher {
  constructor(approvalVotingContract, balancesFetcher, potentialVotersFetcher) {
    this.approvalVotingContract = approvalVotingContract;
    this.balancesFetcher = balancesFetcher;
    this.potentialVotersFetcher = potentialVotersFetcher;
  }

  getVotingData() {
    return Promise.all([
      this.approvalVotingContract.getVoters(),
      this.potentialVotersFetcher.getAllPotentialVoters()
    ]).then(([voters, allPotentialVoters]) => {
        return Promise.all([
          Promise.resolve(voters),
          this.approvalVotingContract.getVotings(voters),
          this.balancesFetcher.getBalances(allPotentialVoters),
        ]);
      })
      .then(([voters, votersSupportResults, balanceResults]) => {
         return this.createVoterResults(voters, balanceResults, votersSupportResults);
      });
  }

  createVoterResults(voters, voterBalanceResults, votersSupportResults) {
    var voterResults = [];

    voters.forEach((voter) => {
      var voterBalance = voterBalanceResults.find(function (balResult) {
        return balResult.voter == voter;
      });

      var voterChoice = votersSupportResults.find(function (
        supportResult
      ) {
        return supportResult.voter == voter;
      });

      if (typeof voterChoice === "undefined" || !voterChoice)
          throw "missing voter is support info";

      if (typeof voterBalance === "undefined" || !voterBalance)
          throw "missing voter balance info";
          
      voterResults.push(
        new VoterResult(
          voter,
          voterBalance.sgrBalance,
          voterBalance.sgnBalance,
          voterBalance.stake,
          voterBalance.votingPower,
          voterChoice.choiceId
        )
      );
    });

    return voterResults;
  }
}

class DefaultVotingDataFetcher {
  constructor(approvalVotingContract, balancesFetcher) {
    this.approvalVotingContract = approvalVotingContract;
    this.balancesFetcher = balancesFetcher;
  }

  getVotingData() {
    var allVoters;

    return this.approvalVotingContract
      .getVoters()
      .then((voters) => {
        allVoters = voters;
        return Promise.all([
          this.approvalVotingContract.getVotings(voters),
          this.balancesFetcher.getBalances(voters),
        ]);
      })
      .then(([votersSupportResults, balanceResults]) => {
         return this.createVoterResults(allVoters, balanceResults, votersSupportResults);
      });
  }

  createVoterResults(voters, voterBalanceResults, votersSupportResults) {
    var voterResults = [];

    voters.forEach((voter) => {
      var voterBalance = voterBalanceResults.find(function (balResult) {
        return balResult.voter == voter;
      });

      var voterIsSupport = votersSupportResults.find(function (
        supportResult
      ) {
        return supportResult.voter == voter;
      });


      if (typeof voterIsSupport === "undefined" || !voterIsSupport)
          throw "missing voter is support info";

      if (typeof voterBalance === "undefined" || !voterBalance)
          throw "missing voter balance info";
          
      voterResults.push(
        new VoterResult(
          voter,
          voterBalance.sgaBalance,
          voterBalance.sgnBalance,
          voterIsSupport.isSupport
        )
      );
    });

    return voterResults;
  }
}

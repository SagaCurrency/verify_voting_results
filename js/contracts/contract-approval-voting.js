class ApprovalVotingContract {
  constructor(web3, address) {
    this.approvalVoting = new web3.eth.Contract(
      [{"constant":true,"inputs":[],"name":"endBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getSGRAuthorizationManager","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllVoters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"startBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"description","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getContractAddressLocator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalVoters","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"choicesCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"votes","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"voters","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_startIndex","type":"uint256"},{"name":"_count","type":"uint256"}],"name":"getVotersRange","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"choices","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"VERSION","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_contractAddressLocator","type":"address"},{"name":"_description","type":"string"},{"name":"_startBlock","type":"uint256"},{"name":"_endBlock","type":"uint256"},{"name":"_choicesCount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"voter","type":"address"},{"indexed":false,"name":"choice","type":"uint256"}],"name":"ProposalVoteCasted","type":"event"}],
      address
    );
  }

  getVoters() {
    return this.approvalVoting.methods.getAllVoters()
    .call()
    .then((voters) => voters.map((v) => v.toLowerCase()));
  }

  getStartBlock() {
    return this.approvalVoting.methods.startBlock().call();
  }

  getChoiceCount() {
    return this.approvalVoting.methods.choicesCount().call();
  }

  getChoiceNameByIndex(index) {
    return this.approvalVoting.methods.choices(index).call();
  }


  getVotings(voters) {
    var promises = [];

    for (let i = 0; i < voters.length; i++) {
      promises.push(
        this.approvalVoting.methods
          .votes(voters[i])
          .call()
          .then((choiceId) => {
            return new VoterSupportResult(voters[i], choiceId);
          })
      );
    }

    return Promise.all(promises);
  }
}

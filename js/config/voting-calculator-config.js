class DynamicVotingCalculatorConfigBuilder {
   constructor(approvalVotingContract) {
    this.approvalVotingContract = approvalVotingContract;
  }

  async build() {
    var choices = [];

    const choiceCount = await this.approvalVotingContract.getChoiceCount();
    const startBlock =  await this.approvalVotingContract.getStartBlock()
    
    for (let i = 0; i < choiceCount; i++) {
      const choiceName = await this.approvalVotingContract.getChoiceNameByIndex(i);
      choices[i] = {
        choiceId : i+1,
        choiceName : choiceName
      };
    }

    return new VotingCalculatorConfig(startBlock, choices);
    
  }
}

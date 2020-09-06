const Web3ConnectType = {
  LOCALHOST: "localhost",
  INJECTED: "injected",
  NODE_URL: "node_url",
};



class Web3ConnectManager {

  connect(web3ConnectType, nodeAddress) {
    
    var resultWeb3 = {};
    
      if (web3ConnectType == Web3ConnectType.LOCALHOST) {
        resultWeb3 = new Web3("http://127.0.0.1:8545");
      } else if (web3ConnectType == Web3ConnectType.NODE_URL) {
        if (nodeAddress == "" || typeof nodeAddress === "undefined") 
          throw "invalid empty node address";  
          resultWeb3 = 
            new Web3(new Web3.providers.HttpProvider(nodeAddress));
      }else{
        throw "unsupported connect type";  
      }
   
    this.resultWeb3 = resultWeb3;
  }
}

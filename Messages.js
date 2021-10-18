// Peers ask for each other's blocks to determine who has the most up-to-date blockchain.
class Messages {
    static getLatestBlock() {
      return {
        type: REQUEST_LATEST_BLOCK
      };
    }
  
    static sendLatestBlock(block) {
      return {
        type: RECEIVE_LATEST_BLOCK,
        data: block
      };
    }
  
    static getBlockchain() {
      return {
        type: REQUEST_BLOCKCHAIN
      };
    }
  
    static sendBlockchain(blockchain) {
      return {
        type: RECEIVE_BLOCKCHAIN,
        data: blockchain
      };
    }
  }
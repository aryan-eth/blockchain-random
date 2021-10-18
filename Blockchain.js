const Block = require("./Block.js");

const messageType = {
    REQUEST_LATEST_BLOCK: 0,
    RECEIVE_LATEST_BLOCK: 1,
    REQUEST_BLOCKCHAIN: 2,
    RECEIVE_BLOCKCHAIN: 3,
  };

const {
    REQUEST_LATEST_BLOCK,
    RECEIVE_LATEST_BLOCK,
    REQUEST_BLOCKCHAIN,
    RECEIVE_BLOCKCHAIN,
    REQUEST_TRANSACTIONS,
    RECEIVE_TRANSACTIONS
} = messageType;

class Blockchain {
  constructor () {
    this.blockchain = [Block.genesis()];
  }

  get() {
    return this.blockchain;
  }

  get latestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  isValidHashDifficulty(hash) {
    for (var i = 0; i < hash.length; i++) {
      if (hash[i] !== "0") {
        break;
      };
    }
    return i >= this.difficulty;
  }

  // 
  calculateHashForBlock(block) {
    const { index, previousHash, timestamp, transactions, nonce } = block;
    return this.calculateHash(
      index,
      previousHash,
      timestamp,
      transactions,
      nonce
    );
  }

    generateNextBlock(data) {
    const nextIndex = this.latestBlock.index + 1;
    const previousHash = this.latestBlock.hash;
    let timestamp = new Date().getTime();
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce
      );
    }

    const nextBlock = new Block(
      nextIndex,
      previousBlock.hash,
      nextTimestamp,
      data,
      nextHash,
      nonce
    );

    return nextBlock;
  }

    // The nonce is the number used to find a valid hash.
    // To find a valid hash, we need to find a nonce value that will 
    // produce a valid hash when used with the rest of the information from that block.

  calculateHash(index, previousHash, timestamp, data, nonce) {
    return crypto
      .createHash("sha256") // SHA256 Hash Function
      .update(index + previousHash + timestamp + data + nonce)
      .digest("hex");
  }


  // The process of determining this nonce is called mining.
  // We start with a nonce of 0 and keep incrementing it by 1 until we find a valid hash.

  mine(data) {
    const newBlock = this.generateNextBlock(data);
    try {
      this.addBlock(newBlock);
    } catch (err) {
      throw err;
    };
  }

  // To mine another block to the blockchain, fill out the data input and click the button.
  addBlock(newBlock) {
    if (this.isValidNewBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock);
    } else {
      throw "Error: Invalid block";
    }
  }

  // When adding a new block to the blockchain, the new block needs to meet these requirements.
  // Block index one greater than latest block index.
  // Block previous hash equal to latest block hash.
  // Block hash meets difficulty requirement.
  // Block hash is correctly calculated.

  // Other peers on the network will be adding blocks to the blockchain, 
  // so new blocks need to be validated.
  isValidNextBlock(nextBlock, previousBlock) {
    const nextBlockHash = this.calculateHashForBlock(nextBlock);
    if (previousBlock.index + 1 !== nextBlock.index) {
      return false;
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false;
    } else if (nextBlockHash !== nextBlock.hash) {
      return false;
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false;
    } else {
      return true;
    }
  }

  // peer to peer network
  // A global network of computers work together to keep the 
  // blockchain secure, correct, and consistent.

  // After receiving the longest valid chain, it will broadcast its latest block to its peers.
  // Eventually, all the peers on the network will have the longest valid chain.
  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    const tempChain = [chain[0]];
    for (let i = 1; i < chain.length; i = i + 1) {
      if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
        tempChain.push(chain[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  isChainLonger(chain) {
    return chain.length > this.blockchain.length;
  }

  replaceChain(newChain) {
    if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
      this.blockchain = JSON.parse(JSON.stringify(newChain));
    } else {
      throw "Error: invalid chain";
    }
  }



};

module.exports = Blockchain;

// The genesis block's previous hash is "0" because there is no previous block.
// In cryptocurrencies such as Bitcoin, the data would include money transactions.

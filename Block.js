class Block {
    constructor (index, previousHash, timestamp, data, hash, nonce) {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.data = data;
      this.hash = hash;
      this.nonce = nonce;
    }
  
    get genesis() {
      new Block(
        0,
        "0",
        1508270000000,
        "Welcome to Blockchain Demo 2.0!",
        "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf",
        604
      );
    }
  }
  
  module.exports = Block;

//   Properties of a hash:
// Hash has a fixed length.
// Same data always maps to same hash.
// Different data always maps to a different hash (within practical limitations).
// Is easy to compute.
// Is infeasible to convert hash to data.
// A small change in data leads to a large change in hash.

// A valid hash for a blockchain is a hash that meets a certain requirement. 
// For this blockchain, having three zeros at the beginning of the hash is the 
// requirement for a valid hash.

// The number of leading zeros required is the difficulty.
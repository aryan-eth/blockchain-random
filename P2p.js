const wrtc = require('wrtc');
const Exchange = require('peer-exchange');
const p2p = new Exchange("Blockchain Demo 2.0", { wrtc: wrtc });
const net = require("net");

// A global network of computers work together to keep the blockchain secure, correct, and consistent.
class PeerToPeer {
  constructor(blockchain) {
    this.peers = [];
    this.blockchain = blockchain;
  }

  startServer(port) {
    const server = net
      .createServer(socket =>
        p2p.accept(socket, (err, conn) => {
          if (err) {
            throw err;
          } else {
            this.initConnection.call(this, conn);
          }
        })
      )
      .listen(port);
  }

  // Get a new peer
  discoverPeers() {
    p2p.getNewPeer((err, conn) => {
      if (err) {
        throw err;
      } else {
        this.initConnection.call(this, conn);
      }
    });
  }

  // make the peer inactive
  closeConnection() {
    p2p.close(err => {
      throw err;
    })
  }

  // send messages
  broadcastLatest() {
    this.broadcast(Messages.sendLatestBlock(this.blockchain.latestBlock));
  }

  // send a single message
  broadcast(message) {
    this.peers.forEach(peer => this.write(peer, message));
  }

  write(peer, message) {
    peer.write(JSON.stringify(message));
  }

  initConnection(connection) {
    this.peers.push(connection);
    this.initMessageHandler(connection);
    this.initErrorHandler(connection);
    this.write(connection, Messages.getLatestBlock());
  }

  initMessageHandler(connection) {
    connection.on("data", data => {
      const message = JSON.parse(data.toString("utf8"));
      this.handleMessage(connection, message);
    });
  }

  initErrorHandler(connection) {
    connection.on("error", err => {
      throw err;
    });
  }

  handleMessage(peer, message) {
    switch (message.type) {
      case REQUEST_LATEST_BLOCK:
        this.write(peer, Messages.sendLatestBlock(this.blockchain.latestBlock));
        break;
      case REQUEST_BLOCKCHAIN:
        this.write(peer, Messages.sendBlockchain(this.blockchain.get()));
        break;
      case RECEIVE_LATEST_BLOCK:
        this.handleReceivedLatestBlock(message, peer);
        break;
      case RECEIVE_BLOCKCHAIN:
        this.handleReceivedBlockchain(message);
        break;
      default:
        throw "Received invalid message.";
    }
  }

  // 0. Start with the genesis block.
  // 1. Add TWO blocks. 
  // 2. Add a peer & connect.
  // 3. Check history between peer.
  // The longer valid chain takes precedent over a shorter chain. Also called longest chain rule.
  handleReceivedLatestBlock(message, peer) {
    if (latestBlock.hash === receivedBlock.previousHash) {
        continue;
    } else if (receivedBlock.index > latestBlock.index) {
      this.write(peer, Messages.getBlockchain());
    } else {
      // Do nothing.
    }
  }

  handleReceivedBlockchain(message) {
    const receivedChain = message.data;
    
    try {
      this.blockchain.replaceChain(receivedChain);
    } catch(err) {
      throw err;
    }
  }
  
}
  
module.exports = PeerToPeer;

// 0. Start with the genesis block.
// 1. Add TWO blocks.
// 2. Add a peer & connect.
// 3. Check history between peer.
// The longer valid chain takes precedent over a shorter chain. Also called longest chain rule.
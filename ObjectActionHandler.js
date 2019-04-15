const { AbstractActionHandler } = require("demux")
const mongoose = require('mongoose')

// Initial state
let state = {
  from: '', // eos
  to: '',  // eos
  quantity: '', // eos
  currency: '', // eos
  memo: '', // eos
  s: '', // ledger
  fromaccount: '', // ledger
  toaccount: '', // ledger
  amount: '', // ledger
  tokey: '', // ledger
  comment: '', // ledger
  nonce: '', // ledger
  trx_id: '', // eos ledger
  blockNumber: 0, // eos ledger
  blockHash: '', // eos ledger
  handlerVersionName: 'v1' // eos ledger
}

class ObjectActionHandler extends AbstractActionHandler {
  constructor([handleVersion], uri, username, password) {
    super([handleVersion])
    let options = {
      useNewUrlParser: true,
      user: username,
      pass: password
    }
    mongoose.connect(uri, options)
    mongoose.set('debug', true);
    mongoose.connection.on('connected', () => {
      console.info(`Mongoose default connection open to ${uri}`)
    })
    mongoose.connection.on('error', console.error.bind(console, 'Mongoose default connection error:'))
    mongoose.connection.on('disconnected', () => {
      console.info('Mongoose default connection disconnected')
    })
    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        console.info('Mongoose default connection disconnected through app termination')
        process.exit(0)
      })
    })
  }

  async handleWithState (handle) {
    try {
      await handle(state)
    } catch (err) {
      console.error(err)
    }
  }

  async loadIndexState() {
    return state
  }

  async updateIndexState(stateObj, block, isReplay, handlerVersionName) {
    console.log("Processing block: ", block.blockInfo.blockNumber)
    stateObj.handlerVersionName = handlerVersionName
  }
}

module.exports = ObjectActionHandler

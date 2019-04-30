const { AbstractActionHandler } = require("demux")
const mongoose = require('mongoose')
const STOP_AT = parseInt(process.env.STOP_AT)

// Initial state
let state = {
  from: '',
  to: '',
  quantity: '',
  currency: '',
  memo: '',
  trx_id: '',
  blockNumber: 0,
  blockHash: '',
  handlerVersionName: 'v1'
}

function stopAt(blockNumber) {
  // Function stop the service when meet the STOP_AT block number
  if (blockNumber >= STOP_AT) {
    console.log("\n####################\n# STOP AT: ", blockNumber)
    console.log("####################\n")
    process.exit(1)
  }
}

class ObjectActionHandler extends AbstractActionHandler {
  constructor([handleVersion], uri, username, password) {
    super([handleVersion])
    let options = {
      useNewUrlParser: true,
      useCreateIndex: true,
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
    if (STOP_AT) {
      stopAt(block.blockInfo.blockNumber)
    }
  }
}

module.exports = ObjectActionHandler

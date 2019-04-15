const mongoose = require('mongoose')

const { Schema } = mongoose

let Ledger = null

try {
  const LedgerSchema = new Schema({
    s: String,
    fromaccount: String,
    toaccount: String,
    amount: String,
    tokey: String,
    comment: String,
    nonce: String,
    trx_id: { type: String, unique: true },
    blockNumber: Number,
    blockHash: String,
    handlerVersionName: String
  })
  console.log("Schema for Ledger accounts created")
  Ledger = mongoose.model('Ledger', LedgerSchema)
} catch (e) {
  console.log(e)
  Ledger = mongoose.model('Ledger')
}

module.exports = Ledger

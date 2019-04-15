const mongoose = require('mongoose')

const { Schema } = mongoose

let Eos = null

try {
  const EosSchema = new Schema({
    from: String,
    to: String,
    quantity: String,
    currency: String,
    memo: String,
    trx_id: { type: String, unique: true },
    blockNumber: Number,
    blockHash: String,
    handlerVersionName: String
  })
  console.log("Schema for EOS accounts created")
  Eos = mongoose.model('Eos', EosSchema)
} catch (e) {
  console.log(e)
  Eos = mongoose.model('Eos')
}

module.exports = Eos

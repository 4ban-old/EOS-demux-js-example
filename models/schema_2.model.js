const mongoose = require('mongoose')

const { Schema } = mongoose

let mdl2 = null // model name

try {
  const mdl2Schema = new Schema({
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
  mdl2Schema.index({ from: 1, blockNumber: -1 })
  mdl2Schema.index({ to: 1, blockNumber: -1 })
  // mdl2Schema.index({ from: 1})
  // mdl2Schema.index({ to: 1})

  console.log("Schema for ACCOUNT_2 collection created")
  mdl2 = mongoose.model('mdl2collection', mdl2Schema)

  mdl2.listIndexes().then(indexes => {
    console.log("mdl2 collection indexes:", indexes);
  }).catch(console.error);

} catch (e) {
  console.log(e)
  console.log("mdl2 Schema in use")
  mdl2 = mongoose.model('mdl2collection')
}

module.exports = mdl2

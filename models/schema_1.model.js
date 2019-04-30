const mongoose = require('mongoose')

const { Schema } = mongoose

let mdl1 = null // model name

try {
  const mdl1Schema = new Schema({
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
  mdl1Schema.index({ from: 1, blockNumber: -1 })
  mdl1Schema.index({ to: 1, blockNumber: -1 })
  // mdl1Schema.index({ from: 1})
  // mdl1Schema.index({ to: 1})

  console.log("Schema for ACCOUNT_1 collection created")
  mdl1 = mongoose.model('mdl1collection', mdl1Schema)

  mdl1.listIndexes().then(indexes => {
    console.log("mdl1 collection indexes:", indexes);
  }).catch(console.error);

} catch (e) {
  console.log(e)
  console.log("mdl1 Schema in use")
  mdl1 = mongoose.model('mdl1collection')
}

module.exports = mdl1

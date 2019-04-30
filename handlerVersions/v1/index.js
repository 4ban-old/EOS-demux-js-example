const mongoose = require('mongoose')
const { Schema_1, Schema_2 } = require('../../models')
const account_1 = process.env.ACCOUNT_1
const account_2 = process.env.ACCOUNT_2

function parseTokenString(tokenString) {
  // Split token to amount and symbol
  const [amountString, symbolString] = tokenString.split(" ")
  const amount = parseFloat(amountString)
  const symbol = symbolString.trim()
  return { amount, symbol }
}

function mdl1Transactions(state, payload, blockInfo, context) {
  const { amount, symbol } = parseTokenString(payload.data.quantity)
  state.currency = symbol
  state.quantity = amount
  state.from = payload.data.from
  state.to = payload.data.to
  state.memo = payload.data.memo
  state.trx_id = payload.transactionId
  state.blockNumber = blockInfo.blockNumber
  state.blockHash = blockInfo.blockHash

  try {
    let transaction = new Schema_1({
      from: state.from,
      to: state.to,
      quantity: state.quantity,
      currency: state.currency,
      memo: state.memo,
      trx_id: state.trx_id,
      blockNumber: state.blockNumber,
      blockHash: state.blockHash,
      handlerVersionName: state.handlerVersionName
    })
    transaction.save(function (err) {
      if (err) console.log('Can not save into mdl1 collection')
    })
  } catch (err) {
      console.error(err)
  }

  context.stateMdl1Copy = JSON.parse(JSON.stringify(state))
}

function mdl2Transactions(state, payload, blockInfo, context) {
  const { amount, symbol } = parseTokenString(payload.data.quantity)
  state.currency = symbol
  state.quantity = amount
  state.from = payload.data.from
  state.to = payload.data.to
  state.memo = payload.data.memo
  state.trx_id = payload.transactionId
  state.blockNumber = blockInfo.blockNumber
  state.blockHash = blockInfo.blockHash

  try {
    let transaction = new Schema_2({
      from: state.from,
      to: state.to,
      quantity: state.quantity,
      currency: state.currency,
      memo: state.memo,
      trx_id: state.trx_id,
      blockNumber: state.blockNumber,
      blockHash: state.blockHash,
      handlerVersionName: state.handlerVersionName
    })
    transaction.save(function (err) {
      if (err) console.log('Can not save into mdl2 collection')
    })
  } catch (err) {
      console.error(err)
  }

  context.stateMdl2Copy = JSON.parse(JSON.stringify(state))
}


const updaters = [
  {
    actionType: `${account_1}::transfer`,
    apply: mdl1Transactions,
  },
  {
    actionType: `${account_2}::transfer`,
    apply: mdl2Transactions,
  },
]

function mdl1Update(payload, blockInfo, context) {
  console.log("\n\n\n", JSON.stringify(context.stateMdl1Copy, null, 2))
}

function mdl2Update(payload, blockInfo, context) {
  console.log("\n\n\n", JSON.stringify(context.stateMdl2Copy, null, 2))
}

const effects = [
  {
    actionType: `${account_1}::transfer`,
    run: mdl1Update,
  },
  {
    actionType: `${account_2}::transfer`,
    run: mdl2Update,
  },
]

const handlerVersion = {
  versionName: "v1",
  updaters,
  effects,
}

module.exports = handlerVersion

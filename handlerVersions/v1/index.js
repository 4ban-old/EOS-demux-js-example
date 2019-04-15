const mongoose = require('mongoose')
const { Eos, Ledger } = require('../../models')
const EOSaccount = process.env.EOS_ACCOUNT
const LEDGERaccount = process.env.LEDGER_ACCOUNT
const STOP_AT = parseInt(process.env.STOP_AT)

function parseTokenString(tokenString) {
  const [amountString, symbol] = tokenString.split(" ")
  const amount = parseFloat(amountString)
  return { amount, symbol }
}

function stopAt(blockNumber) {
  if (blockNumber >= STOP_AT) {
    console.log("\n####################\n# STOP AT: ", blockNumber)
    console.log("####################\n")
    process.exit(1)
  }
}
// Function to handle transactions for eosio.token contract action transfer.
function eosTransactions(state, payload, blockInfo, context) {
  // Save state
  const { amount, symbol } = parseTokenString(payload.data.quantity)
  state.currency = symbol
  state.quantity = amount
  state.from = payload.data.from
  state.to = payload.data.to
  state.memo = payload.data.memo
  state.trx_id = payload.transactionId
  state.blockNumber = blockInfo.blockNumber
  state.blockHash = blockInfo.blockHash

  if (STOP_AT) {
    stopAt(state.blockNumber)
  }
  // Saving into database
  try {
    let transaction = new Eos({
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
      if (err) console.log('Can not save into eos collection')
    })
  } catch (err) {
      console.error(err)
  }

  context.stateEosCopy = JSON.parse(JSON.stringify(state))
}
// Function to handle transactions for custom contract and custom action.
function ledgerTransactions(state, payload, blockInfo, context) {
  // Save state
  state.s = payload.data.s
  state.fromaccount = payload.data.fromaccount
  state.toaccount = payload.data.toaccount
  state.amount = payload.data.amount
  state.tokey = payload.data.tokey
  state.comment = payload.data.comment
  state.nonce = payload.data.nonce
  state.trx_id = payload.transactionId
  state.blockNumber = blockInfo.blockNumber
  state.blockHash = blockInfo.blockHash

  if (STOP_AT) {
    stopAt(state.blockNumber)
  }
  // Saving into database
  try {
    let transaction = new Ledger({
      s: state.s,
      fromaccount: state.fromaccount,
      toaccount: state.toaccount,
      amount: state.amount,
      tokey: state.tokey,
      comment: state.comment,
      nonce: state.nonce,
      trx_id: state.trx_id,
      blockNumber: state.blockNumber,
      blockHash: state.blockHash,
      handlerVersionName: state.handlerVersionName
    })
    transaction.save(function (err) {
      if (err) console.log('Can not save into Ledgers collection')
    })
  } catch (err) {
      console.error(err)
  }

  context.stateLedgerCopy = JSON.parse(JSON.stringify(state))
}

const updaters = [
  {
    actionType: `${EOSaccount}::transfer`,
    apply: eosTransactions,
  },
  {
    actionType: `${LEDGERaccount}::rcrdtfr`,
    apply: ledgerTransactions,
  },
]

function eosUpdate(payload, blockInfo, context) {
  // console.log("\n\n\n", JSON.stringify(context.stateEosCopy, null, 2))
  // console.log("Block Number:", JSON.stringify(context.stateEosCopy.blockNumber, null, 2))
}

function ledgerUpdate(payload, blockInfo, context) {
  // console.log("\n\n\n", JSON.stringify(context.stateLedgerCopy, null, 2))
  // console.log("Block Number:", JSON.stringify(context.stateLedgerCopy.blockNumber, null, 2))
}

const effects = [
  {
    actionType: `${EOSaccount}::transfer`,
    run: eosUpdate,
  },
  {
    actionType: `${LEDGERaccount}::rcrdtfr`,
    run: ledgerUpdate,
  },
]

const handlerVersion = {
  versionName: "v1",
  updaters,
  effects,
}

module.exports = handlerVersion

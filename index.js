require('dotenv').config()
const { BaseActionWatcher } = require("demux")
const { NodeosActionReader } = require("demux-eos") // eslint-disable-line
const ObjectActionHandler = require("./ObjectActionHandler")
const handlerVersion = require("./handlerVersions/v1")

const actionHandler = new ObjectActionHandler([handlerVersion], process.env.MONGODB_URL, process.env.MONGODB_USER, process.env.MONGODB_PASS)

const actionReader = new NodeosActionReader(
  process.env.ENDPOINT,
  parseInt(process.env.START_AT, 10),
  process.env.IRREVERSIBLE,
)

const actionWatcher = new BaseActionWatcher(
  actionReader,
  actionHandler,
  250,
)

actionWatcher.watch()

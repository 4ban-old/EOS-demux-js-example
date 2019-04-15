# EOS-demux-js-example
Example of daemon to monitor the EOS producer and record committed transactions for specific contracts and actions in the Mongo database.

> The example of API for this daemon you can find [here](https://github.com/4ban/EOS-demux-js-api-example)

## Description
This example allows to track the following actions:
* `<contract account name>::transfer`
* `<contract account name>::rcrdtfr` (any custom)

## Install
Install dependencies: `npm install`
Fill the `.env` file.

Available parameters:

```bash
ENDPOINT=https://eos.greymass.com
MONGODB_URL=mongodb://<ip_address>:27017/DBNAME
```

Start|Stop points if you need to run multiple copies for faster synchronization across ranges of blocks.
```bash
# Start point of tracking
# 0 - is a "tail" mode, where service start at an offset of the most recent blocks.
START_AT=100
# Stop point of tracking
# 0 - means that it will not stop
STOP_AT=200
```
To handle the microfork issue enable the processing of irreversible blocks only. Or implement `rollbackTo()` function based on the demux documentation.
```bash
# irreversible blocks only
IRREVERSIBLE=true
```
Accounts with contracts to track
```bash
# Contract account for EOS transfers
EOS_ACCOUNT=eosio.token
# Contract account for custom action rcrdtfr
LEDGER_ACCOUNT=CustomAccountName
```
Credentials
```bash
# Login and password from the database
MONGODB_USER=username
MONGODB_PASS=password
```

## Usage
To run the service: `npm start`

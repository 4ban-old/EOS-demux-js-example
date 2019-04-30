# demux-service
The daemon to monitor the EOS producer and record committed transactions (actions) into the Mongo database.

There are 2 identical models and effects for them in case to demonstrate how easy to modify it if you want to use different actions, models, save functions

## Description
This example tracks the transfer action for different contracts and store them into different collections in the Mongo database.
* `{contract account name 1}::transfer`
* `{contract account name 2}::transfer`
## Install
Install dependencies: `npm install`
Fill the `.env` file.

Available parameters:

```bash
# Mainnet
ENDPOINT=https://eos.greymass.com
# {server_address} is a ip address or domain name of the server
# EOS is a Mongo database name
MONGODB_URL=mongodb://{server_address}:27017/DBname
```
or
```bash
# Testnet
ENDPOINT=http://api.kylin.alohaeos.com
# {server_address} is a ip address or domain name of the server
# EOStest is a Mongo database name
MONGODB_URL=mongodb://{server_address}:27017/DBnameTest
```
Start | Stop points
```bash
# Start point of tracking
# 0 - is a "tail" mode, where service start at an offset of the most recent blocks.
START_AT=100
# Stop point of tracking
# 0 - means that it will not stop
STOP_AT=200
```
To handle the microfork issue enable the processing of irreversible blocks
```bash
# irreversible blocks only
IRREVERSIBLE=true
```
Accounts with contracts to track
```bash
ACCOUNT_1=eosio.token
ACCOUNT_2={contract_account_name 2}
```
Credentials
```bash
# Login and password from the database
MONGODB_USER={username}
MONGODB_PASS={password}
```

## Usage
To run the service: `npm start`

## Additional
For further use of the database, look at the example implementation of [API example](https://github.com/4ban/EOS-demux-js-api-example)

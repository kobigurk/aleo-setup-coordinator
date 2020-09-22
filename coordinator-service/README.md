# coordinator-service

## Build Guide

### Install Dependencies

First, to install the Node.js dependencies, run:
```
yarn install
```

Next, to install JQ, run:

*macOS*
```
brew install jq
```

*Ubuntu*
```
sudo apt-get install jq
```

### Initialization

First, to create the environment file for chunking, run:
```
cp ./config/local.env .env
```

Next, to reset the ceremony state, run:
```
yarn clean
```

Next, to initialize the database, run:
```
yarn setup
```

Lastly, to test this coordinator with a client, you must
[create the initial challenges using coordinator-client](../coordinator-client#initial-challenges-for-testing).

### Start

To start the server, run:
```
yarn start:watch
```

To query for ceremony state, run:
```
curl localhost:8080/ceremony | jq '.'
```

## Configuration

For help with command-line options, run:
```
yarn start:help
```

### Example Configuration

Depending on your environment, copy one of the below into `.env` in this directory:

* [local.env](./config/local.env) is a config for local development
* [azure.env](./config/azure.env) is a config for storing contributions in Azure blob storage

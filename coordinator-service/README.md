# coordinator-service

## Build Guide

To install the Node.js dependencies, run:
```
npm i
```

To build, run:
```
npm run build
```

Next, to create the environment file for chunking, run:
```
cp ./config/local.env .env
```

Reset the ceremony state:

```
npm run clean
```

Initialize the database:
```
npm run init-db
```

If you're going to test with a coordinator-client, you must create the
[initial challenges using
coordinator-client](../coordinator-client#initial-challenges-for-testing).

### Starting

Start:

```
npm run start-nodemon
```

Curl ceremony state:

```
curl localhost:8080/ceremony | jq '.'
```

## Configuration

See `--help` for details:

```
node dist/index.js --help
```

### Example configurations

Copy one of the below to `.env`:

* [local.env](./config/local.env) is a config for local development
* [azure.env](./config/azure.env) is congig for storing contributions in Azure blob storage

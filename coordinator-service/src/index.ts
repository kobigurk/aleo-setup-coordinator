import dotenv from 'dotenv'
import yargs = require('yargs')
import bodyParser from 'body-parser'
import fs from 'fs'
import path from 'path'
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from '@azure/storage-blob'

import { authAleo } from './auth-aleo'
import { authCelo } from './auth-celo'
import { authDummy } from './auth-dummy'
import { BlobChunkStorage } from './blob-chunk-storage'
import { ChunkStorage } from './coordinator'
import { DiskCoordinator } from './disk-coordinator'
import { DiskChunkStorage } from './disk-chunk-storage'
import { initExpress } from './app'
import { logger } from './logger'

dotenv.config()

const httpArgs = {
    port: {
        default: 8080,
        type: 'number',
    },
    'auth-type': {
        choices: ['aleo', 'celo', 'dummy'],
        default: 'dummy',
        type: 'string',
    },
    'chunk-storage-type': {
        choices: ['disk', 'azure'],
        default: 'disk',
        type: 'string',
    },
    'disk-chunk-storage-directory': {
        default: './.storage',
        type: 'string',
    },
    'disk-chunk-storage-url': {
        default: 'http://localhost:8080',
        type: 'string',
    },
    'azure-access-key-file': {
        type: 'string',
        describe: 'File with storage account access key',
    },
    'azure-storage-account': {
        type: 'string',
        describe: 'Azure storage account',
    },
    'azure-container': {
        type: 'string',
        describe: 'Azure container name to write contributions to',
    },
}

const cfgArgs = {
    'config-path': {
        type: 'string',
        demand: true,
        describe: 'Initial ceremony state file',
    },
}

const dbArgs = {
    'db-file': {
        default: './.storage/db.json',
        type: 'string',
    },
}

const argv = yargs
    .env('COORDINATOR')
    .command('http', 'Enable the HTTP server', { ...httpArgs, ...dbArgs })
    .command('init', 'Initialize the ceremony', { ...cfgArgs, ...dbArgs })
    .demandCommand(1, 'You must specify a command.')
    .strictCommands()
    .help().argv

function http(args): void {
    // Loads the storage for chunked contributions.
    // Supports `disk` and `azure` modes.
    let diskChunkStorage
    let chunkStorage: ChunkStorage
    if (args.chunkStorageType === 'disk') {
        const chunkStorageUrl = `${args.diskChunkStorageUrl}/chunks`
        diskChunkStorage = new DiskChunkStorage({
            storagePath: args.diskChunkStorageDirectory,
            chunkStorageUrl,
        })
        chunkStorage = diskChunkStorage
    } else if (args.chunkStorageType === 'azure') {
        const sharedKeyCredential = new StorageSharedKeyCredential(
            args.azureStorageAccount,
            fs.readFileSync(args.azureAccessKeyFile).toString(),
        )
        const containerClient = new BlobServiceClient(
            `https://${args.azureStorageAccount}.blob.core.windows.net`,
            sharedKeyCredential,
        ).getContainerClient(args.azureContainer)
        chunkStorage = new BlobChunkStorage({
            containerClient,
            sharedKeyCredential,
        })
    }

    // Select the appropriate authentication mode.
    // Supports `aleo`, `celo`, and `dummy` modes.
    const auth = {
        aleo: authAleo,
        celo: authCelo,
        dummy: authDummy,
    }[args.authType]

    // Initialize the app.
    const coordinator = new DiskCoordinator({ dbPath: args.dbFile })
    const app = initExpress({ auth, coordinator, chunkStorage })

    // If using the `disk` mode, enable endpoints for chunk contributions.
    if (args.chunkStorageType === 'disk') {
        app.use(bodyParser.raw({ limit: '5mb' }))
        app.post(
            '/chunks/:chunkId/contribution/:version',
            auth,
            async (req, res) => {
                const chunkId = req.params.chunkId
                const version = req.params.version
                const content = req.body

                logger.info(`POST /chunks/${chunkId}/contribution/${version}`)
                diskChunkStorage.setChunk(chunkId, version, content)
                res.json({ status: 'ok' })
            },
        )
        app.get('/chunks/:chunkId/contribution/:version', (req, res) => {
            const chunkId = req.params.chunkId
            const version = req.params.version

            logger.info(`GET /chunks/${chunkId}/contribution/${version}`)
            try {
                const content = diskChunkStorage.getChunk(chunkId, version)
                res.status(200).send(content)
            } catch (err) {
                logger.warn(err.message)
                res.status(500).json({ status: 'error', message: err.message })
            }
        })
    }

    // Start the server listener.
    app.listen(args.port, () => {
        logger.info(`listening on ${args.port}`)
    })
}

/**
 * Attempts to create a storage directory and initialize it.
 */
function init(args): void {
    // Returns `true` if the argument is instantiated. Otherwise, returns `false`.
    function isMissing(argument): boolean {
        return argument === null || argument === undefined
    }

    // Check that dbFile is set.
    if (isMissing(args.dbFile)) {
        throw new TypeError("Missing argument value for dbFile")
    }

    // Check that configPath is set.
    if (isMissing(args.configPath)) {
        throw new TypeError("Missing argument value for configPath")
    }

    // Attempt to create a storage directory.
    const dbPath = args.dbFile
    const storagePath = path.dirname(dbPath)
    try {
        fs.mkdirSync(storagePath, { recursive: true })
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error
        }
    }

    // Initialize the database based on configurations
    const config = JSON.parse(fs.readFileSync(args.configPath).toString())
    DiskCoordinator.init({ config, dbPath })
}

/**
 * If `init` is provided as argument input, this function initializes the database.
 * If `http` is provided as argument input, this function starts the server.
 *
 * @param args - Takes on either `init` or `http` as argument value.
 */
function main(args): void {
    logger.info('invoked with args %o', args)

    const command = args._[0]
    if (command === 'http') {
        http(args)
    } else if (command === 'init') {
        init(args)
    }
}

// Runs the `main` function on `argv`,
// which reads the `.env` file for configurations.
main(argv)

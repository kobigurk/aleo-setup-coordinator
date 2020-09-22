import axios from 'axios'
import dotenv from 'dotenv'
import execa = require('execa')
import fs from 'fs'
import yargs = require('yargs')
import tmp from 'tmp'

import { AuthAleo } from './auth-aleo'
import { AuthCelo } from './auth-celo'
import { AuthDummy } from './auth-dummy'
import { ChunkData } from './ceremony'
import {
    CeremonyParticipant,
    CeremonyContributor,
    CeremonyVerifier,
} from './ceremony-participant'
import { DefaultChunkUploader } from './chunk-uploader'
import { logger } from './logger'
import {
    extractPowersoftau,
    Phase1New,
    ShellContributor,
    ShellVerifier,
    ShellCommand,
} from './shell-contributor'

dotenv.config()
tmp.setGracefulCleanup()

async function powersoftau(): Promise<void> {
    const passThroughArgs = process.argv.slice(3)
    const tmpFile = await extractPowersoftau()

    const subprocess = execa(tmpFile.name, passThroughArgs)
    subprocess.stdout.pipe(process.stdout)
    subprocess.stderr.pipe(process.stderr)

    try {
        await subprocess
    } catch (err) {
        // If exitCode is missing it probably means we couldn't even run the
        // powersoftau, which might indicate a bug somewhere in this code.
        if (typeof subprocess.exitCode === 'undefined') {
            logger.error(err)
            process.exit(1)
        }
        process.exit(subprocess.exitCode)
    }
}

function sleep(msec): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, msec))
}

async function work({
    client,
    contributor,
}: {
    client: CeremonyParticipant
    contributor: (chunk: ChunkData) => ShellCommand
}): Promise<void> {
    const lockBackoffMsecs = 5000

    let incompleteChunks = await client.getChunksRemaining()
    while (incompleteChunks.length) {
        const ceremony = await client.getCeremony()
        console.log("Ceremony State -", ceremony)

        const completedChunkCount = ceremony.chunks.length - incompleteChunks.length
        const remainingChunkIds = incompleteChunks.map((chunk) => chunk.chunkId)
        logger.info(
            `completed ${completedChunkCount} / ${ceremony.chunks.length}`,
        )
        logger.info(`incomplete chunks: %o`, remainingChunkIds)
        const chunk = await client.getLockedChunk()
        if (chunk) {
            logger.info(`locked chunk ${chunk.chunkId}`)
            try {
                // TODO: pull up out of if and handle errors
                const contribute = contributor(chunk)
                await contribute.load()

                const contributionPath = await contribute.run()
                logger.info('uploading contribution %s', contributionPath)
                const content = fs.readFileSync(contributionPath)
                await client.contributeChunk(chunk.chunkId, content)

                contribute.cleanup()
            } catch (error) {
                logger.warn(error, 'contributor failed')
                // TODO(sbw)
                // await client.unlockChunk(chunk.chunkId)
            }
        } else {
            logger.info('unable to lock chunk')
        }
        await sleep(lockBackoffMsecs)
        incompleteChunks = await client.getChunksRemaining()
    }

    logger.info('no more chunks remaining')
}

async function newChallenge(args): Promise<void> {
    const powersoftauNew = new Phase1New({
        contributorCommand: args.command,
        seedFile: args.seedFile,
    })

    const chunkUploader = new DefaultChunkUploader({ auth: args.auth })

    for (let chunkIndex = 0; chunkIndex < args.count; chunkIndex++) {
        logger.info(`creating challenge ${chunkIndex + 1} of ${args.count}`)
        const contributionPath = tmp.tmpNameSync()

        await powersoftauNew.run({
            chunkIndex,
            contributionPath,
        })
        const url = `${args.apiUrl}/chunks/${chunkIndex}/contribution/0`
        await chunkUploader.upload({
            url,
            content: fs.readFileSync(contributionPath),
        })
        logger.info('uploaded %s', url)

        fs.unlinkSync(contributionPath)
    }
}

async function contribute(args): Promise<void> {
    const participantId = args.participantId
    const baseUrl = args.apiUrl

    const chunkUploader = new DefaultChunkUploader({ auth: args.auth })
    const client = new CeremonyContributor({
        auth: args.auth,
        participantId,
        baseUrl,
        chunkUploader,
    })

    const contributor = (chunkData: ChunkData): ShellContributor => {
        return new ShellContributor({
            chunkData: chunkData,
            contributorCommand: args.command,
            seedFile: args.seedFile,
        })
    }

    await work({ client, contributor })
}

async function verify(args): Promise<void> {
    const participantId = args.participantId
    const baseUrl = args.apiUrl

    const chunkUploader = new DefaultChunkUploader({ auth: args.auth })
    const client = new CeremonyVerifier({
        auth: args.auth,
        participantId,
        baseUrl,
        chunkUploader,
    })

    const contributor = (chunkData: ChunkData): ShellVerifier => {
        return new ShellVerifier({
            chunkData: chunkData,
            contributorCommand: args.command,
        })
    }

    await work({ client, contributor })
}

async function httpAuth(args): Promise<void> {
    process.stdout.write(
        args.auth.getAuthorizationValue({
            method: args.method,
            path: args.path,
        }),
    )
}

async function ctl(args): Promise<void> {
    const method = args.method
    const path = args.path
    const url = `${args.apiUrl.replace(/$\//, '')}/${path.replace(/^\//, '')}`
    let data
    if (args.data) {
        data = JSON.parse(fs.readFileSync(args.data).toString())
    }

    const result = await axios({
        method,
        url,
        data,
        headers: {
            Authorization: args.auth.getAuthorizationValue({
                method,
                path,
            }),
        },
    })
    if (result.headers['content-type'].includes('application/json')) {
        console.log(JSON.stringify(result.data, null, 2))
    } else {
        console.log(result.statusText)
    }
}

async function main(): Promise<void> {
    if (process.argv[2] === 'powersoftau') {
        await powersoftau()
        return
    }

    const phase1Args = {
        command: {
            type: 'string',
            describe: 'Override the built-in phase1 command',
        },
    }

    const seedArgs = {
        'seed-file': {
            type: 'string',
            demand: true,
            describe:
                'Path to file containing 32-character hexadecimal seed value',
        },
    }

    const participateArgs = {
        'api-url': {
            default: 'http://localhost:8080',
            type: 'string',
            describe: 'Ceremony API url',
        },
        'auth-type': {
            choices: ['aleo', 'celo', 'dummy'],
            default: 'dummy',
            type: 'string',
        },
        'participant-id': {
            type: 'string',
            demand: true,
            describe: 'ID of ceremony participant',
        },
        'aleo-private-key': {
            type: 'string',
            describe: 'Private key if using Aleo auth (for development)',
        },
        'aleo-private-key-file': {
            type: 'string',
            describe: 'Path to private key if using Aleo auth',
        },
        'celo-private-key': {
            type: 'string',
            describe: 'Private key if using Celo auth (for development)',
        },
        'celo-private-key-file': {
            type: 'string',
            describe: 'Path to private key if using Celo auth',
        },
    }

    const args = yargs
        .env('COORDINATOR')
        .config('config', (configPath) => {
            dotenv.config({ path: configPath })
            return {}
        })
        .command('new', 'Create new challenges for a ceremony', {
            ...participateArgs,
            ...phase1Args,
            ...seedArgs,
            count: {
                type: 'number',
                demand: true,
                describe: 'Number of challenges',
            },
        })
        .command('contribute', 'Run the process to make contributions', {
            ...participateArgs,
            ...phase1Args,
            ...seedArgs,
        })
        .command('verify', 'Run the process to verify contributions', {
            ...participateArgs,
            ...phase1Args,
        })
        .command('ctl', 'Control the coordinator-service', {
            ...participateArgs,
            method: {
                type: 'string',
                demand: true,
                describe: 'HTTP method',
            },
            path: {
                type: 'string',
                demand: true,
                describe: 'HTTP resource path',
            },
            data: {
                type: 'string',
                describe: 'JSON request body',
            },
        })
        .command('http-auth', 'Print Authorization header to stdout', {
            ...participateArgs,
            method: {
                type: 'string',
                demand: true,
                describe: 'HTTP method',
            },
            path: {
                type: 'string',
                demand: true,
                describe: 'HTTP resource path',
            },
        })
        .command(
            'powersoftau',
            'Run built-in phase1 command directly',
            (yargs) => {
                return yargs.help(false).version(false)
            },
        )
        .demandCommand(1, 'You must specify a command.')
        .strictCommands()
        .help().argv

    logger.debug('invoked with args %o', args)

    const mode = args._[0]
    let powersoftauTmpFile
    if (!args.command) {
        powersoftauTmpFile = await extractPowersoftau()
        args.command = powersoftauTmpFile.name
        logger.debug(`using built-in phase1 at ${args.command}`)
    }

    if (args.authType === 'aleo') {
        let privateKey = args.aleoPrivateKey
        if (!privateKey) {
            privateKey = fs.readFileSync(args.aleoPrivateKeyFile).toString()
        }

        args.auth = new AuthAleo({
            address: args.participantId,
            privateKey,
        })
    } else if (args.authType === 'celo') {
        let privateKey = args.celoPrivateKey
        if (!privateKey) {
            privateKey = fs.readFileSync(args.celoPrivateKeyFile).toString()
        }

        args.auth = new AuthCelo({
            address: args.participantId,
            privateKey,
        })
    } else {
        args.auth = new AuthDummy(args.participantId)
    }

    try {
        if (mode === 'new') {
            await newChallenge(args)
        } else if (mode === 'contribute') {
            await contribute(args)
        } else if (mode === 'verify') {
            await verify(args)
        } else if (mode === 'http-auth') {
            await httpAuth(args)
        } else if (mode === 'ctl') {
            await ctl(args)
        } else {
            logger.error(`Unexpected mode ${mode}`)
            process.exit(1)
        }
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }

    process.exit(0)
}

main()

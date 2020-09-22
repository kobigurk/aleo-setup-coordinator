// TODO (howardwu): Swap this for Aleo authentication.
import { verifySignature } from '@celo/utils/lib/signatureUtils'

/**
 * Middleware that authenticates a request using Aleo accounts.
 *
 * @remarks
 * Uses the Authorization header in the following form:
 *   Authorizaton: Aleo Account-Address:Signature
 * Signature signs a message of the following form: HTTP-Verb Request-Path
 **/
// TODO (howardwu): Swap this for Aleo authentication.
export function authAleo(req, res, next): void {
    let address
    let serializedSignature

    try {
        if (!('authorization' in req.headers)) {
            throw new Error('Missing authorization header')
        }
        const authorization = req.headers.authorization

        const [
            authorizationType,
            authorizationCredentials,
        ] = authorization.split(' ')
        if (authorizationType.toLowerCase() !== 'aleo') {
            throw new Error(
                `Unexpected authorization type ${authorizationType}`,
            )
        } else if (!authorizationCredentials) {
            throw new Error('Missing authorization credentials')
        }

        const split = authorizationCredentials.split(':')
        address = split[0]
        serializedSignature = split[1]
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message,
        })
        next(error)
        return
    }

    const message = `${req.method.toLowerCase()} ${req.path.toLowerCase()}`
    const verified = verifySignature(message, serializedSignature, address)
    if (!verified) {
        const error = new Error('Invalid authorization')
        res.status(401).json({
            status: 'error',
            message: error.message,
        })
        next(error)
        return
    }
    req.participantId = address
    next()
}

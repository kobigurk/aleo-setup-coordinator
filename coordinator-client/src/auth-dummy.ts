import { Auth } from './auth'

export class AuthDummy implements Auth {
    participantId: string

    constructor(participantId) {
        this.participantId = participantId
    }

    async getAuthorizationValue({
        method, // eslint-disable-line @typescript-eslint/no-unused-vars
        path, // eslint-disable-line @typescript-eslint/no-unused-vars
    }: {
        method: string
        path: string
    }): Promise<string> {
        return `Dummy ${this.participantId}`
    }
}

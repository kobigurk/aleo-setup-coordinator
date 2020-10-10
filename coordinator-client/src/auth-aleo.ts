// TODO (howardwu): Swap this for Aleo authentication.
import { Auth } from './auth'

const wasm_module = import('../snarkos-toolkit/snarkos_toolkit');

// TODO (howardwu): Swap this for Aleo authentication.
export class AuthAleo implements Auth {
    address: string
    privateKey: string

    constructor({
        address,
        privateKey,
    }: {
        address: string
        privateKey: string
    }) {
        this.address = address
        this.privateKey = privateKey
    }

    async getAuthorizationValue({
        method,
        path,
    }: {
        method: string
        path: string
    }): Promise<string> {
        const message = `${method.toLowerCase()} ${path.toLowerCase()}`

        // TODO preload the wasm module instead of loading it per authorization call
        //  This will likely increase efficiency quite a bit.
        let signature_promise = wasm_module.then(toolkit => {
            // Sign the message with the view key
            let view_key = toolkit.ViewKey.from_private_key(this.privateKey);
            let signature = view_key.sign(message);

            return signature;
        })
        .catch(console.error);

        let signature = await signature_promise;

        return `Aleo ${this.address}:${signature}`
    }
}

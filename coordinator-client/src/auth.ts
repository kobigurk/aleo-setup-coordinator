export interface Auth {
    getAuthorizationValue({
        method,
        path,
    }: {
        method: string
        path: string
    }): Promise<string>
}

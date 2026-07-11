export declare const CLIENT_ID = "app_EMoamEEZ73f0CkXaXp7hrann";
export declare const DEFAULT_ISSUER = "https://auth.openai.com";
export declare const DEFAULT_CODEX_ENDPOINT = "https://chatgpt.com/backend-api/codex/responses";
export declare const OAUTH_DUMMY_KEY = "opencode-oauth-dummy-key";
export interface BrowserAuthorizationOptions {
    ports?: readonly number[];
    timeoutMs?: number;
    cancelRetries?: number;
    cancelRetryMs?: number;
}
export interface OAuthTokens {
    id_token?: string;
    access_token: string;
    refresh_token: string;
    expires_in?: number;
}
export interface TokenIdentity {
    accountId?: string;
    email?: string;
    subjectID?: string;
    organizationID?: string;
}
export declare function tokenIdentity(tokens: Pick<OAuthTokens, "id_token" | "access_token">): TokenIdentity;
export declare function refreshTokens(refreshToken: string, issuer?: string): Promise<OAuthTokens>;
export declare function cancelBrowserAuthorization(message?: string): void;
export declare function browserAuthorization(issuer?: string, options?: BrowserAuthorizationOptions): Promise<{
    url: string;
    callback: Promise<OAuthTokens>;
}>;
export declare function deviceAuthorization(issuer?: string): Promise<{
    url: string;
    code: string;
    callback(): Promise<OAuthTokens>;
}>;

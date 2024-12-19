import {
    SigninPopupArgs,
    SigninRedirectArgs,
    SigninSilentArgs,
    SignoutPopupArgs,
    SignoutRedirectArgs,
    UserManagerSettings,
    UserManager, OidcClient, CreateSigninRequestArgs,
    User as OidcUser, SignoutResponse,
    SigninRequest
} from 'oidc-client-ts';

/**
 * @augments UserManagerSettings
 */
export interface OidcSettings extends UserManagerSettings {

}

/**
 * @augments UserManager
 */
export class OidcManager extends UserManager {
    constructor(settings: OidcSettings) {
        super(settings);
    }
    getClient(): OidcClient {
        return this._client;
    }

}

/**
 * Login request to generate authz url.
 * @augments SigninRequest
 */
export interface LoginRequest extends SigninRequest {

}

/**
 * options for Login request to generate authz url.
 * It's based of the parameters in OIDC specs
 * @augments CreateSigninRequestArgs
 */
export interface LoginRequestOptions extends CreateSigninRequestArgs {

}

/**
 * Options to override options during redirect login
 * @augments SigninRedirectArgs
 */
export interface LoginRedirectOptions extends SigninRedirectArgs {

}

/**
 * Response state holding sign out errors if any
 * @augments SignoutResponse
 */
export interface LogoutResponse extends SignoutResponse {

}

/**
 * Options to override options during redirect logout
 * @augments SignoutRedirectArgs
 */
export interface LogoutRedirectOptions extends SignoutRedirectArgs {

}

/**
 * Options to override options during popup sign in
 * @augments SigninPopupArgs
 */
export interface PopupSignInOptions extends SigninPopupArgs {

}

/**
 * Options to override options during popup sign out
 * @augments SignoutPopupArgs
 */
export interface PopupSignOutOptions extends SignoutPopupArgs {

}

/**
 * Options to override options during silent sign in
 * @augments SigninSilentArgs
 */
export interface RenewTokenOptions extends SigninSilentArgs {

}

/**
 * Authenticated user information including token, id_token and claims
 * @augments OidcUser
 */
export class User extends OidcUser {

}
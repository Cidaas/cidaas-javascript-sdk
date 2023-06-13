import { UserManager, UserManagerSettings } from "oidc-client-ts";
export declare class Authentication {
    webAuthSettings: UserManagerSettings;
    userManager: UserManager;
    constructor(webAuthSettings: UserManagerSettings, userManager: UserManager);
    /**
     * redirect sign in
     * @param view_type
     */
    redirectSignIn(view_type: string): void;
    /**
     * redirect sign in callback
     * @returns
     */
    redirectSignInCallback(): Promise<unknown>;
    /**
     * redirect sign out
     * @returns
     */
    redirectSignOut(): Promise<unknown>;
    /**
     * redirect sign out callback
     * @returns
     */
    redirectSignOutCallback(): Promise<unknown>;
    /**
     * pop up sign in
     */
    popupSignIn(): void;
    /**
     * pop up sign in callback
     */
    popupSignInCallback(): void;
    /**
     * pop up sign out
     */
    popupSignOut(): void;
    /**
     * silent sign in
     */
    silentSignIn(): void;
    /**
     * silent sign in callback
     */
    silentSignInCallback(): void;
    /**
     * silent sign in callback v2
     * @returns
     */
    silentSignInCallbackV2(): Promise<unknown>;
    /**
     * silent sign out callback
     */
    popupSignOutCallback(): void;
}

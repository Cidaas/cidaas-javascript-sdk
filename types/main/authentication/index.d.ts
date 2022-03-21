export = Authentication;
declare function Authentication(): void;
declare class Authentication {
    redirectSignIn(view_type: any): void;
    redirectSignInCallback(): Promise<any>;
    redirectSignOut(): Promise<any>;
    redirectSignOutCallback(): Promise<any>;
    popupSignIn(): void;
    popupSignInCallback(): void;
    popupSignOut(): void;
    popupSignOutCallback(): void;
    silentSignIn(): void;
    silentSignInCallback(): void;
    silentSignInCallbackV2(): Promise<any>;
}

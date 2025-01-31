# Upgrading Notes
This document described how to handle breaking changes from upgrading Cidaas Javascript SDK v4.x.x to the stable v5.0.0 release.

## 1. call functions from its own module

Previously all of javascript sdk functions are called from webauth. Now the functions will be called from its modules. Cidaas ConfigUserProvider have to be initialised to be added to each of the modules as dependencies.

Example of Cidaas Service:
```js
export class CidaasService {
    cidaasConfigUserProvider: ConfigUserProvider;
    authenticationService: AuthenticationService;
    verificationService: VerificationService;
    options: OidcSettings = { ... };

    constructor() {
        // init ConfigUserProvider
        this.cidaasConfigUserProvider = new ConfigUserProvider(this.options);
        // init authentication module
        this.authenticationService = new AuthenticationService(this.cidaasConfigUserProvider);
        // init verification module
        this.verificationService = new VerificationService(this.cidaasConfigUserProvider);
    }

    // get authentication module
    getAuthenticationService() {
        return this.authenticationService;
    }

    // get verification module
    getVerificationService() {
        return this.verificationService
    }
}
```

Usage in Component:
 ```js
 // inject cidaas service
constructor(private cidaasService: CidaasService, ...) {}

...

// init each of cidaas modules which are needed in the component
this.cidaasAuthenticationService = this.cidaasService.getAuthenticationService();
this.cidaasVerificationService = this.cidaasService.getVerificationService();

...

// call functions from each of the modules
this.cidaasAuthenticationService.loginCallback();
...
this.cidaasVerificationService.getMFAList(getMFAListOptions);
...

```

Each of the functions and its module can be looked in the [documentation](https://cidaas.github.io/cidaas-javascript-sdk).

## 2. Update access token handling

As the SDK now using user storage to handle access token, if previously you saved the token manually, check whether there is conflict between access token in user storage & client side implementation. If you don't want to use user storage, you can use InMemoryWebStorage to remove all tokens information from the storage after refreshing the app.

```js
const options = {
    authority: 'your domain base url',
    ...,
    userStore: new WebStorageStateStore({ store: new InMemoryWebStorage()})
}
```

## 3. Use the latest functions & enums

There are changes in the function names. The old & new function name can be found below:

| Old Function                                      | New Function                                |
|---------------------------------------------------|---------------------------------------------|
| getUserInfo                                       | getUserInfoFromStorage                      |
| getAccessToken                                    | generateTokenFromCode                       |

If you used setAcceptLanguageHeader() function, it is now moved to Helper class and can be called with static call Helper.setAcceptLanguageHeader().

There are changes in enums. If you used UPPERCASE to call enum member previously, now they have been standardize to use PascalCase instead.

Use enum instead of string for the following properties:
* LoginWithCredentialsRequest.username_type: UsernameType
* PasswordlessLoginRequest.verificationType: VerificationType
* GenerateTokenFromCodeRequest.grant_type: GrantType
* InitiateResetPasswordRequest.resetMedium: ResetMedium
* InitiateResetPasswordRequest.processingType: ProcessingType
* InitiateAccountVerificationRequest.processingType: ProcessingType

Some parameters in function has been updated. Some has been removed because it is deprecated. The details can be found below:
* getDevicesInfo(options?: void, access_token?: string) is now getDevicesInfo(access_token?: string) 
* firstTimeChangePassword(options: FirstTimeChangePasswordRequest) is now firstTimeChangePassword(options: FirstTimeChangePasswordRequest, trackId; string). The trackId has the same value as previously loginSettingsId from FirstTimeChangePasswordRequest.
* updateProfile(options: CidaasUser, access_token?: string, sub?: string) is now updateProfile(options: CidaasUser, sub: string, access_token?: string).
* getLinkedUsers(access_token?: string, sub?: string) is now getLinkedUsers(sub: string, access_token?: string)
* initiateMFA(options: InitiateMFARequest, accessToken?: string, headers?: HTTPRequestHeader) is now initiateMFA(options: InitiateMFARequest, headers?: HTTPRequestHeader)
* mfaContinue(options: MfaContinueRequest) is now mfaContinue(options: LoginPrecheckRequest)

## 4. Handling for removed functions and properties

* If you used silentSignin() previously, it has now been reimplemented as renewToken() function. The previous existing renewToken() function is removed, to be replaced by the new implementation, which will look for refresh token in user storage instead of using function parameter.
* If you used silentSignInCallback() or popupSignInCallback() previously, now it is recommended to use loginCallback() instead.
* If you used popupSignOutCallback() previously, now it is recommended to use logoutCallback() instead.
* If you used logoutUser() previously, you can now use logout() function instead.
* In case you need to use validateAccessToken() on the client side, offlineTokenCheck() function can be used as it only check on general token information without involving secret key. Generally, it is recommended to do token introspection on the server side.
* In case you used createPreloginWebauth function, javascript sdk now support multiple configuration instance. You can create an additional configuration needed for prelogin case.

The following deprecated properties should be updated to the latest supported properties:

| Deprecated Properties                             | Latest Supported Properties                 |
|---------------------------------------------------|---------------------------------------------|
| CidaasUser.user_status                            | CidaasUser.userStatus                       |
| CidaasUser.userGroups                             | CidaasUser.groups                           |
| TokenClaim.clientid                               | TokenClaim.aud                              |
| TokenClaim.scope                                  | TokenClaim.scopes                           |
| TokenClaim.role                                   | TokenClaim.roles                            |


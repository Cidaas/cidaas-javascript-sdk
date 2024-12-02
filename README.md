![Logo](https://raw.githubusercontent.com/Cidaas/cidaas-javascript-sdk/master/logo.jpg)

## About cidaas:
[cidaas](https://www.cidaas.com)
 is a fast and secure Cloud Identity & Access Management solution that standardises what’s important and simplifies what’s complex.

## Feature set includes:
* Single Sign On (SSO) based on OAuth 2.0, OpenID Connect, SAML 2.0 
* Multi-Factor-Authentication with more than 14 authentication methods, including TOTP and FIDO2 
* Passwordless Authentication 
* Social Login (e.g. Facebook, Google, LinkedIn and more) as well as Enterprise Identity Provider (e.g. SAML or AD) 
* Security in Machine-to-Machine (M2M) and IoT

# Cidaas Javascript SDK

This cidaas Javascript SDK library is built on the top of [OIDC client typescript library](https://github.com/authts/oidc-client-ts). 

Please check the [Changelog](https://github.com/Cidaas/cidaas-sdk-javascript-v2/blob/master/CHANGELOG.md) for more information about the latest release.

## Table of Contents

<!--ts-->
* [Installation](#installation)
* [Initialisation](#initialisation)
* [Usage](#usage)
* [Functions Overview](#functions-overview)
    <!--ts-->
    * [Authentication Functions](#authentication-functions)
    * [Login Management](#login-management)
    * [User Management](#user-management)
    * [Token Management](#token-management)
    * [Verification Management](#verification-management)
    * [Consent Management](#consent-management)
    * [Other Functionality](#other-functionality)
    <!--te-->
* [Possible Error](#possible-error)

### Installation

From CDN

```html
<!-- Replace the required <version> in the script tag, example: 4.0.0. All the released tag can be found https://www.npmjs.com/package/cidaas-javascript-sdk?activeTab=versions -->
<script src="https://cdn.cidaas.de/javascript/oidc/<version>/cidaas-javascript-sdk.min.js"></script>
```

From npm

```
npm install cidaas-javascript-sdk
```

### Initialisation

After adding the sdk library, create a local file such as **cidaas.service.ts** and define Cidaas options variable there for initializing cidaas sdk.

Cidaas options variable support every [OIDC Client UserManagerSettings Properties](https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html) which has the following notable properties:

| Property Name | Required | Description |
| ------ | ------ | ------ |
| authority | yes | cidaas instance base url |
| client_id | yes | client application's identifier, which could be found in cidaas admin ui |
| redirect_uri | yes | URL to be redirected after successful login attempt. |
| post_logout_redirect_uri | no | URL to be redirected after successful logout attempt. |
| scope | no | the scope the application requires and requests from cidaas. The default value is 'openid' if no properties is being sent. |
| userStore | no | define where authenticated user information will be saved on the client application. The default value is session storage if no properties is being sent. |
| automaticSilentRenew | no | configure whether automatic token renewal will be activated. The default value is true. |

an example of Cidaas options variable looks like this:

```js
const options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    scope: 'openid email roles profile',
}
```

### Configure user storage (Optional)

The following storages are supported to store authenticated user information, such as tokens information & user profile:
* window.sessionStorage (default)
* window.localStorage
* InMemoryWebStorage (all Information will be cleared after browser refresh) in case user do not want to save token in window object

additionally, user can also define custom storage in the client side by implementing Storage class.

If there is no userStore properties being send in Cidaas options variable, it will use session storage by default.

In case local storage is prefered to be used, then Cidaas options can be modified as following:

```js
const options = {
    authority: 'your domain base url',
    ...,
    userStore: new WebStorageStateStore({ store: window.localStorage })
}
```

In case custom solution for storing authenticated user information is being used, or saving the token in memory is preferred, you can configured userStore with InMemoryWebStorage. Authenticated user information will be cleared as soon as the page is refreshed afterwards.

```js
const options = {
    authority: 'your domain base url',
    ...,
    userStore: new WebStorageStateStore({ store: new InMemoryWebStorage()})
}
```

see [usage](#get-tokens-and-user-profile-information-from-user-storage) to get the stored informations from user storage.

### Configure automatic token renewal (Optional)

By default, The SDK will generate new tokens based on refresh token stored in user storage, one minute before the access token is expiring. To disable this behaviour, Cidaas options can be modified as following:

```js
const options = {
    authority: 'your domain base url',
    ...,
    automaticSilentRenew: false
}
```

### Initialise the cidaas sdk using the configured options mentioned above:

```js
const cidaas = new CidaasSDK.WebAuth(options);
```

### Usage

#### Login With Browser

To login through cidaas sdk, call **loginWithBrowser()**. This will redirect you to the hosted login page.

```js
cidaas.loginWithBrowser();
```

once login is successful, it will automatically redirects you to redirect_uri you have configured in cidaas options. You will get information such as code & state as redirect url parameter (query or fragment), which is needed to get access token.

To complete the login process, call **logincallback()**.

```js
cidaas.loginCallback().then(function(response) {
    // the response will give you login details.
}).catch(function(ex) {
    // your failure code here
});
```

After successful loginCallback, You will get access token, along with id token and refresh token in the json response, depends on your application configuration.

There are code documentations for each of the functions with example code of how to call them individually.

#### Get Tokens And User Profile Information From User Storage

To get information from user storage, call **getUserInfoFromStorage()**. This function will fetch stored information from predefined user storage (session storage, local storage or in memory)

```js
cidaas.getUserInfoFromStorage().then(function(response) {
    // the response will contains tokens & user profile information.
}).catch(function(ex) {
    // your failure code here
});
```

### Functions Overview

Cidaas Javascript SDK features the following functionality:

#### Authentication Functions

The SDK offers multiple way to authenticate user. Whether using browser redirection, in a pop up window, or in an iframe for silent sign in. The functions for authentication could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/authentication/Authentication.ts)

| SDK Functions                                                                    | Description                                                                                                                                                                    |
|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| loginWithBrowser, registerWithBrowser, loginCallback, logout, logoutCallback | The SDK support browser redirection for authenticating user. The authentication process will then happens in a new tab. This is the default authentication function of the SDK |
| popupSignIn, popupSignInCallback, popupSignOut, popupSignOutCallback             | The SDK support using pop up window for authenticating user. The authentication process will then happens in a new popup window                                                      |
| renewToken                           | Session renewal is possible by using refresh token                                                  |

#### Login Management

The login functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/login-service/LoginService.ts). The SDK support the following login management functions:

| SDK Functions                                            | Description                                                                                                                                                                                         |
|----------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| passwordlessLogin, loginWithCredentials, loginWithSocial | User could authenticate themselves using passwordless authentication, classic password credentials, as well as using social provider such as google or social media platform                        |
| loginPrecheck, consentContinue, firstTimeChangePassword, mfaContinue    | Depending on the missing information from loginPrecheck, user will be redirected to another page after login to either  accepting consent, changing password, continuing MFA process, or do progressive registration  |
| getMissingFields, progressiveRegistration                                  | In case a new required field is added in registration settings, it is possible to use the sdk to inform user of the changes and asked them to fill in the missing required fields by the next login |
| loginAfterRegister                                  | By calling this sdk function, user could directly login to the app after successful registration |
| actionGuestLogin                                  | If user has guestLoginForm prepared, it could be called using this function |

#### User Management

The user functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/user-service/UserService.ts). The SDK support the following user management functions:

| SDK Functions                                                                                                                       | Description                                                                                                                                                                                                                                 |
|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| getRegistrationSetup, register, registerWithSocial                                                                                                        | Registering a new user is possible by using classic registration (getting registration fields information & call register function) or by using social provider                                                                                                                                       |
| getUserProfile, getInviteUserDetails, getCommunicationStatus, updateProfile, updateProfileImage, deleteUserAccount, userCheckExists | To maintain user, functions for getting user information by using cidaas internal api, updating user information, removing user, as well as check if user exist are supported                                                                                                           |
| getUserInfoFromStorage | The SDK could be used to get user information from predefined user storage by using oidc client ts library                                                                                                           |
| getUserActivities | In case user want to see the history of his activities, getUserActivities function is provided                                                                                                           |
| initiateResetPassword, handleResetPassword, resetPassword                                                                           | In case user want to reset password, password reset flow is supported. From initiating the reset password, handling the code or link which has been sent to predefined medium such as email, sms & ivr, and finishing up the reset password |
| changePassword                                                                                                                      | In case user want to change password, changePassword function is provided                                                                                                                                                                  |
| registerDeduplication, deduplicationLogin, getDeduplicationDetails                                                                  | In case a new user is registered with similiar information as existing user, deduplication could be activated to either proceed with the registration, or combine the user with an existing one                                             |
| initiateLinkAccount, completeLinkAccount, unlinkAccount, getLinkedUsers                                                             | Linking und unlinking user account with another account, as well as getting linked user is supported                                                                                                                                        |

#### Token Management

The token functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/token-service/TokenService.ts). The SDK support the following token management functions:

| SDK Functions                        | Description                                                                                         |
|--------------------------------------|-----------------------------------------------------------------------------------------------------|
| generateTokenFromCode                       | The SDK facilitate login using PKCE flow by exchanging code after succesful login with token(s) such as access token, id token, refresh token |
| initiateDeviceCode, deviceCodeVerify | Device code flow is supported for authenticating user without user interaction possibilty in device |
| validateAccessToken                  | Token validation could be done by using introspection endpoint                                      |
| offlineTokenCheck                    | To save API call, offline token check function could be used                                        |

#### Verification Management

The verification functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/verification-service/VerificationService.ts). The SDK support the following verification management functions:

| SDK Functions                                                       | Description                                                                           |
|---------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| initiateMFA, authenticateMFA                                        | The SDK support initiating & authenticating MFA, which starts passwordless login flow |
| initiateAccountVerification, verifyAccount                          | User account verification using preconfigured MFA is supported                         |
| cancelMFA                                                           | MFA process could be aborted in case something go the wrong way                     |
| getAllVerificationList, getMFAList, checkVerificationTypeConfigured | Information about every supported MFA Verification types, List of configured MFA, and details about particular configured verification type are provided by the SDK        |
| initiateEnrollment, enrollVerification, getEnrollmentStatus         | Additional MFA verification type could be enrolled using the sdk                                   |
| initiateVerification, configureVerification, configureFriendlyName         | The SDK support configuring verification request as well as friendly name |

#### Consent Management

The consent functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/consent-service/ConsentService.ts). The SDK support the following consent management functions:

| SDK Functions                                                             | Description                                                                                                           |
|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| getConsentDetails, getConsentVersionDetails                               | The SDK could be used to get consent details as well as details of consent's version                                  |
| acceptConsent, acceptScopeConsent, acceptClaimConsent, revokeClaimConsent | The SDK support accepting consent (app level consent, scope consent or claim consent) as well as revoke claim consent |

#### Other Functionality

general SDK functions could be found [here](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/src/main/web-auth/WebAuth.ts). The SDK support the following other functionality:

| SDK Functions                                  | Description                                                                                 |
|------------------------------------------------|---------------------------------------------------------------------------------------------|
| getRequestId                                   | The SDK could be used to get request id, which is required as input to call other functions |
| getLoginURL                                    | Getting login authz url is supported by the SDK                                                        |
| getTenantInfo, getClientInfo                   | Getting public information such as tenant info & client info is supported by the SDK                                                    |
| setAcceptLanguageHeader                        | The SDK could be used to change response language                                           |
| createDeviceInfo, getDevicesInfo, deleteDevice | Creating, getting, and removing device information is supported by the SDK                          |
| logoutUser                                     | The SDK could be used to end user session by using cidaas internal api                      |
| userActionOnEnrollment                                     | The SDK could be used to run predefined action after enrollment |

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

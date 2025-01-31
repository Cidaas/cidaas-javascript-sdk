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

Please check the [Changelog](https://github.com/Cidaas/cidaas-javascript-sdk/blob/master/CHANGELOG.md) for more information about the latest release.

## Table of Contents

<!--ts-->
* [Documentation](https://cidaas.github.io/cidaas-javascript-sdk)
* [Installation](#installation)
* [Initialisation](#initialisation)
* [Usage](#usage)
* [Functions Overview](#functions-overview)
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

Cidaas ConfigUserProvider have to be initialised to be added to each of the modules as dependencies:

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

### Usage

#### Login With Browser

To login through cidaas sdk, call **loginWithBrowser()**. This will redirect you to the hosted login page.

```js
cidaasAuthenticationService.loginWithBrowser();
```

once login is successful, it will automatically redirects you to redirect_uri you have configured in cidaas options. You will get information such as code & state as redirect url parameter (query or fragment), which is needed to get access token.

To complete the login process, call **logincallback()**.

```js
cidaasAuthenticationService.loginCallback().then(function(response) {
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
cidaasAuthenticationService.getUserInfoFromStorage().then(function(response) {
    // the response will contains tokens & user profile information.
}).catch(function(ex) {
    // your failure code here
});
```

### Functions Overview

Cidaas Javascript SDK Functions can be found on the [documentation](https://cidaas.github.io/cidaas-javascript-sdk).

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

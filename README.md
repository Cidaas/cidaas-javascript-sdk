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

## Table of Contents

<!--ts-->
* [Requirements](#requirements)
* [Installation](#installation)
* [Initialisation](#initialisation)
* [Usage](#usage)
* [Functions Overview](#functions-overview)
    <!--ts-->
    * [Multiple Authentication Mode](#multiple-authentication-mode)
    * [Login Management](#login-management)
    * [User Management](#user-management)
    * [Token Management](#token-management)
    * [Verification Management](#verification-management)
    * [Consent Management](#consent-management)
    * [Other Functionality](#other-functionality)
    <!--te-->
* [Possible Error](#possible-error)

### Requirements

Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - Download & Install Node.js. The version required is >= 8
* npm - node package manager to add the package and install dependent packages

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

Please check the [Changelog](https://github.com/Cidaas/cidaas-sdk-javascript-v2/blob/master/CHANGELOG.md) for more information about the latest release

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

an example of index.js is looks like this:

```js
const options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    scope: 'openid email roles profile',
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

once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.

To complete the login process, call **logincallback()**. This will parses the access_token, id_token and whatever in hash in the redirect url.

```js
cidaas.loginCallback().then(function(response) {
    // the response will give you login details.
}).catch(function(ex) {
    // your failure code here
});
```

### Functions Overview

Cidaas Javascript SDK features the following functionality:

#### Multiple Authentication Mode
The SDK offers multiple way to authenticate user. Whether using browser redirection, in a pop up window, or in an iframe for silent sign in. 

#### Login Management
* User could authenticate themselves using passwordless authentication, classic password credentials, as well as using social provider such as google or social media platform
* Progressive Registration. In case a new required field is added in registration settings, it is possible to use the sdk to inform user of the changes and asked them to fill in the missing required fields by the next login
* Depending on the missing information, user will be redirected to another page after login to either do progressive registration, accepting consent or changing password

#### User Management
* Registering a new user is possible by using classic registration form or by using social provider
* To maintain user, functions for getting & updating user information, removing user, as well as check if user exist are supported
* In case user want to reset password, password reset flow is supported. From initiating the reset password, handling the code or link which has been sent to predefined medium such as email, sms & ivr, and finishing up the reset password
* In case user want to change password, password change function is provided
* In case a new user is registered with similiar information as existing user, deduplication could be activated to either proceed with the registration, or combine the user with an existing one
* Linking user account with another account is supported 

#### Token Management
* The SDK facilitate login using PKCE flow
* Session renewal is possible by using refresh token
* Device code flow is supported for authenticating user without user interaction possibilty in device
* Token validation could be done by using introspection endpoint
* To save API call, offline token check function could be used

#### Verification Management
* The SDK support initiating & authenticating MFA, which starts passwordless login flow
* User account verification using preconfigured MFA is possible
* MFA process could be aborted in case something gone the wrong way
* Information about every supported MFA & configured MFA is provided by the SDK
* Additional MFA type could be enrolled using the sdk

#### Consent Management
* The SDK could be used to get consent details (app level consent, scope consent or field consent)
* Getting details of consent version by using the SDK is possible
* The SDK support accepting consent (app level consent, scope consent or field consent) as well as revoke field consent

#### Other Functionality
* The SDK could be used to end user session
* The SDK could be used to change response language
* Getting login authz url is supported
* Getting public info is supported
* Getting registration fields information is supported
* Getting user activities history is supported
* Getting, creating, and removing device information is supported

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

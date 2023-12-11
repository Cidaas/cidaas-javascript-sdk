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
    <!--ts-->
    * [Login With Browser](#login-with-browser)
    * [Further use case which is supported by the sdk](#further-use-case-which-is-supported-by-the-sdk)
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

After adding **cidaas-sdk.js** create a local file and name it like **index.js**. Cidaas options variable should be defined there for initializing cidaas sdk.

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
var options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    scope: 'openid email roles profile',
}
```

### Initialise the cidaas sdk using the configured options mentioned above:

```js
var cidaas = new CidaasSDK.WebAuth(options);
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

#### Further use case which is supported by the sdk

Cidaas Javascript SDK also features the following functionality:

* Variance of Authentication Mode: The SDK offers multiple way to authenticate user. Whether using browser redirection, in a pop up window, or in an iframe for silent sign in. 
* Login Management: The SDK support the following login management functions:
    * User could authenticate themselves using passwordless authentication, classic password credentials, as well as using social provider such as google or social media platform 
    * Progressive Registration. In case a new required field is added in registration settings, it is possible to use the sdk to inform user of the changes and asked them to fill in the missing required fields by the next login
    * depending on the missing information, user will be redirected to another page after login to either do progressive registration, accepting consent or changing password
* User Management: The SDK support the following user management functions:
    * registering a new user via classic registration form or by using social provider
    * getting & updating user information
    * removing user
    * check if user exist
    * password reset flow from initiating the reset password, handling the code or link which has been sent to predefined medium such as email, sms & ivr, and finishing up the reset password
    * password change
    * in case a new user is registered with similiar information as existing user, deduplication could be activated to either proceed with the registration, or combine the user with an existing one
    * link user with another account
* Token Management: The SDK support the following token management functions:
    * renew current session using refresh token
    * login using PKCE flow
    * device code flow for authenticating user without user interaction possibilty in device
    * validate if token is still valid using introspection endpoint
    * offline token check
* Multi Factor Authentication Management: The SDK support the following MFA management functions:
    * passwordless login flow, which starts with initiating & authenticating MFA
    * verifying user account using preconfigured MFA
    * canceling MFA process
    * getting information about every supported MFA & configured MFA
    * enrolling a new MFA type
* Consent Management: The SDK support the following Consent management functions:
    * getting consent details (app level consent, scope consent or field consent)
    * getting details of consent version
    * accepting consent (app level consent, scope consent or field consent)
    * revoke field consent
* Other functionality: The SDK support the following functions:
    * end user session
    * getting login authz url
    * getting public info
    * getting registration fields information
    * getting user activities history
    * getting, creating, and removing device information
    * changing response language

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

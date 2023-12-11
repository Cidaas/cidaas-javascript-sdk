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

This cidaas Javascript SDK library is built on the top of [OIDC client javascript library](https://github.com/IdentityModel/oidc-client-js). 

#### Requirements

Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - Download & Install Node.js. The version required is >= 8
* npm - node package manager to add the package and install dependent packages

#### Installation

From CDN

```html
<!-- Replace the required <version> in the script tag, example: 3.0.0. All the released tag can be found https://www.npmjs.com/package/cidaas-javascript-sdk?activeTab=versions -->
<script src="https://cdn.cidaas.de/javascript/oidc/<version>/cidaas-javascript-sdk.min.js"></script>
```

From npm

```
npm install cidaas-javascript-sdk
```

Please check the [Changelogs](https://github.com/Cidaas/cidaas-sdk-javascript-v2/blob/master/Changelogs.md) for more information about the latest release

#### Initialisation

After adding ****cidaas-sdk.js**** create a local file and name it like ****index.js****. Cidaas options variable should be defined there for initializing cidaas sdk.

Cidaas options variable support every [OIDC Client UserManagerSettings Properties](https://authts.github.io/oidc-client-ts/interfaces/UserManagerSettings.html) which has the following notable properties:

| Property Name | Required | Description |
| ------ | ------ | ------ |
| authority | yes | cidaas instance base url |
| client_id | yes | client application's identifier, which could be found in cidaas admin ui |
| redirect_uri | yes | URL to be redirected after successful login attempt. |
| post_logout_redirect_uri | no | URL to be redirected after successful logout attempt. |
| response_type | no | The type of response that will come after successful login attempt. The default value is 'code' if no properties is being sent. This determines the OAuth authorization flow being used.|
| scope | no | the scope the application requires and requests from cidaas. The default value is 'openid' if no properties is being sent. |

In addition to it, There are the following custom properties which could / need to be defined in cidaas option variable:

| Property Name | Required | Description |
| ------ | ------ | ------ |
| cidaas_version | no | You can find out the cidaas version from cidaas service portal |

an example of index.js is looks like this:

```js
var options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    response_type: 'id_token token',
    scope: 'openid email roles profile',
    cidaas_version: 3
}
```

```
#### <i class="fab fa-quote-left fa-fw" aria-hidden="true"></i> To use the PKCE Flow add 'code' as the 'response_type' 
```

### Note:

Since version 1.2.0 using 'code' as the 'response_type' will start the OAuth Authorization Flow with PKCE instead of the normal Authorization Code Flow.

### Initialise the cidaas sdk using the configured options mentioned above:

```js
var cidaas = new CidaasSDK.WebAuth(options);
```

#### Migrating to Cidaas V3

Cidaas V3 has response handling adjustment on some of cidaas service call. To migrate to cidaas V3, you need to do the following:

- ensure that you use at least cidaas version: 3.* You can find out the cidaas version from cidaas service portal and ask our customer service if it need to be updated.

- ensure that you use at least cidaas-javascript-sdk version: 3.0.5

- add `cidaas_version: 3` to Cidaas options variable

Without Providing CidaasVersion, your application will use response handling of Cidaas V2 by default.

#### Usage

##### Login With Browser

To login through cidaas sdk, call ****loginWithBrowser()****. This will redirect you to the hosted login page.

```js
cidaas.loginWithBrowser();
```


once login successful, it will automatically redirects you to the redirect url whatever you mentioned in the options.

To complete the login process, call ****logincallback()****. This will parses the access_token, id_token and whatever in hash in the redirect url.

```js
cidaas.loginCallback().then(function(response) {
    // the response will give you login details.
}).catch(function(ex) {
    // your failure code here
});
```

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

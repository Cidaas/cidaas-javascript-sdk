![Logo](logo.jpg)

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


##### Getting UserInfo

To get the user profile information, call ****getUserInfo()****. This will return the basic user profile details along with groups, roles and whatever scopes you mentioned in the options.
```js
cidaas.getUserInfo().then(function (response) {
    // the response will give you profile details.
}).catch(function(ex) {
    // your failure code here
});; 
```

#### Native SDK methods

The below methods will be applicable for only native support

#### Login and Registration

##### Getting RequestId

Each and every proccesses starts with requestId, it is an entry point to login or register. For getting the requestId, call ****getRequestId()****.

##### Sample code

```js
cidaas.getRequestId().then(function (response) {
    // the response will give you request ID.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "groupname":"default",
        "lang":"en,en-US;q=0.9,de-DE;q=0.8,de;q=0.7",
        "view_type":"login",
        "requestId":"5cbcedfb-0d57-4097-993c-32db5cf94654"
    }
}
```

##### Getting Tenant Info

To get the tenant basic information, call ****getTenantInfo()****. This will return the basic tenant details such as tenant name and allowed login with types (Email, Mobile, Username).

##### Sample code
```js
cidaas.getTenantInfo().then(function (response) {
    // the response will give you tenent details.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response

```json
{
    "success":true,
    "status":200,
    "data": {
        "tenant_name":"Cidaas Developers",
        "allowLoginWith": [
            "EMAIL",
            "MOBILE",
            "USER_NAME"
        ]
    }
}
```

##### Get Client Info

To get the client basic information, call ****getClientInfo()****. This will return the basic client details such as client name and allowed social login providers (Facebook, Google and others).

##### Sample code
```js
cidaas.getClientInfo({
    requestId: 'your requestId',
    acceptlanguage: 'your locale' // optional example: de-de, en-US
}).then(function (resp) {
    // the response will give you client info.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "passwordless_enabled":true,
        "logo_uri":"https://www.cidaas.com/wp-content/uploads/2018/02/logo-black.png",
        "login_providers": [
            "facebook",
            "google",
            "linkedin"
        ],
        "policy_uri":"",
        "tos_uri":"",
        "client_name":"Single Page WebApp"
    }
}
```

##### Getting Registration Fields

To handle registration, first you need the registration fields. To get the registration fields, call ****getRegistrationSetup()****. This will return the fields that has to be needed while registration.

##### Sample code
```js
cidaas.getRegistrationSetup({
    requestId: 'your requestId',
    acceptlanguage: 'your locale' // optional example: de-de, en-US
}).then(function (resp) {
    // the response will give you fields that are required.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": [
        {
            "dataType": "EMAIL",
            "fieldGroup": "DEFAULT",
            "isGroupTitle": false,
            "fieldKey": "email",
            "fieldType": "SYSTEM",
            "order": 1,
            "readOnly": false,
            "required": true,
            "fieldDefinition": {},
            "localeText": {
                "locale": "en-us",
                "language": "en",
                "name": "Email",
                "verificationRequired": "Given Email is not verified.",
                "required": "Email is Required"
            }
        },
        {
            "dataType": "TEXT",
            "fieldGroup": "DEFAULT",
            "isGroupTitle": false,
            "fieldKey": "given_name",
            "fieldType": "SYSTEM",
            "order": 2,
            "readOnly": false,
            "required": true,
            "fieldDefinition": {
                "maxLength": 150
            },
            "localeText": {
                "maxLength": "Givenname cannot be more than 150 chars",
                "required": "Given Name is Required",
                "name": "Given Name",
                "language": "en",
                "locale": "en-us"
            }
        },
        {
            "dataType": "TEXT",
            "fieldGroup": "DEFAULT",
            "isGroupTitle": false,
            "fieldKey": "family_name",
            "fieldType": "SYSTEM",
            "order": 3,
            "readOnly": false,
            "required": true,
            "fieldDefinition": {
                "maxLength": 150
            }
        },
        {
            "dataType": "MOBILE",
            "fieldGroup": "DEFAULT",
            "isGroupTitle": false,
            "fieldKey": "mobile_number",
            "fieldType": "SYSTEM",
            "order": 6,
            "readOnly": false,
            "required": false,
            "fieldDefinition": {
                "verificationRequired": true
            }
        }
    ]
}
```

##### Get Missing Fields

Once social register, it will redirect to the extra information page with requestId and trackId as query parameters. To get the missing fields, call ****getMissingFields()****. This will return you the user information along with the missing fields. You need to render the fields using registration setup and finaly call the ****register()****.

##### Sample code

```js
cidaas.getMissingFields({
        trackId: 'your trackId', // which you will get it from url
        requestId: 'your requestId', // which you will get it from url
        acceptlanguage: 'your locale' // optional example: de-de, en-US
}).then(function (response) {
    // the response will give you user info with missing fields.
}).catch(function (ex) {
    // your failure code here
});
```

#### Logout user

To logout the user, call ****logoutUser()****.

##### Sample code
```js
cidaas.logoutUser({
  access_token : 'your accessToken'
});
```

#### Socket Connection

##### Installation

Install ng-socket-io in your project and refer the following link https://www.npmjs.com/package/ng-socket-io to configure. Use the "your_base_url/socket-srv/socket/socket.io" path for the socket listening url and enter the following snippet

#### Configuration

##### Emitting the socket

```
this.socket.emit("join", {
    id: 'your status id' // which you received in the response of setup call
});
```

##### Sample code

```
this.cidaas.setupPattern({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
        this.socket.emit("join", {
            id: response.data.statusId
        });
    }).catch((err) => {
      // your failure code here 
    });
```

##### Listening the socket 

You can listen the socket anywhere in your component

```
this.socket.on("status-update", (msg) => {
    if (msg.status == "SCANNED") {
        // do next process
    }
    else if (msg.status == "ENROLLED") {
        // do next process
    }
});
```

#### Usage

##### Emitting the socket

```
this.socket.emit("on-trigger-verification", {
    id: 'your status id' // which you received in the response of initiate call
});
```

##### Sample code

```
this.cidaas.initiatePattern({
    sub: 'your sub',
    physicalVerificationId: 'your physical verification id',
    userDeviceId: deviceId,
    usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
    deviceInfo: {
        deviceId: 'your device id'
    }
}).then((response) => {
    this.socket.emit("on-trigger-verification", {
        id: response.data.statusId
    });
}).catch((err) => {
        // your failure code here 
});
```

##### Listening the socket 

You can listen the socket anywhere in your component.

```
this.socket.on("status-update", (msg) => {
    if (msg.status == "AUTHENTICATED") {
        // do next process
    }
});
```
#### Device
##### Get Device Info
To get the device information, call **getDeviceInfo()**

##### Sample code

```js
cidaas.getDeviceInfo()
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

## Possible Error

The SDK will throws Custom Exception if something went wrong during the operation:

| HTTP Status Code | When could it be thrown |
|----------------- | ----------------------- |
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

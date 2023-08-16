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
| cidaas_version | yes | You can find out the cidaas version from cidaas service portal |
| mode | no | Define which login variants to be called during calling loginWithBrowser(). The selection includes: `redirect`, `window` and `silent`. The default value is `redirect` if no properties is being sent. |

an example of index.js is looks like this:

```js
var options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    response_type: 'id_token token',
    scope: 'openid email roles profile',
    mode: 'redirect',
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

- ensure that you use at least cidaas version: 3.* You can find out the cidaas version from [cidaas service portal](https://cspace.cidaas.com/service-portal/dashboard) and ask our customer service if it need to be updated.

- ensure that you use at least cidaas-javascript-sdk version: 3.0.5

- add `cidaas_version: 3` to Cidaas options variable


#### Usage

#### Browser Methods

The below methods will applicable for using cidaas hosted pages only.

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

##### Register With Browser

To register through cidaas sdk, call ****registerWithBrowser()****. This will redirect you to the hosted registration page.

```js
cidaas.registerWithBrowser();
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


##### Logout

```js
cidaas.logout().then(function () {
    // your logout success code here
}).catch(function(ex) {
    // your failure code here
});
```

If you use the logout method, you need set the redirect url, if not it will automatically redirect to the login page

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

##### Login with credentials

To login with your credentials, call ****loginWithCredentials()****. After successful login, this will redirect you to the redirect_url that you mentioned earlier while initialising the sdk. Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/5gphdk6vapp56-classic-login#call-login-api for more detials.

##### Sample code
```js
cidaas.loginWithCredentials({
    username: 'xxxx@gmail.com',
    username_type: 'email',
    password: '123456',
    requestId: 'your requestId',
});
```

#### Login with credentials and get response
To login with username and password, call **loginWithCredentialsAsynFn()**. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| request_id | string | request id of the session | false |
| username | string | the username of the user  | false |
| password | string | password to authenticate the username | false |


##### Sample code

```js
options = {
  request_id: "bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  username: "test@cidaas.de"
  password: "cidaas"
}

cidaas.loginWithCredentialsAsynFn(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Login with social

To login with social providers, call ****loginWithSocial()****. This will redirect you to the facebook login page. Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/9mi5uqxhqlsm5-social-login#call-social-login-api for more details

##### Sample code
```js
 cidaas.loginWithSocial({
    provider: 'facebook',
    requestId: 'your requestId',
});
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

##### Register user

Once registration fields are getting, then design your customized UI and to register user call ****register()****. This method will create a new user.

##### Sample code



Note: Only requestId in the headers is required.

```js
let headers = {
  requestId: your_received_requestId,
  captcha: captcha,
  acceptlanguage: acceptlanguage,
  bot_captcha_response: bot_captcha_response
};

cidaas.register({ 
    email: 'xxx123@xxx.com',  
    given_name: 'xxxxx', 
    family_name: 'yyyyy', 
    password: '123456', 
    password_echo: '123456', 
    provider: 'your provider', // FACEBOOK, GOOGLE, SELF
    acceptlanguage: 'your locale' // optional example: de-de, en-US
}, headers).then(function (response) {
    // the response will give you client registration details.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "sub": "7dfb2122-fa5e-4f7a-8494-dadac9b43f9d",
        "userStatus": "VERIFIED",
        "email_verified": false,
        "suggested_action": "LOGIN"
    }
}
```

##### Register with social

To register with social providers, call ****registerWithSocial()****. This will redirect you to the facebook login page.

##### Sample code

Note: giving the queryParams is not required.

```js
queryParams = {
  dc: dc,
  device_fp: device_fp
};

 cidaas.registerWithSocial({
    provider: 'facebook',
    requestId: 'your requestId',
}, queryParams);
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

##### Progressive Registration
For progressive registration, call **progressiveRegistration()**. While logging in If the API returns 417 with the error message MissingRequiredFields, call the **getMissingFieldsLogin** to get the list of missing fileds and proceed with progressive registration. In the sample request only the required fields are added, however you must provide the missing fields along with the required fields.

##### Function parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| options | object | The object with the keys described in the below table under section options |
| headers | object | The object with the keys described in the below table under section headers  |

##### options

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| acceptlanguage | string | your locale/browser local  | true |

* Please provide provide the missing fields along with the required fields

##### headers

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| trackId | string | the track id received while logging in  | false |
| requestId | string | request id of the session | false |


##### Sample code

```js
options = {
    acceptlanguage: 'en-Us'
}

headers = {
    trackId: 'bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    requestId: 'bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
}
cidaas.progressiveRegistration(options, headers)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
})
```

##### Get Missing Fields Login
To get the missing fields after login, call **getMissingFieldsLogin()**.

##### Function parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| trackId | string | the track id received while logging in  |


##### Sample code

```js
let trackId = 'bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
cidaas.getMissingFieldsLogin(trackId)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

#### Account Verification

##### Get Communication Status

Once registration successful, verify the account based on the flow. To get the details, call ****getCommunicationStatus()****.

##### Sample code

```js
cidaas.getCommunicationStatus({
    sub: 'your sub', // which you will get on the registration response
    acceptlanguage: 'your locale' // optional example: de-de, en-US
}).then(function (response) {
    // the response will give you account details once its verified.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "EMAIL": false,
        "MOBILE": false,
        "USER_NAME": true
    }
}
```

##### Intiate Account Verification

To initiate the account verification, call ****initiateAccountVerification()****. This will send verification code  email or sms or ivr based on the verificationMedium you mentioned.

##### Sample code
```js
cidaas.initiateAccountVerification({
    verificationMedium: 'email',
    requestId: 'your requestId',
    processingType: 'CODE', 
    sub: 'your sub'
}).then(function (response) {
    // the response will give you account verification details.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "accvid": "32aca19a-c83a-4ea5-979e-f8242605bcd4"
    }
}
```

##### Authenticate Account Verification

To complete the verification, call ****verifyAccount()****. 

##### Sample code
```js
cidaas.verifyAccount({
    accvid: 'your accvid', // which you will get on initiate account verification response
    code: 'your code in email or sms or ivr'
}).then(function (response) {
    // the response will give you account verification ID and unique code.
}).catch(function(ex) {
    // your failure code here
});
```

#### Resetting your password

##### Initiate Reset Password

To initiate the password resetting, call ****initiateResetPassword()****. This will send verification code to your email or mobile based on the resetMedium you mentioned. Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/6b29bac6002f4-initiate-password-reset for more details.

##### Sample code

```js
cidaas.initiateResetPassword({
    email: 'xxxxxx@xxx.com',
    processingType: 'CODE',
    requestId: 'your requestId',
    resetMedium: 'email'
}).then(function (response) {
    // the response will give you password reset details.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "reset_initiated": true,
        "rprq": "e98b2451-f1ca-4c81-b5e0-0ef85bb49a05"
    }
}
```

##### Handle Reset Password

To handling the reset password by entering the verification code you received, call ****handleResetPassword()****. This will check your verification code was valid or not and allows you to proceed to the next step. More details available on https://docs.cidaas.com/docs/cidaas-iam/4aede115e5460-validate-reset-password

##### Sample code
```js
cidaas.handleResetPassword({
    code: 'your code in email or sms or ivr',
    resetRequestId: 'your resetRequestId' // which you will get on initiate reset password response
}).then(function (response) {
    // the response will give you valid verification code.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "exchangeId": "d5ee97cd-2454-461d-8e42-554371a15c00",
        "resetRequestId": "1834130e-7f53-4861-99d3-7f934fbba179"
    }
}
```

##### Reset Password

To change the password, call ****resetPassword()****. This will allow you to change your password. More detials available on https://docs.cidaas.com/docs/cidaas-iam/c7d767a7414df-accept-reset-password

##### Sample code
```js
cidaas.resetPassword({        
    password: '123456',
    confirmPassword: '123456',
    exchangeId: 'your exchangeId', // which you will get on handle reset password response
    resetRequestId: 'your resetRequestId' // which you will get on handle reset password response
}).then(function (response) {
    // the response will give you reset password details.
}).catch(function(ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "reseted": true
    }
}
```

##### Change Password

To change the password, call ****changePassword()****. This will allow you to change your password. More details available on https://docs.cidaas.com/docs/cidaas-iam/09873c57d1fb8-change-password

##### Sample code
```js
cidaas.changePassword({
        old_password: '123456',
        new_password: '123456789',
        confirm_password: '123456789',
        identityId: 'asdauet1-quwyteuqqwejh-asdjhasd',
}, 'your access token')
.then(function () {
    // the response will give you changed password.
}).catch(function (ex) {
    // your failure code here
});
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "changed": true
    }
}
```

#### Get user profile information

To get user profile details, pass access token to ****getProfileInfo()****.

##### Sample code

```js
cidaas.getProfileInfo({
        access_token: 'your access token',
        acceptlanguage: 'your locale' // optional example: de-de, en-US
}).then(function (response) {
    // the response will give you user profile details.
}).catch(function (ex) {
    // your failure code here
});
```

##### Response

```json
{
    "success": true,
    "status": 200,
    "data": {
        "userAccount": {
            "userIds": [
                {
                    "key": "self.email",
                    "value": "testuser@gmail.com"
                }
            ],
            "className": "de.cidaas.management.db.UserAccounts",
            "_id": "ac45bdda-93bf-44f1-b2ff-8465495c3417",
            "sub": "33361c59-368b-48e3-8739-38d7ee8f7573",
            "user_status_reason": "",
            "userStatus": "VERIFIED",
            "customFields": {
                "Test_consent_HP": true,
                "customer_number": "CN456",
                "invoice_number": "IN456"
            },
            "createdTime": "2021-05-27T07:38:29.579Z",
            "updatedTime": "2021-06-24T11:02:43.188Z",
            "__ref": "1624532562750-69ab9fff-2a71-4a05-8d67-6886376b51d6",
            "__v": 0,
            "lastLoggedInTime": "2021-06-24T11:02:43.186Z",
            "lastUsedIdentity": "bbee960d-6a80-424e-99bd-586d74f1053e",
            "mfa_enabled": true,
            "id": "ac45bdda-93bf-44f1-b2ff-8465495c3417"
        },
        "identity": {
            "_id": "bbee960d-6a80-424e-99bd-586d74f1053e",
            "className": "de.cidaas.core.db.EnternalSocialIdentity",
            "sub": "33361c59-368b-48e3-8739-38d7ee8f7573",
            "provider": "self",
            "email": "testuser@gmail.com",
            "email_verified": true,
            "family_name": "Test",
            "given_name": "User",
            "locale": "en-us",
            "createdTime": "2021-05-27T07:38:29.908Z",
            "updatedTime": "2021-06-24T11:02:43.188Z",
            "__ref": "1624532562750-69ab9fff-2a71-4a05-8d67-6886376b51d6",
            "__v": 0,
            "birthdate": "1993-06-07T18:30:00.000Z",
            "id": "bbee960d-6a80-424e-99bd-586d74f1053e"
        },
        "customFields": {},
        "roles": [
            "USER"
        ],
        "groups": []
    }
}
```

#### Getting user profile

To get the user profile information, call ****getUserProfile()****. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| access_token | string | a bearer token | false |
| acceptlanguage | string | browser/custom local  | true |

##### Sample code
```js
let options = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  acceptlanguage: 'en-US'
}
cidaas.getUserProfile(options)
.then(function (response) {
  // the response will give you user profile information.
}).catch(function (ex) {
  // your failure code here
});
```

##### Response
```json
{
    "sub": "cc28a557-ce0d-4896-9580-49639cbde8d5",
    "email": "davidjhonson1984@gmail.com",
    "email_verified": true,
    "name": "David Jhonson",
    "family_name": "Jhonson",
    "given_name": "David",
    "nickname": "test",
    "preferred_username": "davidjhonson",
    "gender": "Male",
    "locale": "en-us",
    "updated_at": 1527662349,
    "username": "davidjhonson"
}
```

#### Updating user profile

To update the user profile information, call ****updateProfile()****.

##### Sample code
```js
cidaas.updateProfile({
        family_name: 'Doe',
        given_name: 'John',
        provider: 'self',
        acceptlanguage: 'your locale' // optional example: de-de, en-US
}, 'your access token', 'your sub').then(function () {
    // the response will give you updated user profile info.
}).catch(function (ex) {
    // your failure code here
});
```

##### Response
```json
{
   "updated": true
}
```

#### Logout user

To logout the user, call ****logoutUser()****.

##### Sample code
```js
cidaas.logoutUser({
  access_token : 'your accessToken'
});
```
#### Delete User Account

To delete the user account directly in the application, call **deleteUserAccount()**. This method will delete the user account with **requestId** as the **query parameter**.

This method takes an object as input.

##### Sample code

```js
options = {
     sub: "7e4f79a9-cfbc-456d-936a-e6bc1de2d4b9",
     requestId: "7d86460b-8288-4341-aed1-  10dd27a4565c",
     accept-language: "en",
     access_token: "your_access_token"
}
```

The usage of the method is as follows.

```js
cidaas.deleteUserAccount(options).then(function (response) {

   // the response will give you account details to be deleted.

}).catch(function(ex) {

  // your failure code here

});
```
#### Response

```js
{
   "success": true,
   "status": 200,
   "data": {
       "result": true
   }
}
```

##### User Check Exists
Check if user exists, call **userCheckExists()**. The function accepts a function parameter of type object. The object with the keys described in the below table

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| requestId | string | the request id of a session | false |

##### Sample code

```js
options = {
    requestId : "bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
}
cidaas.userCheckExists(options)
.then(function(response) {
    // type your code here
})
.catch(function(ex) {
    // your failure code here
});
```


##### Initiate account linking
To initiate account linking, call **initiateLinkAccount()**. The function parameters are mentioned below.

##### Function parameters
| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| options | object | an object with the keys described in the below table | false |
| access_token | string | the username of the user  | false |


| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| user_name_to_link | string | Username that needs to be linked | false |
| master_sub | string | Master sub to link account | false |


##### Sample code

```js
let options = {
 master_sub : "vaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
 user_name_to_link: "CidaasTest"
}
const acccess_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

cidaas.initiateLinkAccount(options,access_token)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Complete link account
To complete account linking, call **completeLinkAccount()**. The function parameters are mentioned below.

##### Function parameters
| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| options | object | an object with the keys described in the below table | false |
| access_token | string | the username of the user  | false |


| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| link_request_id | string | the request id of account link request | false |
| code | string |  the code received while account linking | false |

##### Sample code

```js
let options = {
 link_request_id : "vaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
 code: "1234567890"
}
const acccess_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

cidaas.completeLinkAccount(options,access_token)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Get Linked Users
To get all the linked social accounts, call **getLinkedUsers()**. The function accepts the below parameters 

##### Function parameters
| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| sub | string | the sub of the user | false |
| access_token | string | the username of the user  | false |


##### Sample code

```js
const sub = "vaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
const acccess_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

cidaas.getLinkedUsers(access_token, sub)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Unlink Account
To unlink an social account for a user, call **unlinkAccount()**. The function accepts the below parameters

##### Function parameters
| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| identityId | string | The identity id of the account to be unlinked | false |
| access_token | string | the username of the user  | false |

##### Sample code

```js
const identityId = "vaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
const acccess_token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

cidaas.unlinkAccount(access_token, identityId)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

#### Physical Verification

After successful login, we can add multifactor authentications.

#### EMAIL

##### Setup Email

To configure email, call ****setupEmail()****.

##### Sample code
```js
this.cidaas.setupEmail({
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for email setup.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Enroll Email

To enroll email, call ****enrollEmail()****.

##### Sample code
```js
this.cidaas.enrollEmail({
      statusId: 'your status id', // which you received in setup email response
      code: '1221234234', // which you received in email 
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you email and device info to be linked.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "sub":"5f5cbb84-4ceb-4975-b347-4bfac61e9248",
        "trackingCode": "75hafysd7-5f5cbb84-4ceb-4975-b347-4bfac61e92"
    }
}
```

##### Initiate Email

To send a verification code to email, call ****initiateEmail()****.

##### Sample code
```js
this.cidaas.initiateEmail({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you email verification code details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Authenticate Email

To verify the code, call ****authenticateEmail()****.

##### Sample code
```js
this.cidaas.authenticateEmail({
      verifierPassword: 'your generated otp', // received in Email
      code: 'your generated otp', // received in Email
      statusId: 'your status id', // received from initiate call
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you email authentication details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": { 
        "sub":"6f7e672c-1e69-4108-92c4-3556f13eda74","trackingCode":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### SMS

##### Setup SMS

To configure SMS, call ****setupSMS()****.

##### Sample code
```js
this.cidaas.setupSMS({
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for SMS setup. 
    }).catch((err) => {
      // your failure code here 
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Enroll SMS

To enroll SMS, call ****enrollSMS()****.

##### Sample code
```js
this.cidaas.enrollSMS({
      statusId: 'your status id', // which you received in setup sms response
      code: '1221234234', // which you received via sms 
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you SMS and device info to be linked 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "sub":"5f5cbb84-4ceb-4975-b347-4bfac61e9248",
        "trackingCode": "75hafysd7-5f5cbb84-4ceb-4975-b347-4bfac61e92"
    }
}
```

##### Initiate SMS

To send a verification code to sms, call ****initiateSMS()****.

##### Sample code
```js
this.cidaas.initiateSMS({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you SMS verification code details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Authenticate SMS

To verify the code, call ****authenticateSMS()****.

##### Sample code
```js
this.cidaas.authenticateSMS({
      verifierPassword: 'your generated otp', // received in SMS
      code: 'your generated otp', // received in SMS
      statusId: 'your status id', // received from initiate call
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you SMS authentiction details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": { 
        "sub":"6f7e672c-1e69-4108-92c4-3556f13eda74","trackingCode":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### IVR

##### Setup IVR

To configure IVR, call ****setupIVR()****.

##### Sample code
```js
this.cidaas.setupIVR({
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for IVR setup.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Enroll IVR

To enroll IVR, call ****enrollIVR()****.

##### Sample code
```js
this.cidaas.enrollIVR({
      statusId: 'your status id', // which you received in setup ivr response
      code: '1221234234', // which you received via voice call 
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you IVR and device info to be linked.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "sub":"5f5cbb84-4ceb-4975-b347-4bfac61e9248",
        "trackingCode": "75hafysd7-5f5cbb84-4ceb-4975-b347-4bfac61e92"
    }
}
```

##### Initiate IVR

To send a verification code to a voice call, call ****initiateIVR()****.

##### Sample code
```js
this.cidaas.initiateIVR({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you IVR verification code details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Authenticate IVR

To verify the code, call ****authenticateIVR()****.

##### Sample code
```js
this.cidaas.authenticateIVR({
      verifierPassword: 'your generated otp', // received via voice call
      code: 'your generated otp', // received via voice call
      statusId: 'your status id', // received from initiate call
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you IVR authentication details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": { 
        "sub":"6f7e672c-1e69-4108-92c4-3556f13eda74","trackingCode":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### BACKUPCODE

##### Setup Backupcode

To configure backupcode, call ****setupBackupcode()****.

##### Sample code
```js
this.cidaas.setupBackupcode({
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for backup-code setup.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248",
        "backupcodes": [
            {
                "statusId": "5f5cbb84-4ceb-4975-b347-4bfac61e9248",
                "code": "8767344",
                "used": false
            }
        ]
    }
}
```

##### Initiate Backupcode

To create a verification code, call ****initiateBackupcode()****.

##### Sample code
```js
this.cidaas.initiateBackupcode({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you backup-code verification code details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Authenticate Backupcode

To verify the code, call ****authenticateBackupcode()****.

##### Sample code
```js
this.cidaas.authenticateBackupcode({
      verifierPassword: 'your generated otp', // received via voice call
      code: 'your generated otp', // received via voice call
      statusId: 'your status id', // received from initiate call
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you backup-code authentication details. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": { 
        "sub":"6f7e672c-1e69-4108-92c4-3556f13eda74","trackingCode":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### TOTP

##### Setup TOTP

To configure TOTP, call ****setupTOTP()****.

##### Sample code
```js
this.cidaas.setupTOTP({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for TOTP setup. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Enroll TOTP

To enroll TOTP, call ****enrollTOTP()****.

##### Sample code
```js
this.cidaas.enrollTOTP({
      statusId: 'your status id', // which you received in setup totp response
      code: '1221234234', // which you seen in any of the authenticator apps you configured
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you TOTP and device info to be linked. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "sub":"5f5cbb84-4ceb-4975-b347-4bfac61e9248",
        "trackingCode": "75hafysd7-5f5cbb84-4ceb-4975-b347-4bfac61e92"
    }
}
```

##### Initiate TOTP

To initiate a TOTP verification type, call ****initiateTOTP()****.

##### Sample code
```js
this.cidaas.initiateTOTP({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you TOTP verification details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

##### Authenticate TOTP

To verify the code, call ****authenticateTOTP()****.

##### Sample code
```js
this.cidaas.authenticateTOTP({
      verifierPassword: 'your generated otp', // received via voice call
      code: 'your generated otp', // received via voice call
      statusId: 'your status id', // received from initiate call
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you TOTP authentication details.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": { 
        "sub":"6f7e672c-1e69-4108-92c4-3556f13eda74","trackingCode":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### PATTERN

##### Setup Patttern

To configure Pattern, call ****setupPattern()****.

##### Sample code
```js
this.cidaas.setupPattern({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for Pattern setup.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

##### Initiate PATTERN

To initiate a PATTERN verification type, call ****initiatePattern()****.

##### Sample code
```js
this.cidaas.initiatePattern({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you Pattern verification details. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

#### TOUCHID

##### Setup TouchId

To configure TouchId, call ****setupTouchId()****.

##### Sample code
```js
this.cidaas.setupTouchId({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for Touch ID setup.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

##### Initiate TOUCHID

To initiate a TOUCHID verification type, call ****initiateTouchId()****.

##### Sample code
```js
this.cidaas.initiateTouchId({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you Touch ID verification details.
    }).catch((err) => {
      // your failure code here
    });
```

Once response is received, listen to the socket

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### SMART PUSH

##### Setup Smart Push

To configure SmartPush, call ****setupSmartPush()****.

##### Sample code
```js
this.cidaas.setupSmartPush({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for Smart Push setup. 
    }).catch((err) => {
      // your failure code here
    });
```

Once response is received, listen to the socket

##### Initiate SMART PUSH

To initiate a SMART PUSH verification type, call ****initiateSmartPush()****.

##### Sample code
```js
this.cidaas.initiateSmartPush({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you Smart Push verification details. 
    }).catch((err) => {
      // your failure code here
    });
```

Once response is received, listen to the socket

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### FACE

##### Setup Face

To configure Face, call ****setupFace()****.

##### Sample code
```js
this.cidaas.setupFace({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for Face setup. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

##### Initiate FACE

To initiate a FACE verification type, call ****initiateFace()****.

##### Sample code
```js
this.cidaas.initiateFace({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you Face verification details.
    }).catch((err) => {
      // your failure code here
    });
```

Once response is received, listen to the socket

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

#### VOICE

##### Setup Voice

To configure Voice, call ****setupVoice()****.

##### Sample code
```js
this.cidaas.setupVoice({
      logoUrl: 'your logo url',
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you details for Voice setup. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

##### Initiate VOICE

To initiate a VOICE verification type, call ****initiateVoice()****.

##### Sample code
```js
this.cidaas.initiateVoice({
      sub: 'your sub',
      physicalVerificationId: 'your physical verification id',
      userDeviceId: deviceId,
      usageType: 'your usage type', // PASSWORDLESS_AUTHENTICATION or MULTI_FACTOR_AUTHENTICATION
      deviceInfo: {
        deviceId: 'your device id'
      }
    }).then((response) => {
      // the response will give you Voice verification details. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "statusId":"5f5cbb84-4ceb-4975-b347-4bfac61e9248"
    }
}
```

Once response is received, listen to the socket

#### MFA Continue

To continue after MFA completion, call ****mfaContinue()****.

##### Sample code
```js
this.cidaas.mfaContinue({
      trackingCode: 'your tracking Code', // receives in socket
      track_id: 'your track id', 
      sub: 'your sub',
      requestId: 'your request id'
    });
```


##### Get All Verification List
List all verification type configured, call **getAllVerificationList()**. access_token must be passed as function paramere.

##### Sample code
```js
const access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMjM2ZWZiLWRlMjEtNDI5Mi04Z.";

cidaas.getAllVerificationList(access_token)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

#### Consent Management

For the first time login, the user needs to accept the terms and conditions.

##### Get consent details

To get the details of consent tile and description, call ****getConsentDetails()****

##### Sample code
```js
this.cidaas.getConsentDetails({
      consent_name: 'your consent name',
      acceptlanguage: 'your locale' // optional example: de-de, en-US
    }).then((response) => {
      // the response will give you details of consent.
    }).catch((err) => {
      // your failure code here 
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "title" : 'consent title',
        "description" : 'consent description',
        "userAgreeText" : 'I agree'
    }
}
```


##### Get Consent Details V2
To get consent details , call **getConsentDetailsV2()**. The function accepts a parameter of type object. The options paramter in the sample must contain the keys mentioned in in  the api document https://docs.cidaas.com/docs/cidaas-iam/858fbeb51c62b-find-consent-info

##### Sample code

```js
cidaas.getConsentDetailsV2(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Accept consent

To accept consent, call ****acceptConsent()****

##### Sample code
```js
this.cidaas.acceptConsent({
      name: 'your consent name',
      sub: 'your sub',
      client_id: 'your client id',
      accepted: true
    }).then((response) => {
      // the response will give you details of accepted consent.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "accepted": true
    }
}
```

##### Accept Consent V2
To accept consent, call **acceptConsentV2()**. The function accepts a parameter of type object. The options paramter in the sample must contain the keys mentioned in in  the api document https://docs.cidaas.com/docs/cidaas-iam/0caa9bacdd29e-accept-consent

##### Sample code

```js
cidaas.acceptConsentV2(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Consent Continue

To continue after Consent acceptance, call ****consentContinue()****.

##### Sample code
```js
this.cidaas.consentContinue({
      name: 'your consent name',
      version: 'your consent version',
      client_id: 'your client id',
      track_id: 'your track id', 
      sub: 'your sub',
    });
```
##### Accept claim

To accept Claim Consent, call ****acceptClaimConsent()****

##### Sample code
```js
this.cidaas.acceptClaimConsent({
      q: 'your sub',
      client_id: 'your client id',
      accepted: "accepted claims with array eg: []"
    }).then((response) => {
      // the response will give you accepted claim consent. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": true
}
```

##### Revoke claim

To revoke Claim Consent, call ****revokeClaimConsent()****

##### Sample code
```js
this.cidaas.revokeClaimConsent({
      sub: 'your sub',
      revoked_claims: "revoked claims with array eg: []"
    }).then((response) => {
      // the response will give you revoked claim consent.
    }).catch((err) => {
      // your failure code here 
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": true
}
```

##### Get Scope Consent Details
To get scope consent details, call **getScopeConsentDetails()**. The function accepts a parameter of type object. The options paramter in the sample must contain the keys mentioned in the below table.The function calls the api available in the document https://docs.cidaas.com/docs/cidaas-iam/f4b1bee4c3313-pre-login-check. Please refer to the api document for more details

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| track_id | string | the track id recieved while logging in | false |
| locale | string | browser accept language or custom language | false |

##### Sample code

```js
let options = {
    track_id: "5f5cbb84-4ceb-4975-b347-4bfac61e9248",
    locale: "en-US"
}

cidaas.getScopeConsentDetails(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Get Scope Consent Version Details V2
To get scope consent version detials V2, call **getScopeConsentVersionDetailsV2()**. The function accepts a parameter of type object. The options paramter in the sample must contain the keys mentioned in the below table.The function calls the api available in the document https://docs.cidaas.com/docs/cidaas-iam/7e24ac2113315-get-consent-version-details. Please refer to the api document for more details.

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| scopeid | string | the consent id(please refer to api document mentioned above) | false |
| locale | string | browser accept language or custom language | false |

##### Sample code

```js
let options = {
    scopeid: "5f5cbb84-4ceb-4975-b347-4bfac61e9248",
    locale: "en-US"
}

cidaas.getScopeConsentVersionDestailsV(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Accept Scope Consent
To accept scope consent, call **acceptScopeConsent()**. The options paramter in the sample must contain the keys mentioned in in  the api document https://docs.cidaas.com/docs/cidaas-iam/84c69a098c5c7-accept-scope-consent. Please refer to the api document for more details.

##### Sample code

```js
cidaas
    .acceptScopeConsent(options)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Scope Consent Continue Login
To scope consent continue login, call **scopeConsentContinue()**. The function accepts a parameter of type object. The options paramter in the sample must contain the keys mentioned in the below table.The function calls the api available in the document https://docs.cidaas.com/docs/cidaas-iam/aa32097970c52-continue-authentication-flow-after-prechecks. Please refer to the api document for more details.

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| track_id | string | track id recieved while loggine in| false |

##### Sample code

```js
let options = {
    track_id: "5f5cbb84-4ceb-4975-b347-4bfac61e9248"
}
cidaas.scopeConsentContinue(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

#### Deduplication

##### Get deduplication details

To get the list of existing users in deduplication, call ****getDeduplicationDetails()****.

##### Sample code
```js
this.cidaas.getDeduplicationDetails({
      track_id: 'your track id',
      acceptlanguage: 'your locale' // optional example: de-de, en-US
    }).then((response) => {
      // the response will give you deduplication details of users.
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": [
        {
            "provider": 'SELF',
            "sub": 'etsdf34545sdfsdf',
            "email": 'davidjhonson@gmail.com',
            "emailName": 'davidjhonson@gmail.com',
            "firstname": 'David',
            "lastname": 'Jhonson',
            "displayName": 'David Jhonson',
        }
    ]
}
```

##### Register deduplication 

To register new user in deduplication, call ****registerDeduplication()****.

##### Sample code
```js
this.cidaas.registerDeduplication({
      track_id: 'your track id',
      acceptlanguage: 'your locale' // optional example: de-de, en-US
    }).then((response) => {
      // the response will give you new registered deduplication user. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success": true,
    "status": 200,
    "data": {
        "sub": "7dfb2122-fa5e-4f7a-8494-dadac9b43f9d",
        "userStatus": "VERIFIED",
        "email_verified": false,
        "suggested_action": "LOGIN"
    }
}
```

##### Deduplication login

To use the existing users in deduplication, you need to enter password for the users and call ****deduplicationLogin()****.

##### Sample code
```js
this.cidaas.deduplicationLogin({
        sub: 'your sub',
        requestId: 'your request id',
        password: 'your password'
    }).then((response) => {
      // the response will give you deduplication login details. 
    }).catch((err) => {
      // your failure code here
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
        "token_type":"Bearer",
        "expires_in":86400,
        "access_token":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwMjM2ZWZiLWRlMjEtNDI5Mi04Z.",
        "session_state":"3F7CuT3jnKOTwRyyLBWaRizLiPm5mJ4PnhY.jfQO3MeEAuM",
        "viewtype":"login",
        "grant_type":"login"
    }
}
```

##### Initiate Users Link

To initiate a new user link, call ****userAccountLink()****.

##### Sample code

```js
var options = {
    sub: 'sub of the user who initiates the user link',
    username: 'username of the user which should get linked',
    redirect_uri: 'redirect uri the user should get redirected after successful account linking'
}
```

```js
this.cidaas.userAccountLink(options, access_token).then((response) => {
      // the response will give you that both user are linked.
    }).catch((err) => {
      // your failure code here 
    });
```

##### Response
```json
{
    "success":true,
    "status":200,
    "data": {
         "redirectUri": "string"
    }
}
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
#### Access Token

##### Get aceess token
To get a new token with th grant type authorization_code, call **getAccessToken()**. The function accepts a function parameter of type object. The object with the keys described in the below table

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| code | string | code to create a new token | false |

##### Sample code

```js
options = {
  code: "123456",
}

cidaas.getAccessToken(options)
.then(function (response) {
  // type your code here
})
.catch(function (ex) {
  // your failure code here
});
```

##### Validate access token
To validate an access token, call **validateAccessToken()**. The function accepts a function parameter of type object. The object with the keys described in the below table.

| Key name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| token | string | access token | false |
| token_type_hint | string | token type hint. accepted token type hints are access_token, id_token, refresh_token, sso | false |


##### Sample code

```js
options = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  token_type_hint: "access_token",
}

cidaas.validateAccessToken(options)
.then(function (response) {
  // type your code here
})
.catch(function (ex) {
  // your failure code here
});
```

##### Renew token
To get a new token with the grant type refresh_token, call **renewToken()**. The function accepts a function parameter of type object. The object with the keys described in the below table

| Key Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| refresh_token | string | The refresh token to create a new token. The refresh token is received while creating an access token using the token endpoint and later can be used to fetch a new token without using credentials | false |

##### Sample code

```js
options = {
  refresh_token: "bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
}

cidaas.renewToken(options)
.then(function (response) {
  // type your code here
})
.catch(function (ex) {
    // your failure code here
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

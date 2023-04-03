## About cidaas:
[cidaas](https://www.cidaas.com)
 is a fast and secure Cloud Identity & Access Management solution that standardises what’s important and simplifies what’s complex.
 ## Feature set includes:
* Single Sign On (SSO) based on OAuth 2.0, OpenID Connect, SAML 2.0 
* Multi-Factor-Authentication with more than 14 authentication methods, including TOTP and FIDO2 
* Passwordless Authentication 
* Social Login (e.g. Facebook, Google, LinkedIn and more) as well as Enterprise Identity Provider (e.g. SAML or AD) 
* Security in Machine-to-Machine (M2M) and IoT

## cidaas-javascript-sdk
This cidaas Javascript SDK library is built on the top of [OIDC client javascript library](https://github.com/IdentityModel/oidc-client-js). 

#### Requirements

Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - Download & Install Node.js. The version required is >= 8
* npm - node package manager to add the package and install dependent packages

#### Installation

From CDN

```html
<!-- Release version 2.0.9 -->
<!-- Minified version -->
<script src="https://cdn.cidaas.de/javascript/oidc/2.0.9/cidaas-javascript-sdk.min.js"></script>
```

From npm

```
npm install cidaas-javascript-sdk
```

Please check the [Changelogs](https://github.com/Cidaas/cidaas-sdk-javascript-v2/blob/master/Changelogs.md) for more information about the latest release

#### Initialisation

After adding ****cidaas-sdk.js**** create a local file and name it like ****index.js****.


```js
var options = {
    authority: 'your domain base url',
    client_id: 'your app id',
    redirect_uri: 'your redirect url',
    post_logout_redirect_uri: 'your post logout redirect url',
    popup_post_logout_redirect_uri: 'your post popup logout redirect url',
    silent_redirect_uri: 'your silent redirect url',
    response_type: 'id_token token',
    scope: 'openid email roles profile',
    mode: 'redirect'
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
cidaas.loginCallback()
.then(function(response) {
  // your success code here
})
.catch(function(ex) {
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
cidaas.getUserInfo()
.then(function(response) {
  // your success code here
})
.catch(function(ex) {
  // your failure code here
});; 
```


##### Logout

```js
cidaas.logout()
.then(function() {
  // your logout success code here
})
.catch(function(ex) {
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
cidaas.getRequestId()
.then(function(response) {
  // the response will give you requestId
  // your success code here
})
.catch(function(ex) {
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
cidaas.getTenantInfo()
.then(function(response) {
  // the response will give you tenent details
  // your success code here
})
.catch(function(ex) {
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
    requestId: 'your requestId'
}).then(function (resp) {
    // your success code here
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

To login with your credentials, call ****loginWithCredentials()****. After successful login, this will redirect you to the redirect_url that you mentioned earlier while initialising the sdk

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

To login with social providers, call ****loginWithSocial()****. This will redirect you to the facebook login page.

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
    acceptlanguage: 'your locale' // de-de, en-US
}).then(function (resp) {
    // your success code here
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
    acceptlanguage: 'your locale'// example: de-de, en-Us
}, headers).then(function (response) {
    // type your code here
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
  requestId: 'your requestId' // which you will get it from url
})
.then(function (response) {
  // type your code here
})
.catch(function (ex) {
  // your failure code here
});
```

##### Progressive Registration
for progressive registration, call **progressiveRegistration()**.

##### Sample code

```js
cidaas
    .progressiveRegistration({}, {
      trackId: 'your trackId', // which you will get it from url
      requestId: 'your requestId',
      acceptlanguage: 'your locale' // de-de, en-US
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Get Missing Fields Login
To get the missing fields after login, call **getMissingFieldsLogin()**.

##### Sample code

```js
cidaas.getMissingFieldsLogin(track_id)
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
    sub: 'your sub' // which you will get on the registration response
}).then(function (response) {
    // type your code here
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
    // type your code here
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
    // type your code here
}).catch(function(ex) {
    // your failure code here
});
```

#### Resetting your password

##### Initiate Reset Password

To initiate the password resetting, call ****initiateResetPassword()****. This will send verification code to your email or mobile based on the resetMedium you mentioned.

##### Sample code

```js
cidaas.initiateResetPassword({
    email: 'xxxxxx@xxx.com',
    processingType: 'CODE',
    requestId: 'your requestId',
    resetMedium: 'email'
}).then(function (response) {
    // type your code here
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

To handling the reset password by entering the verification code you received, call ****handleResetPassword()****. This will check your verification code was valid or not and allows you to proceed to the next step

##### Sample code
```js
cidaas.handleResetPassword({
    code: 'your code in email or sms or ivr',
    resetRequestId: 'your resetRequestId' // which you will get on initiate reset password response
}).then(function (response) {
    // type your code here
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

To change the password, call ****resetPassword()****. This will allow you to change your password.

##### Sample code
```js
cidaas.resetPassword({        
    password: '123456',
    confirmPassword: '123456',
    exchangeId: 'your exchangeId', // which you will get on handle reset password response
    resetRequestId: 'your resetRequestId' // which you will get on handle reset password response
}).then(function (response) {
    // type your code here
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

To change the password, call ****changePassword()****. This will allow you to change your password.

##### Sample code
```js
cidaas.changePassword({
        old_password: '123456',
        new_password: '123456789',
        confirm_password: '123456789',
        identityId: 'asdauet1-quwyteuqqwejh-asdjhasd',
}, 'your access token')
.then(function () {
    // type your code here
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
        access_token: 'your access token'
}).then(function (response) {
    // type your code here
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

To get the user profile information, call ****getUserProfile()****.

##### Sample code
```js
cidaas.getUserProfile({
        access_token: 'your access token'
}).then(function (response) {
    // type your code here
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
        acceptlanguage: 'your locale' // example: de-de, en-US
}, 'your access token', 'your sub').then(function () {
    // type your code here
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

##### Update Profile Image
To update profile image, call **updateProfileImage()**.

##### Sample code

```js
cidaas
    .updateProfileImage({}, access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
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

   // your success code here

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
Check if user exists, call **userCheckExists()**.

##### Sample code

```js
cidaas
    .userCheckExists({
      requestId: 'your requestId',
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```


##### Initiate account linking
To initiate account linking, call **initiateLinkAccount()**.

##### Sample code

```js
cidaas
    .initiateLinkAccount({},access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Complete link account
To complete account linking, call **completeLinkAccount()**.

##### Sample code

```js
cidaas
    .completeLinkAccount({},access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Get Linked Users
To get linked users, call **getLinkedUsers()**.

##### Sample code

```js
cidaas
    .getLinkedUsers(access_token, sub)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Unlink Account
To unlink an account, call **unlinkAccount()**.

##### Sample code

```js
cidaas
    .unlinkAccount(access_token, identityId)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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
      // type your code here
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

##### Initiate Email verification V2
To initiate email verification, call **initiateEmailV2()**.

##### Sample code

```js
cidaas.initiateEmailV2({})
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
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
      // type your code here
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

##### Authenticate Email V2
To authenticate email verifiaction, call **authenticateEmailV2()**.

##### Sample code

```js
cidaas
    .authenticateEmailV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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
      // type your code here
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

##### Initiate SMS verification V2
To initiate sms verification, call **initiateSMSV2()**.

##### Sample code

```js
cidaas.initiateSMSV2({})
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
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
      // type your code here
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

##### Authenticate SMS V2
To authenticate SMS verifiaction, call **authenticateSMSV2()**.

##### Sample code

```js
cidaas
    .authenticateSMSV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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
      // type your code here
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

##### Initiate IVR verification V2
To initiate IVR verification, call **initiateIVRV2()**.

##### Sample code

```js
cidaas.initiateIVRV2({})
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
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
      // type your code here
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

##### Authenticate IVR V2
To authenticate IVR verifiaction, call **authenticateIVRV2()**.

##### Sample code

```js
cidaas
    .authenticateIVRV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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

##### Initiate Backupcode V2

To create a verification code V2, call ****initiateBackupcodeV2()****.

##### Sample code
```js
    this.cidaas.initiateBackupcodeV2({
        request_id : "request id of a session" // optional parameter
    })
    .then((response) => {
      // type your code here
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
      // type your code here
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

##### Authenticate Backup code V2
To authenticate with backup code , call **authenticateBackupcodeV2()**.

##### Sample code

```js
cidaas
    .authenticateBackupcodeV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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
      // type your code here
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

##### Initiate TOTP verification V2
To initiate totp verification, call **initiateTOTPV2()**.

##### Sample code

```js
cidaas.initiateTOTPV2({})
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
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
      // type your code here
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

##### Authenticate TOTP V2
To authenticate with totp , call **authenticateTOTPV2()**.

##### Sample code

```js
cidaas
    .authenticateTOTPV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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

##### Initiate Pattern verification V2
To initiate pattern verification, call **initiatePatternV2()**.

##### Sample code

```js
cidaas.initiatePatternV2({})
.then(function(response)
{
  // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

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
      // type your code here
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
      // type your code here
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

##### Initiate TouchId verification V2
To initiate touch id verification, call **initiateTouchIdV2()**.

##### Sample code

```js
cidaas
    .initiateTouchIdV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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

##### Initiate Smart Push verification V2
To initiate smart push verification, call **initiateSmartPushV2()**.

##### Sample code

```js
cidaas
    .initiateSmartPushV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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

##### Initiate face verification V2
To initiate face verification, call **initiateFaceV2()**.

##### Sample code

```js
cidaas
    .initiateFaceV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```


##### Authenticate Face Verification
To check  verification type configured, call **authenticateFaceVerification()**.

##### Sample code

```js
cidaas
    .authenticateFaceVerification({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
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
      // type your code here
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
      // type your code here
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


##### Initiate Voice verification V2
To initiate voice verification, call **initiateVoiceV2()**.

##### Sample code

```js
cidaas
    .initiateVoiceV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```
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

##### Get Configured Verification List
To get configured verification list, call **getConfiguredVerificationList()**.

##### Sample code

```js
cidaas
    .getConfiguredVerificationList({},access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```


##### Get All Verification List
To get all verification list, call **getAllVerificationList()**.

##### Sample code

```js
cidaas
    .getAllVerificationList(access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Enroll Verification
To enroll verification, call **enrollVerification()**.

##### Sample code

```js
cidaas
    .enrollVerification({
        verification_type : "verification type"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Setup FIDO Verification
To setup FIDO verification, call **setupFidoVerification()**.

##### Sample code

```js
cidaas
    .setupFidoVerification({
        verification_type : "verification type"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Check Verification Type Configured
To check  verification type configured, call **checkVerificationTypeConfigured()**.

##### Sample code

```js
cidaas
    .checkVerificationTypeConfigured({
        verification_type : "verification type"
    })
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
      consent_name: 'your consent name'
    }).then((response) => {
      // type your code here
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
To get consent details , call **getConsentDetailsV2()**.

##### Sample code

```js
cidaas
    .getConsentDetailsV2({})
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
      // type your code here
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
To accept consent, call **acceptConsentV2()**.

##### Sample code

```js
cidaas
    .acceptConsentV2({})
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
      // type your code here
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
      // type your code here
    }).catch((err) => {
      // your failure code here
    });
```


##### Get Accepted Consent List
To get accepted consent, call **getAcceptedConsentList()**.

##### Sample code

```js
cidaas
    .getAcceptedConsentList({}, access_token)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### View Accepted Consent
To view accepted consent, call **viewAcceptedConsent()**.

##### Sample code

```js
cidaas
    .viewAcceptedConsent({
      sub: "the sub of the user",
      consentReceiptID: "the consent receipt id"
      },
      access_token
      )
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
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
To get scope consent details, call **getScopeConsentDetails()**.

##### Sample code

```js
cidaas
    .getScopeConsentDetails({
      track_id: "the track id of the request",
      locale: "the locale"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Get Scope Consent Version Details V2
To get scope consent version detials V2, call **getScopeConsentVersionDetailsV2()**.

##### Sample code

```js
cidaas
    .getScopeConsentVersionDetailsV2({
      scopeid: "the scope id",
      locale: "the locale"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Accept Scope Consent
To accept scope consent, call **acceptScopeConsent()**.

##### Sample code

```js
cidaas
    .acceptScopeConsent({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Scope Consent Continue Login
To scope consent continue login, call **scopeConsentContinue()**.

##### Sample code

```js
cidaas
    .scopeConsentContinue({
      track_id: "the track id of the request"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Claim Consent Continue Login
To claim consent continue login, call **claimConsentContinue()**.

##### Sample code

```js
cidaas
    .claimConsentContinue({
      track_id: "the track id of the request"
    })
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
      track_id: 'your track id'
    }).then((response) => {
      // type your code here
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
      track_id: 'your track id'
    }).then((response) => {
      // type your code here
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
      // type your code here
    }).catch((err) => {
      // your failure code hereq
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
To get a new token with th grant type authorization_code, call **getAccessToken()**. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Name | Type | Description | Is optional |
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
To validate an access token, call **validateAccessToken()**. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Name | Type | Description | Is optional |
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
To get a new token with the grant type refresh_token, call **renewToken()**. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Name | Type | Description | Is optional |
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
To get the device information, call **getDeviceInfo()**.

##### Sample code

```js
cidaas
    .getDeviceInfo({
        deviceFingerprint: 'your device finger print',
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Delete device
To delete device, call **deleteDevice()**. The function accepts a function parameter of type object. In the sample example the object is named as options. Below are the key that need to be passed in the options object

| Name | Type | Description | Is optional |
| ---- | ---- | ----------- | ----------- |
| device_id | string | request id of the session | false |
| username | string | the username of the user  | false |
| password | string | password to authenticate the username | false |
##### Sample code

```js
options = {
  device_id: "nR5cCI6IkpXVCJ9",
}

cidaas.deleteDevice(options)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```


##### Get Unreviewed Devices
To get unreviewed devices, call **getUnreviewedDevices()**.

##### Sample code

```js
cidaas
    .getUnreviewedDevices(access_token, sub)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Get Reviewed Devices
To get reviewed devices, call **getReviewedDevices()**.

##### Sample code

```js
cidaas
    .getReviewedDevices(access_token, sub)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Review Device
To review a device, call **reviewDevice()**.

##### Sample code

```js
cidaas
    .reviewDevice({}, access_token, sub)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Get invited user details
To get invited user details, call **getInviteUserDetails()**.

##### Sample code

```js
cidaas
    .getInviteUserDetails({
        invite_id: 'id of the invite', // required
    })
    .then(function (response) {
        // type your code here
        doSomething()
    })
    .catch(function (ex) {
        // your failure code here
    });
```

#### MFA
##### Get MFA List
To get the multifactor authentication list **getMFAList()**.

##### Sample code

```js
cidaas.getMFAList({
  email: 'email of the user', // required
  sub: 'sub of the user', // required
})
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Get MFA List V2
To get the multifactor authentication list V2, call **getMFAListV2()**. This is an updated version of **getMFAList()**

##### Sample code

```js
cidaas
    .getMFAListV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Initiate MFA V2
To initiate multifactor authentication V2, call **initiateMFAV2()**.

##### Sample code

```js
cidaas
    .initiateMFAV2({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```
##### Authenticate MFA V2
To authenticate multifactor, call **authenticateMFAV2()**.

##### Sample code

```js
cidaas
    .authenticateMFAV2({
      type : "type of mfa"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Authenticate MFA V2
To authenticate multifactor, call **authenticateMFAV2()**.

##### Sample code

```js
cidaas
    .authenticateMFAV2({
      type : "type of mfa"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Cancel MFA V2
To cancel multifactor verification, call **cancelMFAV2()**.

##### Sample code

```js
cidaas
    .cancelMFAV2({
      type : "type of mfa"
    })
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Update Suggest MFA
To update suggest MFA, call **updateSuggestMFA()**.

##### Sample code

```js
cidaas
    .updateSuggestMFA(track_id, {})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

#### User Activities
##### Get User Activities
To get user activities, call **getUserActivities()**.

##### Sample code

```js
cidaas
    .getUserActivities({})
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

#### Device code flow
##### Device Code Verify
To verify device code, call **deviceCodeVerify()**.

##### Sample code

```js
cidaas.deviceCodeVerify(code)
.then(function (response) {
    // type your code here
})
.catch(function (ex) {
    // your failure code here
});
```

##### Update Socket[DEPRECATED]
To update notification status, call **updateSocket()**. This is a deprecated function, please consider using **updateSocket()** instead.

##### Sample code

```js
cidaas
    .updateSocket(status_id)
    .then(function (response) {
        // type your code here
    })
    .catch(function (ex) {
        // your failure code here
    });
```

##### Update Status
To update notification status, call **updateStatus()**.

##### Sample code

```js
cidaas
    .updateStatus(status_id)
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
|---|---|
|  500 | during creation of WebAuth instance |
|  417 | if there are any other failure |

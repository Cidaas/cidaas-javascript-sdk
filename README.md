## cidaas-javascript-sdk
This cidaas Javascript SDK library is built on the top of [OIDC client javascript library](https://github.com/IdentityModel/oidc-client-js). 

#### Installation

From npm

```
npm install cidaas-javascript-sdk
```

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

Initialise the cidaas sdk using the options.

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
cidaas.loginCallback().then(function(response) {
    // your success code here            
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
    // your success code here
}).catch(function(ex) {
    // your failure code here
});; 
```


##### Logout

```js
cidaas.logout().then(function () {
    // your success code here
}).catch(function(ex) {
    // your failure code here
});
```

In logout method you need give redirect url, if not it will automatically redirect to login page

#### Native SDK methods

The below methods will be applicable for only native support

#### Login and Registration

##### Getting RequestId

Each and every proccesses starts with requestId, it is an entry point to login or register. For getting the requestId, call ****getRequestId()****.

##### Sample code

```js
cidaas.getRequestId().then(function (response) {
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
```js
cidaas.register({ 
    email: 'xxx123@xxx.com',  
    given_name: 'xxxxx', 
    family_name: 'yyyyy', 
    password: '123456', 
    password_echo: '123456', 
    provider: 'your provider' // FACEBOOK, GOOGLE, SELF
}, requestId).then(function (response) {
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
```js
 cidaas.registerWithSocial({
    provider: 'facebook',
    requestId: 'your requestId',
});
```

##### Get Missing Fields

Once social register, it will redirect to the extra information page with requestId and trackId as query parameters. To get the missing fields, call ****getMissingFields()****. This will return you the user information along with the missing fields. You need to render the fields using registration setup and finaly call the ****register()****.

##### Sample code

```js
cidaas.getMissingFields({
        trackId: 'your trackId', // which you will get it from url
        requestId: 'your requestId' // which you will get it from url
}).then(function (response) {
    // type your code here 
}).catch(function (ex) {
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

To complete the verification, call ****authenticateAccountVerification()****. 

##### Sample code
```js
cidaas.authenticateAccountVerification({
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
        provider: 'self'
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

#### Logout user

To logout the user, call ****logoutUser()****.

##### Sample code
```js
cidaas.logoutUser({
        access_token : 'your accessToken'
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
#### Socket Connection

##### Installation

Install ng-socket-io in your project and refer the following link https://www.npmjs.com/package/ng-socket-io to configure. Use the "your_base_url/verification-srv/socket/socket.io" path for the socket listening url and enter the following snippet

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

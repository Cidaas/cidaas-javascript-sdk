# Upgrading Notes
This document described how to handle breaking changes from upgrading Cidaas Javascript SDK to the first stable 4.x release.

## 1. Remove mode from configuration variable & use function from webauth directly instead of mode functions.

The SDK will now allow calling each of the register, login & logout functions directly without having to define mode. 

The following functions should be called instead of old function using the mode. Please note that the default mode value if empy is `redirect`.

| Mode     | Old Function        | New Function         |
|----------|---------------------|----------------------|
| redirect | registerWithBrowser | registerWithBrowser  |
| redirect | loginWithBrowser    | loginWithBrowser     |
| redirect | loginCallback       | loginCallback        |
| redirect | logout              | logout               |
| redirect | logoutCallback      | logoutCallback       |
| window   | registerWithBrowser | popupSignIn          |
| window   | loginWithBrowser    | popupSignIn          |
| window   | loginCallback       | popupSignInCallback  |
| window   | logout              | popupSignOut         |
| window   | logoutCallback      | popupSignOutCallback |
| silent   | registerWithBrowser | silentSignIn         |
| silent   | loginWithBrowser    | silentSignIn         |
| silent   | loginCallback       | silentSignInCallback |
| silent   | logout              | logout               |
| silent   | logoutCallback      | logoutCallback       |

## 2. Use the latest function

Functions which has been deprecated for a while has been removed in V4. There are also changes in the function names. The old & new function name could be found below:

| Old Function                                      | New Function                                |
|---------------------------------------------------|---------------------------------------------|
| getConsentDetailsV2                               | getConsentDetails                           |
| acceptConsentV2                                   | acceptConsent                               |
| getScopeConsentVersionDetailsV2                   | getScopeConsentVersionDetails               |
| getMFAListV2                                      | getMFAList                                  |
| cancelMFAV2                                       | cancelMFA                                   |
| updateSocket                                      | updateStatus                                |
| initiateMFAV2 / initiateMfaV1                     | initiateMFA                                 |
| initiateEmailV2 / initiateEmail                   | initiateMFA({... , type: "email"})          |
| initiateSMSV2 / initiateSMS                       | initiateMFA({... , type: "sms"})            |
| initiateIVRV2 / initiateIVR                       | initiateMFA({... , type: "ivr"})            |
| initiateBackupcodeV2 / initiateBackupcode         | initiateMFA({... , type: "backupcode"})     |
| initiateTOTPV2 / initiateTOTP                     | initiateMFA({... , type: "totp"})           |
| initiatePatternV2 / initiatePattern               | initiateMFA({... , type: "pattern"})        |
| initiateTouchIdV2 / initiateTouchId               | initiateMFA({... , type: "touchid"})        |
| initiateSmartPushV2 / initiateSmartPush           | initiateMFA({... , type: "push"})           |
| initiateFaceV2 / initiateFace                     | initiateMFA({... , type: "face"})           |
| initiateVoiceV2 / initiateVoice                   | initiateMFA({... , type: "voice"})          |
| authenticateMFAV2 / authenticateMfaV1             | authenticateMFA                             |
| authenticateEmailV2 / authenticateEmail           | authenticateMFA({... , type: "email"})      |
| authenticateSMSV2 / authenticateSMS               | authenticateMFA({... , type: "sms"})        |
| authenticateIVRV2 / authenticateIVR               | authenticateMFA({... , type: "ivr"})        |
| authenticateBackupcodeV2 / authenticateBackupcode | authenticateMFA({... , type: "backupcode"}) |
| authenticateTOTPV2 / authenticateTOTP             | authenticateMFA({... , type: "totp"})       |

## 3. Update webAuth entities

some properties in entities request types is updated to mirror current cidaas api request parameter. Please refer to each entity's typedoc in the  to see if there is any changes need to be done.
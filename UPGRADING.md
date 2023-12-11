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
| getScopeConsentVersionDetailsV2                   | getConsentVersionDetails               |
| getMFAListV2                                      | getMFAList                                  |
| cancelMFAV2                                       | cancelMFA                                   |
| updateSocket                                      | getEnrollmentStatus                                |
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
| authenticateFaceVerification            | authenticateMFA({... , type: "face"})       |
| scopeConsentContinue / claimConsentContinue   | consentContinue       |
| loginWithCredentialsAsynFn  | loginWithCredentials       |
| initiateAccountVerificationAsynFn   | initiateAccountVerification       |

## 3. Handling for removed functions

* If you used getMissingFieldsLogin() previously, it now has been reimplemented as getMissingFields() function. The previous getMissingFields() function is redundant and removed.
* If you used loginAfterRegister() previously, now it should be configured from the Admin UI under Advance Setting, Flow Setting.
* setupFidoVerification() & updateSuggestMFA() is removed as the feature is not release yet. It will be added in the future once Cidaas Service support the use case
* device review flow (getReviewedDevices(), getUnreviewedDevices(), reviewDevice()) is no longer supported in the new SDK
* socket functions is no longer supported in the new SDK
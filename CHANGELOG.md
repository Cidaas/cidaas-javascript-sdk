# Changelog

## V5.0.0

If you are upgrading from v4.x.x,  please see [UPGRADING.md](UPGRADING_V5.md)

### Added
- Add logoutUsingAccessToken() function

### Changed
- Support tokens from predefined user storage
- **Breaking** Rework renewToken() to store the newly generated token in user storage
- **Breaking** Rename getUserInfo() to getUserInfoFromStorage()
- **Breaking** Rename getAccessToken() to generateTokenFromCode()

### Removed
- **Breaking** Removed silentSignin() & silentSignInCallback() function
- **Breaking** Removed popupSignInCallback() & popupSignOutCallback()function
- **Breaking** Removed logoutUser() function
- **Breaking** Removed validateAccessToken() function

## V4.3.3

## Changed
- Update GetMFAListRequest to support more parameters

## V4.3.2

### Changed
- Update getRequestId() to support overriding single option

## V4.3.1

### Changed
- Update required functions to accept headers
- Expand resetPassword flow functions with optional handleResponseAsJson for compatibility with older cidaas version
- Define data model for getRequestId() function payload
- Expand getRequestId() function with optional payload as parameter

### Fix
- Fix redirection in readme file

## V4.3.0

### Added
- add initiateVerification(), configureVerification() & configureFriendlyName() functions to verification service
- add actionGuestLogin() functions to login service
- add userActionOnEnrollment() functions to general sdk functions

### Changed
- Update project structure
- Update data model to mirror current cidaas api call
- Improve documentation

### Fix
- Fix vulnerabilities from `npm audit`

## V4.2.4

### Fix
- Fix unable to import into bundler module

## V4.2.3

### Added
- Add back loginAfterRegister functionality

## V4.2.2

### Fixed
- Fix build failing on es2016 and above versions

## V4.2.1

### Added
- Add authentication type

### Changed
- loginWithBrowser can be over-ridden with LoginRedirectOptions 
- popupSignIn can be over-ridden with PopupSignInOptions
- silentSignIn can be over-ridden with SilentSignInOptions
- registerWithBrowser can be over-ridden with LoginRedirectOptions
- loginCallback accepts url location option
- popupSignInCallback accepts url and keepOpen option
- silentSignInCallback accepts url location option
- logout can be over-ridden with LogoutRedirectOptions
- popupSignOut can be over-ridden with PopupSignOutOptions
- logoutCallback accepts url location option
- popupSignOutCallback accepts url location option
- getLoginURL can be over-ridden with LoginRequestOptions

## V4.2.0

### Added
- add back functionality to get missing field from social provider in getMissingFields() function.

### Changed
- loginWithBrowser now returning promise
- registerWithBrowser now returning promise
- popupSignIn now returning User object after popupSignInCallback is finished
- popupSignInCallback now returning promise
- popupSignOut now returning promise
- popupSignOutCallback now returning promise

## V4.1.0

### Added
- add latest getInviteUserDetails API, which can be called by specifying function parameter callLatestAPI: true

### Changed
- support trailing slash on Cidaas options: 'authority'

## V4.0.2

### Fixed
- fix missing error handling in loginCallback() function

## V4.0.1

### Changed
- initiateMFA() function will no longer require accessToken as parameter

## V4.0.0

If you are upgrading from v3.x.x,  please see [UPGRADING.md](UPGRADING_V4.md)

### Fixed
- fix vulnerabilities from `npm audit`
- fix sdk usage from CDN
- fix silent sign in flow
- fix device flow
- fix enrollment flow
- fix revokeClaimConsent() function
- fix getLoginURL() function
- fix updateProfileImage() function
- fix getUserActivities() function
- fix error if query parameter are not included in userCheckExists() function
- fix missing logo on npmjs

### Added
- add more unit tests.
- add initiateEnrollment() functions to verification service
- add initiateDeviceCode() & offlineTokenCheck() functions to token service

### Changed
- **Breaking** authentication module can't be access publicly anymore, instead WebAuth should be used to access authentication functions.
- **Breaking** popup & silent authentication functions is directly implemented in WebAuth instead of using mode.
- **Breaking** silentSignIn is now returning promise
- **Breaking** getLoginURL() function return promise instead of string
- **Breaking** access_token option should be provided to revokeClaimConsent() function in consent service
- **Breaking** use function parameter instead of cidaas configuration file: `cidaas_version` to handle resetPassword
- **Breaking** change getCommunicationStatus parameter
- **Breaking** rename functions with version name
- **Breaking** rename getScopeConsentVersionDetails() function to getConsentVersionDetails()
- **Breaking** rename updateStatus() function to getEnrollmentStatus()
- **Breaking** rename getDeviceInfo() function to createDeviceInfo()
- **Breaking** rename getScopeConsentDetails() function to loginPrecheck()
- **Breaking** getMissingFieldsLogin() is now reimplemented as getMissingFields()
- document functions description and usage as typedoc instead in readme file.
- update cancelMFA() to call the latest cancel endpoint
- update getUserActivities() to call the latest cancel endpoint

### Removed
- **Breaking** remove deprecated functions
- **Breaking** remove duplicate functions
- **Breaking** remove functions which are not supported anymore

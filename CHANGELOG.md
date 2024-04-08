# Changelog

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

If you are upgrading from v3.x.x,  please see ['UPGRADING.md'](UPGRADING.md)

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

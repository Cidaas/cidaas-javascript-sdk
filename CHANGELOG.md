# Changelog

## V4.0

If you are upgrading: please see ['UPGRADING.md'](UPGRADING.md)

### Fixed
- fix silent sign in flow

### Added
- popup & silent authentication functions is directly implemented in WebAuth instead of using mode.
- document functions as typedoc.
- add more unit tests.
- add access_token option to revokeClaimConsent() function

### Changed
- **Breaking** rename functions.
- **Breaking** update WebAuth Entities
- **Breaking** silentSignIn now returning User Promise

### Removed
- **Breaking** remove deprecated functions
- **Breaking** remove mode parameter from Cidaas Option Variable.
- Documentation in readme is shorten as function will be documented as typedoc.
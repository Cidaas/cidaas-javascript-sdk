# Upgrading Notes
This document described how to handle breaking changes from upgrading Cidaas Javascript SDK v4.x.x to the stable v5.0.0 release.

## 1. Use the latest function

There are changes in the function names. The old & new function name could be found below:

| Old Function                                      | New Function                                |
|---------------------------------------------------|---------------------------------------------|
| getUserInfo                                       | getUserInfoFromStorage                      |
| getAccessToken                                    | generateTokenFromCode                       |

## 2. Handling for removed functions

* If you used silentSignin() previously, it has now been reimplemented as renewToken() function. The previous existing renewToken() function is removed, to be replaced by the new implementation. You won't have to send parameter unlike the previous implementation, as all the information needed can be fetched from user storage.
* If you used silentSignInCallback() previously, now it is recommended to use loginCallback() instead.
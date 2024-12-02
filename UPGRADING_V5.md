# Upgrading Notes
This document described how to handle breaking changes from upgrading Cidaas Javascript SDK v4.x.x to the stable v5.0.0 release.

## 1. Update access token handling

As the SDK now using user storage to handle access token, if previously you saved the token manually, check whether there is conflict between access token in user storage & client side implementation. If you don't want to use user storage, you can use InMemoryWebStorage to remove all tokens information from the storage after refreshing the app.

```js
const options = {
    authority: 'your domain base url',
    ...,
    userStore: new WebStorageStateStore({ store: new InMemoryWebStorage()})
}
```

## 2. Use the latest function

There are changes in the function names. The old & new function name could be found below:

| Old Function                                      | New Function                                |
|---------------------------------------------------|---------------------------------------------|
| getUserInfo                                       | getUserInfoFromStorage                      |
| getAccessToken                                    | generateTokenFromCode                       |

## 3. Handling for removed functions

* If you used silentSignin() previously, it has now been reimplemented as renewToken() function. The previous existing renewToken() function is removed, to be replaced by the new implementation, which will look for refresh token in user storage instead of using function parameter.
* If you used silentSignInCallback() or popupSignInCallback() previously, now it is recommended to use loginCallback() instead.
* If you used popupSignOutCallback() previously, now it is recommended to use logoutCallback() instead.
* If you used logoutUser() previously, you can now use logout() if sdk user storage is used to store tokens. In case the tokens are not stored on sdk user storage, you could use logoutUsingAccessToken().
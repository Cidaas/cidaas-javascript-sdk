var Authentication = require('../authentication');
var CustomException = require('./exception');
var Oidc = require('oidc-client');
var CryptoJS = require("crypto-js");
var fingerprint = require('@fingerprintjs/fingerprintjs');

var headers = {'x-lat': 'value','x-lng': 'value'}; 


var code_verifier;

function WebAuth(settings) {
  try {
    var usermanager = new Oidc.UserManager(settings);
    window.webAuthSettings = settings;
    window.usermanager = usermanager;
    window.localeSettings = null;
    window.authentication = new Authentication(window.webAuthSettings, window.usermanager);                        
    window.usermanager.events.addSilentRenewError(function (error) {
      throw new CustomException("Error while renewing silent login", 500);
    });
  } catch (ex) {
    console.log(ex);
  }
}

var registrationFields = [];

// prototype methods 
// login
WebAuth.prototype.loginWithBrowser = function () {
  try {
    if (!window.webAuthSettings && !window.authentication) {
      throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
    }
    if (!window.webAuthSettings.mode) {
      window.webAuthSettings.mode = 'redirect';
    }
    if (window.webAuthSettings.mode == 'redirect') {
      window.authentication.redirectSignIn('login');
    } else if (window.webAuthSettings.mode == 'window') {
      window.authentication.popupSignIn();
    } else if (window.webAuthSettings.mode == 'silent') {
      window.authentication.silentSignIn();
    }
  } catch (ex) {
    console.log(ex);
  }
};

// register
WebAuth.prototype.registerWithBrowser = function () {
  try {
    if (!window.webAuthSettings && !window.authentication) {
      throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
    }
    if (!window.webAuthSettings.mode) {
      window.webAuthSettings.mode = 'redirect';
    }
    if (window.webAuthSettings.mode == 'redirect') {
      window.authentication.redirectSignIn('register');
    } else if (window.webAuthSettings.mode == 'window') {
      window.authentication.popupSignIn();
    } else if (window.webAuthSettings.mode == 'silent') {
      window.authentication.silentSignIn();
    }
  } catch (ex) {
    console.log(ex);
  }
};

// login callback
WebAuth.prototype.loginCallback = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      if (!window.webAuthSettings.mode) {
        window.webAuthSettings.mode = 'redirect';
      }
      if (window.webAuthSettings.mode == 'redirect') {
        window.authentication.redirectSignInCallback().then(function (user) {
          resolve(user);
        }).catch(function (ex) {
          reject(ex);
        });
      } else if (window.webAuthSettings.mode == 'window') {
        window.authentication.popupSignInCallback();
      } else if (window.webAuthSettings.mode == 'silent') {
        window.authentication.silentSignInCallbackV2().then(function (data) {
          resolve(data);
        }).catch(function (error) {
          reject(error);
        })
      }
    } catch (ex) {
      console.log(ex);
    }
  });
};

// get user info
WebAuth.prototype.getUserInfo = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (window.usermanager) {
        window.usermanager.getUser()
          .then(function (user) {
            if (user) {
              resolve(user);
              return;
            }
            resolve(undefined);
          });
      } else {
        throw new CustomException("UserManager cannot be empty", 417);
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

// get user info
WebAuth.prototype.getUserProfile = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.access_token) {
        throw new CustomException("access_token cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${options.access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get user info (internal)
WebAuth.prototype.getProfileInfo = function (access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token) {
        throw new CustomException("access_token cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/internal/userinfo/profile";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};


// logout
WebAuth.prototype.logout = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      if (!window.webAuthSettings.mode) {
        window.webAuthSettings.mode = 'redirect';
      }
      if (window.webAuthSettings.mode == 'redirect') {
        window.authentication.redirectSignOut().then(function (result) {
          resolve(result);
          return;
        });
      } else if (window.webAuthSettings.mode == 'window') {
        window.authentication.popupSignOut();
      } else if (window.webAuthSettings.mode == 'silent') {
        window.authentication.redirectSignOut();
      } else {
        resolve(undefined);
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

// logout callback
WebAuth.prototype.logoutCallback = function () {
  return new Promise(function (resolve, reject) {
    try {
      if (!window.webAuthSettings && !window.authentication) {
        throw new CustomException("Settings or Authentication instance in OIDC cannot be empty", 417);
      }
      if (!window.webAuthSettings.mode) {
        window.webAuthSettings.mode = 'redirect';
      }
      if (window.webAuthSettings.mode == 'redirect') {
        window.authentication.redirectSignOutCallback().then(function (resp) {
          resolve(resp);
        });
      } else if (window.webAuthSettings.mode == 'window') {
        window.authentication.popupSignOutCallback();
      } else if (window.webAuthSettings.mode == 'silent') {
        window.authentication.redirectSignOutCallback();
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

function createPostPromise(options, serviceurl, errorResolver, access_token, headers) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(errorResolver);
          }
        }
      };
      http.open("POST", serviceurl, true);
      http.setRequestHeader("Content-type", "application/json");
      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
           console.log(`${key}: ${headers[key]}`);
           http.setRequestHeader(`${key}: ${headers[key]}`);
         } 
         }
      if (access_token) {
        http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      }
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      if (options) {
        http.send(JSON.stringify(options));
      } else {
        http.send();
      }
    } catch (ex) {
      reject(ex);
    }
  });
}
// renew token
WebAuth.prototype.renewToken = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.refresh_token) {
        throw new CustomException("refresh_token cannot be empty", 417);
      }
      options.client_id = window.webAuthSettings.client_id;
      options.grant_type = 'refresh_token';
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

WebAuth.prototype.generateCodeVerifier = function () {
  code_verifier = this.generateRandomString(32);
};

WebAuth.prototype.generateRandomString = function (length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

WebAuth.prototype.generateCodeChallenge = function (code_verifier) {
  return this.base64URL(CryptoJS.SHA256(code_verifier));
};

WebAuth.prototype.base64URL = function (string) {
  return string.toString(CryptoJS.enc.Base64).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// get login url
WebAuth.prototype.getLoginURL = function () {
  var settings = window.webAuthSettings;
  if (!settings.response_type) {
    settings.response_type = "code";
  }
  if (!settings.scope) {
    settings.scope = "email openid profile mobile";
  }

  this.generateCodeVerifier();

  var loginURL = settings.authority + "/authz-srv/authz?client_id=" + settings.client_id;
  loginURL += "&redirect_uri=" + settings.redirect_uri;
  loginURL += "&nonce=" + new Date().getTime().toString();
  loginURL += "&response_type=" + settings.response_type;
  loginURL += "&code_challenge=" + this.generateCodeChallenge(code_verifier);
  loginURL += "&code_challenge_method=S256";
  if (settings.response_mode && settings.response_mode == 'query') {
    loginURL += "&response_mode=" + settings.response_mode;
  }
  loginURL += "&scope=" + settings.scope;
  console.log(loginURL);
  return loginURL;
};

// get access token from code 
WebAuth.prototype.getAccessToken = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.code) {
        throw new CustomException("code cannot be empty", 417);
      }
      options.client_id = window.webAuthSettings.client_id;
      options.redirect_uri = window.webAuthSettings.redirect_uri;
      options.code_verifier = code_verifier;
      options.grant_type = "authorization_code";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/token-srv/token";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// validate access token
WebAuth.prototype.validateAccessToken = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.token || !options.token_type_hint) {
        throw new CustomException("token or token_type_hint cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/token-srv/introspect";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};


// get request id
WebAuth.prototype.getRequestId = function () {
  return new Promise(function (resolve, reject) {
    try {
      var respone_type = window.webAuthSettings.response_type;
      if (!respone_type) {
        respone_type = "token";
      }
      var response_mode = window.webAuthSettings.response_mode;
      if (!response_mode) {
        response_mode = "fragment";
      }
      var bodyParams = {
        "client_id": window.webAuthSettings.client_id,
        "redirect_uri": window.webAuthSettings.redirect_uri,
        "response_type": respone_type,
        "response_mode": response_mode,
        "scope": window.webAuthSettings.scope,
        "nonce": new Date().getTime().toString()
      };
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/authz-srv/authrequest/authz/generate";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(bodyParams));
    } catch (ex) {
      reject(ex);
    }
  });
};

// login with username and password
WebAuth.prototype.loginWithCredentials = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/login";
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();

  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// login with username and password and return response
WebAuth.prototype.loginWithCredentialsAsynFn = async function (options) {
  try {

    const searchParams = new URLSearchParams(options);

    const response = fetch(window.webAuthSettings.authority + "/login-srv/login", {
      method: "POST",
      redirect: "follow",
      body: searchParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    return response;

  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// login with social
WebAuth.prototype.loginWithSocial = function (options, queryParams) {
  try {
    var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/login/" + options.provider.toLowerCase() + "/" + options.requestId;
    if (queryParams && queryParams.dc && queryParams.device_fp) {
      _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
    }
    window.location.href = _serviceURL;
  } catch (ex) {
    console.log(ex);
  }
};

// register with social
WebAuth.prototype.registerWithSocial = function (options, queryParams) {
  try {
    var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/register/" + options.provider.toLowerCase() + "/" + options.requestId;
    if (queryParams && queryParams.dc && queryParams.device_fp) {
      _serviceURL = _serviceURL + "?dc=" + queryParams.dc + "&device_fp=" + queryParams.device_fp;
    }
    window.location.href = _serviceURL;
  } catch (ex) {
    console.log(ex);
  }
};

// get missing fields
WebAuth.prototype.getMissingFields = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/trackinfo/" + options.requestId + "/" + options.trackId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get Tenant info
WebAuth.prototype.getTenantInfo = function () {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/public-srv/tenantinfo/basic";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// logout api call
WebAuth.prototype.logoutUser = function (options) {
  try {
    window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// get Client Info
WebAuth.prototype.getClientInfo = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/public-srv/public/" + options.requestId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get all devices associated to the client 
WebAuth.prototype.getDevicesInfo = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/device-srv/devices";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      if(window.navigator.userAgent) {
        http.setRequestBody("userAgent", window.navigator.userAgent)
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// delete a device 
WebAuth.prototype.deleteDevice = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/device-srv/device/" + options.device_id;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("DELETE", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      if(window.navigator.userAgent) {
        http.setRequestBody("userAgent", window.navigator.userAgent)
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get Registration setup
WebAuth.prototype.getRegistrationSetup = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/registration-setup-srv/public/list?acceptlanguage=" + options.acceptlanguage + "&requestId=" + options.requestId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            var parsedResponse = JSON.parse(http.responseText);
            if (parsedResponse && parsedResponse.data && parsedResponse.data.length > 0) {
              registrationFields = parsedResponse.data;
            }
            resolve(parsedResponse);
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// register user
WebAuth.prototype.register = function (options, headers) {
  return new Promise(function (resolve, reject) {
    try {

      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
      if (options.invite_id) {
        _serviceURL = _serviceURL + "?invite_id=" + options.invite_id;
      }
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("requestId", headers.requestId);
      if (headers.captcha) {
        http.setRequestHeader("captcha", headers.captcha);
      }
      if (headers.acceptlanguage) {
        http.setRequestHeader("accept-language", headers.acceptlanguage);
      } else if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      if (headers.bot_captcha_response) {
        http.setRequestHeader("bot_captcha_response", headers.bot_captcha_response);
      }
      let trackId = headers.trackid || headers.trackId;
      if (trackId) {
        http.setRequestHeader("trackid", trackId);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// get invite info
WebAuth.prototype.getInviteUserDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/invite/info/" + options.invite_id;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get Communication status
WebAuth.prototype.getCommunicationStatus = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/communication/status/" + options.sub;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (options.requestId) {
        http.setRequestHeader("requestId", options.requestId);
      }
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate verification
WebAuth.prototype.initiateAccountVerification = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/verification-srv/account/initiate";
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// initiate verification and return response
WebAuth.prototype.initiateAccountVerificationAsynFn = async function (options) {
   try {

    const searchParams = new URLSearchParams(options);

    const response = fetch(window.webAuthSettings.authority + "/verification-srv/account/initiate", {
      method: "POST",
      redirect: "follow",
      body: searchParams.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    });

    return response;

  } catch (ex) {
    throw new CustomException(ex, 417);
  } 
  
};

// verofy account
WebAuth.prototype.verifyAccount = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate reset password
WebAuth.prototype.initiateResetPassword = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};


// handle reset password
WebAuth.prototype.handleResetPassword = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// reset password
WebAuth.prototype.resetPassword = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// get mfa list
WebAuth.prototype.getMFAList = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var query = "";
      if (!options.email && !options.sub) {
        throw new CustomException("either sub or email cannot be empty", 417);
      }
      if (options.sub) {
        query = "?sub=" + options.sub;
      } else {
        query = "?email=" + options.email;
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/settings/list" + query;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get mfa list v2
WebAuth.prototype.getMFAListV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
  return createPostPromise(options, headers, _serviceURL, false);
};



// initiate mfa v2
WebAuth.prototype.initiateMFAV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate email
WebAuth.prototype.initiateEmail = function (options, headers) {
  options.verificationType = "EMAIL"
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate email v2
WebAuth.prototype.initiateEmailV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/email";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate sms
WebAuth.prototype.initiateSMS = function (options, headers) {
  options.verificationType = "SMS";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate sms v2
WebAuth.prototype.initiateSMSV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/sms";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate ivr
WebAuth.prototype.initiateIVR = function (options, headers) {
  options.verificationType = "IVR";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate ivr v2
WebAuth.prototype.initiateIVRV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/ivr";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate backupcode
WebAuth.prototype.initiateBackupcode = function (options, headers) {
  options.verificationType = "BACKUPCODE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate backupcode v2
WebAuth.prototype.initiateBackupcodeV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/backupcode";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate TOTP
WebAuth.prototype.initiateTOTP = function (options, headers) {
  options.verificationType = "TOTP";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate totp v2
WebAuth.prototype.initiateTOTPV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/totp";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate Pattern
WebAuth.prototype.initiatePattern = function (options, headers) {
  options.verificationType = "PATTERN";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate pattern v2
WebAuth.prototype.initiatePatternV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/pattern";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate touchid
WebAuth.prototype.initiateTouchId = function (options, headers) {
  options.verificationType = "TOUCHID";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate touchid v2
WebAuth.prototype.initiateTouchIdV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/touchid";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate smart push
WebAuth.prototype.initiateSmartPush = function (options, headers) {
  options.verificationType = "PUSH";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate smart push v2
WebAuth.prototype.initiateSmartPushV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/push";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate Face
WebAuth.prototype.initiateFace = function (options, headers) {
  options.verificationType = "FACE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate face v2
WebAuth.prototype.initiateFaceV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/face";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// initiate Voice
WebAuth.prototype.initiateVoice = function (options, headers) {
  options.verificationType = "VOICE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// initiate voice v2
WebAuth.prototype.initiateVoiceV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/voice";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate mfa v2
WebAuth.prototype.authenticateMFAV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// cancel mfa v2
WebAuth.prototype.cancelMFAV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/cancel/" + options.type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate email
WebAuth.prototype.authenticateEmail = function (options, headers) {
  options.verificationType = "EMAIL";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// authenticate email v2
WebAuth.prototype.authenticateEmailV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/email";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate sms
WebAuth.prototype.authenticateSMS = function (options, headers) {
  options.verificationType = "SMS";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// authenticate sms v2
WebAuth.prototype.authenticateSMSV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/sms";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate ivr
WebAuth.prototype.authenticateIVR = function (options, headers) {
  options.verificationType = "IVR";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// authenticate ivr v2
WebAuth.prototype.authenticateIVRV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/ivr";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate backupcode
WebAuth.prototype.authenticateBackupcode = function (options, headers) {
  options.verificationType = "BACKUPCODE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// authenticate backupcode v2
WebAuth.prototype.authenticateBackupcodeV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/backupcode";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticate totp
WebAuth.prototype.authenticateTOTP = function (options, headers) {
  options.verificationType = "TOTP";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
  return createPostPromise(options, headers, _serviceURL, false);
};

// authenticate totp v2
WebAuth.prototype.authenticateTOTPV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/totp";
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// passwordless login
WebAuth.prototype.passwordlessLogin = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/verification/login";
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// get consent details
WebAuth.prototype.getConsentDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/settings/public?name=" + options.consent_name;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get user consent details
WebAuth.prototype.getConsentDetailsV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
  return createPostPromise(options, headers, _serviceURL, false);
};

// acceptConsent
WebAuth.prototype.acceptConsent = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/status";
  return createPostPromise(options, headers, _serviceURL, false);
};

WebAuth.prototype.acceptConsentV2 = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
  return createPostPromise(options, headers, _serviceURL, false);
};

// get scope consent details
WebAuth.prototype.getScopeConsentDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + options.track_id + "?acceptLanguage=" + options.locale;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get scope consent version details
WebAuth.prototype.getScopeConsentVersionDetailsV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/versions/details/" + options.scopeid + "?locale=" + options.locale;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${options.access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// accept scope Consent
WebAuth.prototype.acceptScopeConsent = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
  return createPostPromise(options, headers, _serviceURL, false);
};

// scope consent continue login
WebAuth.prototype.scopeConsentContinue = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
    form.method = 'POST';
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// accept claim Consent
WebAuth.prototype.acceptClaimConsent = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/accept";
  return createPostPromise(options, headers, _serviceURL, false);
};

// claim consent continue login
WebAuth.prototype.claimConsentContinue = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
    form.method = 'POST';
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// revoke claim Consent
WebAuth.prototype.revokeClaimConsent = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/claim/revoke";
  return createPostPromise(options, headers, _serviceURL, false);
};


// get Deduplication details
WebAuth.prototype.getDeduplicationDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/info/" + options.trackId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// deduplication login
WebAuth.prototype.deduplicationLogin = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/users-srv/deduplication/login/redirection?trackId=" + options.trackId + "&requestId=" + options.requestId + "&sub=" + options.sub;
    form.method = 'POST';
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// register Deduplication
WebAuth.prototype.registerDeduplication = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// consent continue login
WebAuth.prototype.consentContinue = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};


// mfa continue login
WebAuth.prototype.mfaContinue = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};


// change password continue
WebAuth.prototype.firstTimeChangePassword = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.loginSettingsId;
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// change password 
WebAuth.prototype.changePassword = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// update profile
WebAuth.prototype.updateProfile = function (options, access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/profile/" + sub;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("PUT", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get user activities
WebAuth.prototype.getUserActivities = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/useractivity-srv/latestactivity";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// get unreviewed devices
WebAuth.prototype.getUnreviewedDevices = function (access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/unreviewlist/" + sub;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get reviewed devices
WebAuth.prototype.getReviewedDevices = function (access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/reviewlist/" + sub;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// review device
WebAuth.prototype.reviewDevice = function (options, access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/reports-srv/device/updatereview";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("PUT", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get accepted consent list
WebAuth.prototype.getAcceptedConsentList = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/details/consent";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// view accepted consent 
WebAuth.prototype.viewAcceptedConsent = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/receipt/" + options.consentReceiptID + "?sub=" + options.sub;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(false);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("Authorization", `Bearer ${access_token}`);
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get configured verification list
WebAuth.prototype.getConfiguredVerificationList = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/settings/list";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// initiate link accoount
WebAuth.prototype.initiateLinkAccount = function (options, headers, access_token) {
  options.user_name_type = 'email';
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// complete link accoount
WebAuth.prototype.completeLinkAccount = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// get linked users
WebAuth.prototype.getLinkedUsers = function (access_token, headers, sub) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// unlink accoount
WebAuth.prototype.unlinkAccount = function (access_token, headers, identityId) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// get all verification list
WebAuth.prototype.getAllVerificationList = function (access_token, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/config/list";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// image upload
WebAuth.prototype.updateProfileImage = function (options, headers, access_token) {
  var _serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};


// setup email
WebAuth.prototype.setupEmail = function (options, headers) {
  options.verificationType = "EMAIL";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, undefined);
};

// setup sms
WebAuth.prototype.setupSMS = function (options, headers) {
  options.verificationType = "SMS";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, undefined);
};

// setup ivr
WebAuth.prototype.setupIVR = function (options, headers) {
  options.verificationType = "IVR";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup backupcode
WebAuth.prototype.setupBackupcode = function (options, headers, access_token) {
  options.verificationType = "BACKUPCODE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup totp
WebAuth.prototype.setupTOTP = function (options, headers, access_token) {
  options.verificationType = "TOTP";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup pattern
WebAuth.prototype.setupPattern = function (options, headers, access_token) {
  options.verificationType = "PATTERN";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup touch
WebAuth.prototype.setupTouchId = function (options, headers, access_token) {
  options.verificationType = "TOUCHID";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup smart push
WebAuth.prototype.setupSmartPush = function (options, headers, access_token) {
  options.verificationType = "PUSH";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup face
WebAuth.prototype.setupFace = function (options, headers, access_token) {
  options.verificationType = "FACE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// setup voice
WebAuth.prototype.setupVoice = function (options, headers, access_token) {
  options.verificationType = "VOICE";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// enroll Email
WebAuth.prototype.enrollEmail = function (options, headers, access_token) {
  options.verificationType = "EMAIL";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// enroll SMS
WebAuth.prototype.enrollSMS = function (options, headers, access_token) {
  options.verificationType = "SMS";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// enroll IVR
WebAuth.prototype.enrollIVR = function (options, headers, access_token) {
  options.verificationType = "IVR";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// enroll TOTP
WebAuth.prototype.enrollTOTP = function (options, headers, access_token) {
  options.verificationType = "TOTP";
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
  return createPostPromise(options, headers, _serviceURL, false, access_token);
};

// updateSuggestMFA
WebAuth.prototype.updateSuggestMFA = function (track_id, options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/suggested/mfa/update/" + track_id;
  return createPostPromise(options, headers, _serviceURL, false);
};

// enrollVerification
WebAuth.prototype.enrollVerification = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/enroll/" + options.verification_type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// updateSocket
WebAuth.prototype.updateSocket = function (status_id) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/notification/status/" + status_id;
  return createPostPromise(undefined, _serviceURL, undefined);
};

// setupFidoVerification
WebAuth.prototype.setupFidoVerification = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/initiate/suggestmfa/" + options.verification_type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// checkVerificationTypeConfigured
WebAuth.prototype.checkVerificationTypeConfigured = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticateVerification
WebAuth.prototype.authenticateVerification = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/" + options.verification_type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// authenticateVerification form type (for face)
WebAuth.prototype.authenticateFaceVerification = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/authenticate/face";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(undefined);
          }
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiateVerification
WebAuth.prototype.initiateVerification = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/authenticate/initiate/" + options.verification_type;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

// deleteUserAccount
WebAuth.prototype.deleteUserAccount = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unregister/scheduler/schedule/" + options.sub;
  return createPostPromise(options, headers, _serviceURL, undefined, options.access_token);
};

// getMissingFieldsLogin
WebAuth.prototype.getMissingFieldsLogin = function (trackId) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/token-srv/prelogin/metadata/" + trackId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(undefined);
          }
        }
      };
      http.open("GET", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// progressiveRegistration
WebAuth.prototype.progressiveRegistration = function (options, headers) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/login-srv/progressive/update/user";
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          if (http.responseText) {
            resolve(JSON.parse(http.responseText));
          } else {
            resolve(undefined);
          }
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.setRequestHeader("requestId", headers.requestId);
      http.setRequestHeader("trackId", headers.trackId);
      if (headers.acceptlanguage) {
        http.setRequestHeader("accept-language", headers.acceptlanguage);
      } else if (window.localeSettings) {
        http.setRequestHeader("accept-language", window.localeSettings);
      }
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// loginAfterRegister
WebAuth.prototype.loginAfterRegister = function (options) {
  try {
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/login/handle/afterregister/" + options.trackId;
    form.method = 'POST';
    for (var key in options) {
      if (options.hasOwnProperty(key)) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", options[key]);

        form.appendChild(hiddenField);
      }
    }
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// device code flow - verify
WebAuth.prototype.deviceCodeVerify = function (code) {
  const params = `user_code=${encodeURI(code)}`;
  const url = `${window.webAuthSettings.authority}/token-srv/device/verify?${params}`;
  try {
    const form = document.createElement('form');
    form.action = url
    form.method = 'GET';
    const hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", 'user_code');
    hiddenField.setAttribute("value", encodeURI(code));

    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new Error(ex);
  }
}


WebAuth.prototype.userCheckExists = function (options, headers) {
  var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/checkexists/" + options.requestId;
  return createPostPromise(options, headers, _serviceURL, undefined);
};

WebAuth.prototype.setAcceptLanguageHeader = function (acceptLanguage) {
  window.localeSettings = acceptLanguage;
}

// get device info
WebAuth.prototype.getDeviceInfo = function () {
  return new Promise(function (resolve, reject) {
    try {
      const value = ('; '+document.cookie).split(`; cidaas_dr=`).pop().split(';')[0];
      const fpPromise = fingerprint.load();
      var options = {fingerprint:"", userAgent:""};
      if(!value) {
        (async () => {
          const fp = await fpPromise;
          const result = await fp.get();
          options.fingerprint = result.visitorId
          options.userAgent = window.navigator.userAgent
          var http = new XMLHttpRequest();
          var _serviceURL = window.webAuthSettings.authority + "/device-srv/deviceinfo";
          http.onreadystatechange = function () {
            if (http.readyState == 4) {
              resolve(JSON.parse(http.responseText));
            }
          };
          http.open("POST", _serviceURL, true);
          http.setRequestHeader("Content-type", "application/json");
          if (window.localeSettings) {
            http.setRequestHeader("accept-language", window.localeSettings);
          }
          http.send(JSON.stringify(options));
        })();
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

module.exports = WebAuth;

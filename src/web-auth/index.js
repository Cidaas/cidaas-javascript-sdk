var Authentication = require('../authentication');
var CustomException = require('./exception');
var Oidc = require('oidc-client');
var CryptoJS = require("crypto-js");

var code_verifier;

function WebAuth(settings) {
  try {
    var usermanager = new Oidc.UserManager(settings);
    window.webAuthSettings = settings;
    window.usermanager = usermanager;
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
        window.authentication.silentSignInCallback();
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
      console.log("Access token : " + options.access_token);
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
      http.setRequestHeader("access_token", options.access_token);
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
      var bodyParams = {
        "client_id": window.webAuthSettings.client_id,
        "redirect_uri": window.webAuthSettings.redirect_uri,
        "response_type": "token",
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
      http.send(JSON.stringify(bodyParams));
    } catch (ex) {
      reject(ex);
    }
  });
};

// login with username and password
WebAuth.prototype.loginWithCredentials = function (options) {
  try {
    if (!options.username || !options.password || !options.requestId || !options.username_type) {
      throw new CustomException("Username or password or requestId or username_type cannot be empty", 417);
    }
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

// login with social
WebAuth.prototype.loginWithSocial = function (options) {
  try {
    console.log(options);
    if (!options.provider || !options.requestId) {
      throw new CustomException("provider or requestId cannot be empty", 417);
    }
    var http = new XMLHttpRequest();
    var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/login/" + options.provider.toLowerCase() + "/" + options.requestId;
    window.location.href = _serviceURL;
  } catch (ex) {
    console.log(ex);
  }
};

// register with social
WebAuth.prototype.registerWithSocial = function (options) {
  try {
    console.log(options);
    if (!options.provider || !options.requestId) {
      throw new CustomException("provider or requestId cannot be empty", 417);
    }
    var http = new XMLHttpRequest();
    var _serviceURL = window.webAuthSettings.authority + "/login-srv/social/register/" + options.provider.toLowerCase() + "/" + options.requestId;
    window.location.href = _serviceURL;
  } catch (ex) {
    console.log(ex);
  }
};

// get missing fields
WebAuth.prototype.getMissingFields = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      console.log(options);
      if (!options.trackId || !options.requestId) {
        throw new CustomException("trackId or requestId cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// logout api call
WebAuth.prototype.logoutUser = function (options) {
  try {
    if (!options.access_token) {
      throw new CustomException("access_token cannot be empty", 417);
    }
    window.location.href = window.webAuthSettings.authority + "/session/end_session?access_token_hint=" + options.access_token + "&post_logout_redirect_uri=" + window.webAuthSettings.post_logout_redirect_uri;
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// get Client Info
WebAuth.prototype.getClientInfo = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.requestId) {
        throw new CustomException("requestId cannot be empty", 417);
      }
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
      if (!options.requestId || !options.acceptlanguage) {
        throw new CustomException("requestId or acceptlanguage cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// register user
WebAuth.prototype.register = function (options, requestId, captcha) {
  return new Promise(function (resolve, reject) {
    try {

      var empty = false;

      // validate fields
      if (registrationFields && registrationFields.length > 0) {
        var requiredFields = registrationFields.filter(function (c) {
          return c.required == true;
        }).map((function (c) {
          return c.fieldKey;
        }));

        requiredFields.forEach(function (req) {
          if (!options[req]) {
            empty = true;
          }
        });
      }

      if (empty) {
        throw new CustomException("Please make sure you fill all the fields", 417);
      }

      if (!options.provider) {
        throw new CustomException("Provider cannot be empty", 417);
      }

      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/register";
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
      http.setRequestHeader("requestId", requestId);
      http.setRequestHeader("captcha", captcha);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// get Communication status
WebAuth.prototype.getCommunicationStatus = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.sub) {
        throw new CustomException("sub cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate verification
WebAuth.prototype.initiateAccountVerification = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.verificationMedium || !options.requestId || !options.processingType || !options.sub) {
        throw new CustomException("verificationMedium or requestId or processingType or sub cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// verofy account
WebAuth.prototype.verifyAccount = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.accvid || !options.code) {
        throw new CustomException("accvid or code cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/account/verify";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate reset password
WebAuth.prototype.initiateResetPassword = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.email || !options.processingType || !options.requestId || !options.resetMedium) {
        throw new CustomException("email or processingType or requestId or resetMedium cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};


// handle reset password
WebAuth.prototype.handleResetPassword = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.code || !options.resetRequestId) {
        throw new CustomException("code or resetRequestId cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/validatecode";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// reset password
WebAuth.prototype.resetPassword = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.password || !options.confirmPassword || !options.exchangeId || !options.resetRequestId) {
        throw new CustomException("password or confirmPassword or exchangeId or resetRequestId cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/resetpassword/accept";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate email
WebAuth.prototype.initiateEmail = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "EMAIL";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate sms
WebAuth.prototype.initiateSMS = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.userDeviceId || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or userDeviceId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "SMS";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate ivr
WebAuth.prototype.initiateIVR = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.userDeviceId || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or userDeviceId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "IVR";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate backupcode
WebAuth.prototype.initiateBackupcode = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "BACKUPCODE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate TOTP
WebAuth.prototype.initiateTOTP = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOTP";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate Pattern
WebAuth.prototype.initiatePattern = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "PATTERN";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate touchid
WebAuth.prototype.initiateTouchId = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOUCHID";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate smart push
WebAuth.prototype.initiateSmartPush = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "PUSH";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate Face
WebAuth.prototype.initiateFace = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "FACE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate Voice
WebAuth.prototype.initiateVoice = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.usageType || !options.deviceInfo || !options.deviceInfo.deviceId || (!options.email && !options.sub)) {
        throw new CustomException("either sub or email and usageType or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "VOICE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/initiate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate email
WebAuth.prototype.authenticateEmail = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.code || !options.statusId || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("code or statusId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "EMAIL";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate sms
WebAuth.prototype.authenticateSMS = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.code || !options.statusId || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("code or statusId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "SMS";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate ivr
WebAuth.prototype.authenticateIVR = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.code || !options.statusId || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("code or statusId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "IVR";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate backupcode
WebAuth.prototype.authenticateBackupcode = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.verifierPassword || !options.statusId || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("verifierPassword or statusId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "BACKUPCODE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate totp
WebAuth.prototype.authenticateTOTP = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.verifierPassword || !options.statusId || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("verifierPassword or code or statusId or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOTP";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/authenticate";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// passwordless login
WebAuth.prototype.passwordlessLogin = function (options) {
  try {
    if (!options.trackingCode || !options.sub || !options.requestId || !options.verificationType) {
      throw new CustomException("trackingCode or sub or requestId or verificationType cannot be empty", 417);
    }
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
      if (!options.consent_name) {
        throw new CustomException("consent_name cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// acceptConsent
WebAuth.prototype.acceptConsent = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.client_id || !options.name || !options.sub || !options.accepted) {
        throw new CustomException("client_id or name or sub or accepted cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/status";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// get scope consent details
WebAuth.prototype.getScopeConsentDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.track_id || !options.locale) {
        throw new CustomException("track_id or locale cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// accept scope Consent
WebAuth.prototype.acceptScopeConsent = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.scopes || !options.sub || !options.client_id) {
        throw new CustomException("scopes or sub or client_id cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/consent/scope/accept";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// scope consent continue login
WebAuth.prototype.scopeConsentContinue = function (options) {
  try {
    if (!options.track_id) {
      throw new CustomException("track_id cannot be empty", 417);
    }
    var form = document.createElement('form');
    form.action = window.webAuthSettings.authority + "/login-srv/precheck/continue/" + options.track_id;
    form.method = 'POST';
    document.body.appendChild(form);
    form.submit();
  } catch (ex) {
    throw new CustomException(ex, 417);
  }
};

// get Deduplication details
WebAuth.prototype.getDeduplicationDetails = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.trackId) {
        throw new CustomException("trackId cannot be empty", 417);
      }
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// deduplication login
WebAuth.prototype.deduplicationLogin = function (options) {
  try {
    if (!options.trackId || !options.requestId || !options.sub) {
      throw new CustomException("sub or requestId or trackId cannot be empty", 417);
    }
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
      if (!options.trackId) {
        throw new CustomException("trackId cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/deduplication/register/" + options.trackId;
      http.onreadystatechange = function () {
        if (http.readyState == 4) {
          resolve(JSON.parse(http.responseText));
        }
      };
      http.open("POST", _serviceURL, true);
      http.setRequestHeader("Content-type", "application/json");
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// consent continue login
WebAuth.prototype.consentContinue = function (options) {
  try {
    if (!options.client_id || !options.track_id || !options.sub || !options.version || !options.name) {
      throw new CustomException("client_id or track_id or sub or version or name cannot be empty", 417);
    }
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
    if (!options.trackingCode || !options.track_id || !options.sub || !options.requestId) {
      throw new CustomException("trackingCode or track_id or sub or requestId or name cannot be empty", 417);
    }
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
    if (!options.old_password || !options.loginSettingsId || !options.new_password || !options.confirm_password) {
      throw new CustomException("oldpassword or loginSettingsId or newpassword or confirmpassword cannot be empty", 417);
    }
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
WebAuth.prototype.changePassword = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.old_password || !options.new_password || !options.confirm_password || !options.identityId || !access_token) {
        throw new CustomException("old_password or identityId or new_password or confirm_password or access_token cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/changepassword";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// update profile
WebAuth.prototype.updateProfile = function (options, access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !sub || !options.provider || !options.identityId) {
        throw new CustomException("access_token or sub or identityId or provider cannot be empty", 417);
      }
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get user activities
WebAuth.prototype.getUserActivities = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.sub || !(options.skip).toString() || !(options.take).toString()) {
        throw new CustomException("access_token or sub or skip or take cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/useractivity-srv/latestactivity";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get unreviewed devices
WebAuth.prototype.getUnreviewedDevices = function (access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !sub) {
        throw new CustomException("access_token or sub cannot be empty", 417);
      }
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
      http.setRequestHeader("access_token", access_token);
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
      if (!access_token || !sub) {
        throw new CustomException("access_token or sub cannot be empty", 417);
      }
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
      http.setRequestHeader("access_token", access_token);
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
      if (!access_token || !sub) {
        throw new CustomException("access_token or sub cannot be empty", 417);
      }
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get accepted consent list
WebAuth.prototype.getAcceptedConsentList = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.sub) {
        throw new CustomException("access_token or sub cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/user/details/consent";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// view accepted consent 
WebAuth.prototype.viewAcceptedConsent = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.consentReceiptID || !options.sub) {
        throw new CustomException("access_token or consentReceiptID or sub cannot be empty", 417);
      }
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
      http.setRequestHeader("access_token", access_token);
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get configured verification list
WebAuth.prototype.getConfiguredVerificationList = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.email) {
        throw new CustomException("access_token or email cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/settings/list";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// initiate link accoount
WebAuth.prototype.initiateLinkAccount = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.master_sub || !options.user_name_to_link) {
        throw new CustomException("access_token or master_sub or user_name_to_link cannot be empty", 417);
      }
      options.user_name_type = 'email';
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/initiate";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// complete link accoount
WebAuth.prototype.completeLinkAccount = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.code || !options.link_request_id) {
        throw new CustomException("access_token or code or link_request_id cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/link/complete";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get linked users
WebAuth.prototype.getLinkedUsers = function (access_token, sub) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !sub) {
        throw new CustomException("access_token or sub cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/userinfo/social/" + sub;
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
      http.setRequestHeader("access_token", access_token);
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// unlink accoount
WebAuth.prototype.unlinkAccount = function (access_token, identityId) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !identityId) {
        throw new CustomException("access_token or identityId cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/users-srv/user/unlink/" + identityId;
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
      http.setRequestHeader("access_token", access_token);
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// get all verification list
WebAuth.prototype.getAllVerificationList = function (access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token) {
        throw new CustomException("access_token or email cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/config/list";
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
      http.setRequestHeader("access_token", access_token);
      http.send();
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};

// image upload
WebAuth.prototype.updateProfileImage = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.sub || !options.photo) {
        throw new CustomException("access_token or sub or photo cannot be empty", 417);
      }
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/image-srv/profile/upload";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      throw new CustomException(ex, 417);
    }
  });
};


// setup email
WebAuth.prototype.setupEmail = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "EMAIL";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup sms
WebAuth.prototype.setupSMS = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "SMS";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup ivr
WebAuth.prototype.setupIVR = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "IVR";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup backupcode
WebAuth.prototype.setupBackupcode = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "BACKUPCODE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup totp
WebAuth.prototype.setupTOTP = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOTP";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup pattern
WebAuth.prototype.setupPattern = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "PATTERN";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup touch
WebAuth.prototype.setupTouchId = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOUCHID";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup smart push
WebAuth.prototype.setupSmartPush = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "PUSH";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup face
WebAuth.prototype.setupFace = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "FACE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// setup voice
WebAuth.prototype.setupVoice = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.logoUrl || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or logoUrl or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "VOICE";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/setup";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// enroll Email
WebAuth.prototype.enrollEmail = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.statusId || !options.code || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("statusId or code or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "EMAIL";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// enroll SMS
WebAuth.prototype.enrollSMS = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.statusId || !options.code || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("statusId or code or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "SMS";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// enroll IVR
WebAuth.prototype.enrollIVR = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!options.statusId || !options.code || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("statusId or code or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "IVR";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// enroll TOTP
WebAuth.prototype.enrollTOTP = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
      if (!access_token || !options.statusId || !options.verifierPassword || !options.deviceInfo || !options.deviceInfo.deviceId) {
        throw new CustomException("access_token or statusId or verifierPassword or deviceInfo or deviceInfo.deviceId cannot be empty", 417);
      }
      options.verificationType = "TOTP";
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/" + options.verificationType.toString().toLowerCase() + "/enroll";
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
      http.setRequestHeader("access_token", access_token);
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

module.exports = WebAuth;
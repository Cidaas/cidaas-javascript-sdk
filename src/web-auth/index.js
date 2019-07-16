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
WebAuth.prototype.loginWithSocial = function (options, queryParams) {
  try {
    var http = new XMLHttpRequest();
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
    var http = new XMLHttpRequest();
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

      var empty = false;

      // validate fields
      // if (registrationFields && registrationFields.length > 0) {
      //   var requiredFields = registrationFields.filter(function (c) {
      //     return c.required == true;
      //   }).map((function (c) {
      //     return c.fieldKey;
      //   }));

      //   requiredFields.forEach(function (req) {
      //     if (!options[req]) {
      //       empty = true;
      //     }
      //   });
      // }

      // if (empty) {
      //   throw new CustomException("Please make sure you fill all the fields", 417);
      // }


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
      }
      if (headers.bot_captcha_response) {
        http.setRequestHeader("bot_captcha_response", headers.bot_captcha_response);
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

// get mfa list v2
WebAuth.prototype.getMFAListV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/verification-srv/v2/setup/public/configured/list";
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

// initiate mfa v2
WebAuth.prototype.initiateMFAV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/" + options.type;
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// initiate email
WebAuth.prototype.initiateEmail = function (options) {
  return new Promise(function (resolve, reject) {
    try {
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

// initiate email v2
WebAuth.prototype.initiateEmailV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/email";
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

// initiate sms v2
WebAuth.prototype.initiateSMSV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/sms";
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

// initiate ivr v2
WebAuth.prototype.initiateIVRV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/ivr";
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

// initiate backupcode v2
WebAuth.prototype.initiateBackupcodeV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/backupcode";
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

// initiate totp v2
WebAuth.prototype.initiateTOTPV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/totp";
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

// initiate pattern v2
WebAuth.prototype.initiatePatternV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/pattern";
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

// initiate touchid v2
WebAuth.prototype.initiateTouchIdV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/touchid";
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

// initiate smart push v2
WebAuth.prototype.initiateSmartPushV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/push";
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

// initiate face v2
WebAuth.prototype.initiateFaceV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/face";
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

// initiate voice v2
WebAuth.prototype.initiateVoiceV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/initiate/voice";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// authenticate mfa v2
WebAuth.prototype.authenticateMFAV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/" + options.type;
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
};

// cancel mfa v2
WebAuth.prototype.cancelMFAV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/setup/cancel/" + options.type;
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

// authenticate email v2
WebAuth.prototype.authenticateEmailV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/email";
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

// authenticate sms v2
WebAuth.prototype.authenticateSMSV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/sms";
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

// authenticate ivr v2
WebAuth.prototype.authenticateIVRV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/ivr";
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

// authenticate backupcode v2
WebAuth.prototype.authenticateBackupcodeV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/backupcode";
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

// authenticate totp v2
WebAuth.prototype.authenticateTOTPV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = URLHelper.getBaseURL() + "/verification-srv/v2/authenticate/authenticate/totp";
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
      http.send(JSON.stringify(options));
    } catch (ex) {
      reject(ex);
    }
  });
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
      http.send();
    } catch (ex) {
      reject(ex);
    }
  });
};

// get user consent details
WebAuth.prototype.getConsentDetailsV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/public/info";
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

// acceptConsent
WebAuth.prototype.acceptConsent = function (options) {
  return new Promise(function (resolve, reject) {
    try {
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

WebAuth.prototype.acceptConsentV2 = function (options) {
  return new Promise(function (resolve, reject) {
    try {
      var http = new XMLHttpRequest();
      var _serviceURL = window.webAuthSettings.authority + "/consent-management-srv/v2/consent/usage/accept";
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
WebAuth.prototype.changePassword = function (options, access_token) {
  return new Promise(function (resolve, reject) {
    try {
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
"use strict";
exports.__esModule = true;
exports.ValidateResetPasswordEntity = exports.UpdateReviewDeviceEntity = exports.GroupValidationEntity = exports.TokenIntrospectionEntity = exports.FindUserEntity = exports.PhysicalVerificationLoginRequest = exports.AccessTokenRequest = exports.AcceptResetPasswordEntity = void 0;
var AcceptResetPasswordEntity = /** @class */ (function () {
    function AcceptResetPasswordEntity() {
        this.resetRequestId = "";
        this.exchangeId = "";
        this.password = "";
        this.confirmPassword = "";
        this.provider = "";
        this.requestId = "";
    }
    return AcceptResetPasswordEntity;
}());
exports.AcceptResetPasswordEntity = AcceptResetPasswordEntity;
var AccessTokenRequest = /** @class */ (function () {
    function AccessTokenRequest() {
        this.user_agent = "";
        this.ip_address = "";
        this.accept_language = "";
        this.lat = "";
        this.lng = "";
        this.finger_print = "";
        this.referrer = "";
        this.pre_login_id = "";
        this.login_type = "";
        // device code flow
        this.device_code = "";
    }
    return AccessTokenRequest;
}());
exports.AccessTokenRequest = AccessTokenRequest;
var PhysicalVerificationLoginRequest = /** @class */ (function () {
    function PhysicalVerificationLoginRequest() {
    }
    return PhysicalVerificationLoginRequest;
}());
exports.PhysicalVerificationLoginRequest = PhysicalVerificationLoginRequest;
var FindUserEntity = /** @class */ (function () {
    function FindUserEntity() {
        this.sub = "";
        this.email = "";
        this.mobile = "";
        this.username = "";
        this.provider = "";
        this.providerUserId = "";
        this.sub_not = "";
    }
    return FindUserEntity;
}());
exports.FindUserEntity = FindUserEntity;
var TokenIntrospectionEntity = /** @class */ (function () {
    function TokenIntrospectionEntity() {
        this.token = "";
        this.strictGroupValidation = false;
        this.strictScopeValidation = false;
        this.strictRoleValidation = false;
        this.strictValidation = false;
    }
    return TokenIntrospectionEntity;
}());
exports.TokenIntrospectionEntity = TokenIntrospectionEntity;
var GroupValidationEntity = /** @class */ (function () {
    function GroupValidationEntity() {
        this.strictRoleValidation = false;
        this.strictValidation = false;
    }
    return GroupValidationEntity;
}());
exports.GroupValidationEntity = GroupValidationEntity;
var UpdateReviewDeviceEntity = /** @class */ (function () {
    function UpdateReviewDeviceEntity() {
        this.userId = "";
        this.device = "";
        this.browser = "";
        this.location = "";
    }
    return UpdateReviewDeviceEntity;
}());
exports.UpdateReviewDeviceEntity = UpdateReviewDeviceEntity;
var ValidateResetPasswordEntity = /** @class */ (function () {
    function ValidateResetPasswordEntity() {
        this.resetRequestId = "";
        this.code = "";
    }
    return ValidateResetPasswordEntity;
}());
exports.ValidateResetPasswordEntity = ValidateResetPasswordEntity;

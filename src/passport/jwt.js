"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateAccessToken = exports.generateTokens = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config/config");
var ACCESS_SECRET = config_1.config.JWT_SECRET || "default_access_secret";
var REFRESH_SECRET = config_1.config.JWT_SECRET || "default_refresh_secret";
var generateTokens = function (userId) {
    var accessTokenExpiresIn = config_1.config.ACCESS_TOKEN_EXPIRY || "15m"; // Default 15 minutes
    var refreshTokenExpiresIn = config_1.config.REFRESH_TOKEN_EXPIRY || "7d"; // Default 7 days
    var accessToken = jsonwebtoken_1.default.sign({ id: userId }, ACCESS_SECRET, {
        expiresIn: accessTokenExpiresIn,
    });
    var refreshToken = jsonwebtoken_1.default.sign({ id: userId }, REFRESH_SECRET, {
        expiresIn: refreshTokenExpiresIn,
    });
    return {
        accessToken: accessToken,
        accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
        refreshToken: refreshToken,
        refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
};
exports.generateTokens = generateTokens;
var generateAccessToken = function (userId) {
    return {
        accessToken: jsonwebtoken_1.default.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" }),
        accessExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
};
exports.generateAccessToken = generateAccessToken;
var generateRefreshToken = function (userId) {
    return {
        refreshToken: jsonwebtoken_1.default.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" }),
        refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
};
exports.generateRefreshToken = generateRefreshToken;
var verifyRefreshToken = function (token) {
    try {
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
    }
    catch (_a) {
        return null; // Safer error handling
    }
};
exports.verifyRefreshToken = verifyRefreshToken;

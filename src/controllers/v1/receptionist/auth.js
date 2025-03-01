"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = void 0;
exports.loginController = loginController;
exports.refreshTokenController = refreshTokenController;
exports.getAdminProfile = getAdminProfile;
exports.updateAdminProfile = updateAdminProfile;
var bcryptjs_1 = require("bcryptjs");
var winston_1 = require("winston");
var jwt_1 = require("../../../passport/jwt");
var config_1 = require("../../../config/config");
var users_1 = require("../../../models/users");
var refreshTokens_1 = require("../../../models/refreshTokens");
var accessTokens_1 = require("../../../models/accessTokens");
var models_1 = require("../../../models/models");
var ACCESS_TOKEN_EXPIRY = config_1.config.ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY = config_1.config.REFRESH_TOKEN_EXPIRY;
var logger = winston_1.default.createLogger({
    level: "error",
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
exports.default = logger;
// Login Controller
function loginController(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, user, isPasswordValid, _b, accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, users_1.default.findOne({ email: email })];
                case 2:
                    user = _c.sent();
                    if (!user) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "User not found or verified",
                            log: "User not found",
                            toastMessage: "Invalid email or password",
                        };
                        next();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                case 3:
                    isPasswordValid = _c.sent();
                    if (!isPasswordValid) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Failed to login",
                            toastMessage: "Invalid email or password",
                        };
                        next();
                        return [2 /*return*/];
                    }
                    _b = (0, jwt_1.generateTokens)(user.id), accessToken = _b.accessToken, accessTokenExpiresAt = _b.accessTokenExpiresAt, refreshToken = _b.refreshToken, refreshTokenExpiresAt = _b.refreshTokenExpiresAt;
                    // Save tokens in the database
                    return [4 /*yield*/, accessTokens_1.AccessToken.create({
                            token: accessToken,
                            userId: user.id,
                            accessExpiresAt: accessTokenExpiresAt,
                        })];
                case 4:
                    // Save tokens in the database
                    _c.sent();
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.create({
                            token: refreshToken,
                            userId: user.id,
                            refreshExpiresAt: refreshTokenExpiresAt,
                        })];
                case 5:
                    _c.sent();
                    // Success response
                    req.apiStatus = {
                        isSuccess: true,
                        data: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            updatedAt: user.updatedAt,
                            access_token: accessToken,
                            accessExpiresAt: ACCESS_TOKEN_EXPIRY,
                            refresh_token: refreshToken,
                            refreshExpiresAt: REFRESH_TOKEN_EXPIRY,
                        },
                        toastMessage: "Login successful",
                    };
                    next();
                    return [2 /*return*/];
                case 6:
                    error_1 = _c.sent();
                    logger.error("Login error:", error_1);
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: error_1 instanceof Error ? error_1.message : JSON.stringify(error_1),
                        toastMessage: "Internal server error",
                    };
                    next();
                    return [2 /*return*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Refresh Token Controller
function refreshTokenController(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, decoded, tokenFromDb, user, _a, accessToken, accessExpiresAt, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    refreshToken = req.body.refresh_token;
                    if (!refreshToken) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1001],
                            data: "Refresh token is required",
                            toastMessage: "Session expired. Please log in again.",
                        };
                        return [2 /*return*/, next()];
                    }
                    decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
                    if (!decoded) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Invalid or expired refresh token",
                            toastMessage: "Please log in again.",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.findOne({ token: refreshToken })];
                case 1:
                    tokenFromDb = _b.sent();
                    if (!tokenFromDb) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Refresh token not found",
                            toastMessage: "Refresh token not found. Please log in again.",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, users_1.default.findById(decoded.id)
                            .select("-password")
                            .lean()];
                case 2:
                    user = _b.sent();
                    if (!!user) return [3 /*break*/, 4];
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.deleteOne({ token: refreshToken })];
                case 3:
                    _b.sent();
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1012],
                        data: "User not found",
                        toastMessage: "User no longer exists.",
                    };
                    return [2 /*return*/, next()];
                case 4:
                    _a = (0, jwt_1.generateAccessToken)(String(user._id)), accessToken = _a.accessToken, accessExpiresAt = _a.accessExpiresAt;
                    req.apiStatus = {
                        isSuccess: true,
                        data: {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            access_token: accessToken,
                            tokenExpiresAt: accessExpiresAt, // You can change this if you want refresh expiry here
                        },
                    };
                    next();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    logger.error("Refresh token error:", error_2);
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "Failed to refresh token",
                        toastMessage: "An error occurred while refreshing the token. Please try again later.",
                    };
                    next();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Logout Controller
//const ACCESS_SECRET = config.JWT_SECRET || "default_access_secret";
var logoutController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, refreshToken, decodedRefresh, deletedAccess, deletedRefresh, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                refreshToken = req.body.refresh_token;
                if (!accessToken || !refreshToken) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1001],
                        data: "Access token and Refresh token are required",
                        toastMessage: "Session expired. Please log in again.",
                    };
                    return [2 /*return*/, next()];
                }
                decodedRefresh = (0, jwt_1.verifyRefreshToken)(refreshToken);
                if (!decodedRefresh) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1004],
                        data: "Invalid or expired refresh token",
                        toastMessage: "Invalid refresh token provided.",
                    };
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, accessTokens_1.AccessToken.deleteOne({ token: accessToken })];
            case 1:
                deletedAccess = _b.sent();
                return [4 /*yield*/, refreshTokens_1.RefreshToken.deleteOne({
                        token: refreshToken,
                    })];
            case 2:
                deletedRefresh = _b.sent();
                if (!deletedAccess.deletedCount && !deletedRefresh.deletedCount) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        data: "Tokens not found or already deleted",
                        toastMessage: "Tokens not found. Already logged out?",
                    };
                    return [2 /*return*/, next()];
                }
                // Successfully logged out
                req.apiStatus = {
                    isSuccess: true,
                    data: "User logged out successfully",
                    toastMessage: "Logged out successfully",
                };
                return [2 /*return*/, next()];
            case 3:
                error_3 = _b.sent();
                logger.error("Logout error: ".concat(error_3 instanceof Error ? error_3.message : "Unknown error"));
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1010],
                    data: "Failed to logout",
                    toastMessage: "An error occurred while logging out. Please try again later.",
                };
                return [2 /*return*/, next()];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.logoutController = logoutController;
// Admin Profile Controller
function getAdminProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, projection, adminProfile, refreshTokenData, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log(req.user);
                    user = req.user;
                    if (!user || !user.id) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Unauthorized",
                            toastMessage: "Session expired. Please log in again.",
                        };
                        return [2 /*return*/, next()];
                    }
                    projection = {
                        _id: 1,
                        name: 1,
                        email: 1,
                        role: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    };
                    return [4 /*yield*/, users_1.default.findById(user.id, projection).lean()];
                case 1:
                    adminProfile = _a.sent();
                    if (!adminProfile) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Admin profile not found",
                            toastMessage: "Admin profile does not exist.",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.findOne({ userId: user.id })
                            .select("token refreshExpiresAt")
                            .lean()];
                case 2:
                    refreshTokenData = _a.sent();
                    if (!refreshTokenData) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Refresh token not found",
                            log: "No refresh token found in DB",
                        };
                        return [2 /*return*/, next()];
                    }
                    req.apiStatus = {
                        isSuccess: true,
                        data: __assign(__assign({}, adminProfile), { refresh_token: refreshTokenData.token, refreshExpiresAt: REFRESH_TOKEN_EXPIRY }),
                        toastMessage: "Admin profile fetched successfully",
                    };
                    return [2 /*return*/, next()];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error fetching admin profile: ".concat(error_4 instanceof Error ? error_4.message : JSON.stringify(error_4)));
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "Internal server error",
                        toastMessage: "An error occurred while fetching the profile.",
                    };
                    return [2 /*return*/, next()];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateAdminProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, allowedFields_1, updateData_1, updatedAdmin, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    user = req.user;
                    if (!user || !user.id) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Unauthorized",
                            toastMessage: "Session expired. Please log in again.",
                        };
                        return [2 /*return*/, next()];
                    }
                    allowedFields_1 = ["name", "email", "role", "isDeleted"];
                    updateData_1 = {};
                    Object.keys(req.body).forEach(function (key) {
                        if (allowedFields_1.includes(key)) {
                            updateData_1[key] = req.body[key];
                        }
                    });
                    if (Object.keys(updateData_1).length === 0) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "No valid fields to update",
                            toastMessage: "Please provide valid fields to update.",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, users_1.default.findByIdAndUpdate(user.id, updateData_1, {
                            new: true,
                            select: "-password",
                        })];
                case 1:
                    updatedAdmin = _a.sent();
                    if (!updatedAdmin) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Admin profile not updated",
                            toastMessage: "Update failed",
                        };
                        return [2 /*return*/, next()];
                    }
                    req.apiStatus = {
                        isSuccess: true,
                        data: "Updated successfully",
                        toastMessage: "Updated successfully",
                    };
                    return [2 /*return*/, next()];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error updating admin profile: ".concat(error_5 instanceof Error ? error_5.message : JSON.stringify(error_5)));
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "Internal server error",
                        toastMessage: "An error occurred while updating the profile.",
                    };
                    return [2 /*return*/, next()];
                case 3: return [2 /*return*/];
            }
        });
    });
}

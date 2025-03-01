"use strict";
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
exports.getNurseProfile = getNurseProfile;
exports.updateNurseProfile = updateNurseProfile;
var bcryptjs_1 = require("bcryptjs");
var winston_1 = require("winston");
var jwt_1 = require("../../../passport/jwt");
var config_1 = require("../../../config/config");
var users_1 = require("../../../models/users");
var refreshTokens_1 = require("../../../models/refreshTokens");
var accessTokens_1 = require("../../../models/accessTokens");
var models_1 = require("../../../models/models");
var lodash_1 = require("lodash");
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
                    if (!user || (user === null || user === void 0 ? void 0 : user.isDeleted)) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "User not found or verified",
                            log: "User not found",
                            toastMessage: "Invalid email or password",
                        };
                        return [2 /*return*/, next()];
                    }
                    // Prevent login if the account is deleted or disabled
                    if (user === null || user === void 0 ? void 0 : user.isDeleted) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Your account has been deleted",
                            toastMessage: "You cannot log in with a deleted account.",
                        };
                        return [2 /*return*/, next()];
                    }
                    if ((user === null || user === void 0 ? void 0 : user.isEnabled) === false) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Your account is disabled",
                            toastMessage: "Your account is disabled. Please contact support.",
                        };
                        return [2 /*return*/, next()];
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
                        return [2 /*return*/, next()];
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
                    return [2 /*return*/, next()];
                case 6:
                    error_1 = _c.sent();
                    logger.error("Login error:", error_1);
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: error_1 instanceof Error ? error_1.message : JSON.stringify(error_1),
                        toastMessage: "Internal server error",
                    };
                    return [2 /*return*/, next()];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Refresh Token Controller
function refreshTokenController(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshToken, decoded, tokenFromDb, user, _a, accessToken, accessExpiresAt, _b, newRefreshToken, refreshExpiresAt, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 6, , 7]);
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
                    tokenFromDb = _c.sent();
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
                    user = _c.sent();
                    if (!!user) return [3 /*break*/, 4];
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.deleteOne({ token: refreshToken })];
                case 3:
                    _c.sent();
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1012],
                        data: "User not found",
                        toastMessage: "User no longer exists.",
                    };
                    return [2 /*return*/, next()];
                case 4:
                    _a = (0, jwt_1.generateAccessToken)(String(user._id)), accessToken = _a.accessToken, accessExpiresAt = _a.accessExpiresAt;
                    _b = (0, jwt_1.generateRefreshToken)(String(user._id)), newRefreshToken = _b.refreshToken, refreshExpiresAt = _b.refreshExpiresAt;
                    // Update refresh token in DB
                    return [4 /*yield*/, refreshTokens_1.RefreshToken.findOneAndUpdate({ userId: user._id }, { token: newRefreshToken, refreshExpiresAt: refreshExpiresAt }, { upsert: true })];
                case 5:
                    // Update refresh token in DB
                    _c.sent();
                    // Send response with all required fields
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
                            refresh_token: newRefreshToken,
                            tokenExpiresAt: accessExpiresAt, // You can change this if you want refresh expiry here
                        },
                    };
                    next();
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _c.sent();
                    logger.error("Refresh token error:", error_2);
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "Failed to refresh token",
                        toastMessage: "An error occurred while refreshing the token. Please try again later.",
                    };
                    next();
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
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
// Nurse Profile Controller
function getNurseProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var projection, user, doesExist, nurseProfile, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    projection = req.body.project || {};
                    // Remove `isDeleted` and `password`
                    projection = lodash_1.default.omit(projection, ["isDeleted", "password"]);
                    user = req.user;
                    if (!user || !user.id) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Unauthorized",
                            toastMessage: "Unauthorized",
                        };
                        return [2 /*return*/, next()];
                    }
                    console.log("Fetching user with ID:", user.id);
                    return [4 /*yield*/, ((_a = users_1.default.findById(user.id)) === null || _a === void 0 ? void 0 : _a.select("_id isDeleted isEnabled").lean())];
                case 1:
                    doesExist = _b.sent();
                    if (!doesExist) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Nurse profile not found",
                            toastMessage: "Nurse profile not found.",
                        };
                        return [2 /*return*/, next()];
                    }
                    if (doesExist.isDeleted === true) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "User is Deleted",
                            toastMessage: "User is Deleted",
                        };
                        return [2 /*return*/, next()];
                    }
                    if (doesExist.isEnabled === false) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "User is Disabled",
                            toastMessage: "User is Disabled",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, users_1.default.findById(user.id, projection).lean()];
                case 2:
                    nurseProfile = _b.sent();
                    if (!nurseProfile) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Profile not found",
                            toastMessage: "Profile not found.",
                        };
                        return [2 /*return*/, next()];
                    }
                    console.log("Nurse Profile Fetched:", nurseProfile);
                    req.apiStatus = {
                        isSuccess: true,
                        data: nurseProfile, // Already excludes `isDeleted`
                        toastMessage: "Nurse profile fetched successfully",
                    };
                    return [2 /*return*/, next()];
                case 3:
                    error_4 = _b.sent();
                    console.error("Error fetching nurse profile: ".concat(error_4 instanceof Error ? error_4.message : JSON.stringify(error_4)));
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "An error occurred while fetching the profile",
                        toastMessage: "An error occurred while fetching the profile",
                    };
                    return [2 /*return*/, next()];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateNurseProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, currentUser, allowedFields, updateData_1, updatedNurse, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    user = req.user;
                    if (!user || !user.id) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1012],
                            data: "Unauthorized",
                            toastMessage: "Unauthorized access",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, users_1.default.findById(user.id)
                            .select("isDeleted isEnabled")
                            .lean()];
                case 1:
                    currentUser = _a.sent();
                    if (!currentUser) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Nurse profile not found",
                            toastMessage: "Profile not found",
                        };
                        return [2 /*return*/, next()];
                    }
                    // Prevent updates if the account is deleted or disabled
                    if (currentUser.isDeleted === true) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Your account has been deleted",
                            toastMessage: "You cannot update a deleted account.",
                        };
                        return [2 /*return*/, next()];
                    }
                    if (currentUser.isEnabled === false) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "Your account is disabled",
                            toastMessage: "You cannot update a disabled account.",
                        };
                        return [2 /*return*/, next()];
                    }
                    allowedFields = ["name", "email", "role"];
                    updateData_1 = {};
                    // Remove undefined fields
                    Object.keys(updateData_1).forEach(function (key) {
                        if (updateData_1[key] === undefined) {
                            delete updateData_1[key];
                        }
                    });
                    if (Object.keys(updateData_1).length === 0) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1003],
                            data: "No valid fields provided for update",
                            toastMessage: "Please provide valid fields to update",
                        };
                        return [2 /*return*/, next()];
                    }
                    return [4 /*yield*/, users_1.default.findByIdAndUpdate(user.id, updateData_1, {
                            new: true,
                            select: "-password",
                        })];
                case 2:
                    updatedNurse = _a.sent();
                    if (!updatedNurse) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1004],
                            data: "Nurse profile does not exist",
                            toastMessage: "Profile does not exist or has been deleted",
                        };
                        return [2 /*return*/, next()];
                    }
                    req.apiStatus = {
                        isSuccess: true,
                        data: updatedNurse,
                        toastMessage: "Updated successfully",
                    };
                    return [2 /*return*/, next()];
                case 3:
                    error_5 = _a.sent();
                    console.error("Error updating nurse profile: ".concat(error_5 instanceof Error ? error_5.message : JSON.stringify(error_5)));
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1010],
                        data: "Internal server error",
                        toastMessage: "An error occurred while updating the profile.",
                    };
                    return [2 /*return*/, next()];
                case 4: return [2 /*return*/];
            }
        });
    });
}

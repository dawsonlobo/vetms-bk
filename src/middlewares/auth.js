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
exports.authenticateNurse = exports.verifyNurse = exports.authenticateAdmin = void 0;
exports.verifyAdmin = verifyAdmin;
exports.verifyReceptionist = verifyReceptionist;
exports.authenticateDoctor = authenticateDoctor;
exports.verifyDoctor = verifyDoctor;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../config/config"); // Correct import for config
var users_1 = require("../models/users");
var constant_1 = require("../config/constant");
var accessTokens_1 = require("../models/accessTokens"); // Import UserRole if it's an enum or type
var models_1 = require("../models/models");
// Middleware to verify Admin user
function verifyAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            user = req.user;
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: "Unauthorized",
                    data: "User authentication failed.",
                    toastMessage: "Please log in to continue.",
                });
                return [2 /*return*/];
            }
            if (user.role !== constant_1.CONSTANTS.USER_ROLE.ADMIN) {
                res.status(403).json({
                    status: 403,
                    message: "Forbidden",
                    data: "Admin access required.",
                    toastMessage: "You do not have permission to access this resource.",
                });
                return [2 /*return*/];
            }
            next();
            return [2 /*return*/];
        });
    });
}
//Specifically ensures that the token exists in the database and is valid for an admin user
var authenticateAdmin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, storedAccessToken, decoded, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!accessToken) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                        data: "Unauthorized",
                        toastMessage: "Please log in again.",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, accessTokens_1.AccessToken.findOne({ token: accessToken })];
            case 1:
                storedAccessToken = _b.sent();
                if (!storedAccessToken) {
                    res.status(403).json({
                        status: 403,
                        message: "Invalid or expired access token",
                        data: "Invalid or expired access token",
                        toastMessage: "Please log in again.",
                    });
                    return [2 /*return*/];
                }
                decoded = void 0;
                try {
                    decoded = jsonwebtoken_1.default.verify(accessToken, config_1.config.JWT_SECRET);
                }
                catch (error) {
                    console.error("Authentication error:", error);
                    res.status(403).json({
                        status: 403,
                        error: models_1.ErrorCodes[1002],
                        message: "Invalid token",
                        data: "Invalid token",
                        toastMessage: "Session expired. Please log in again.",
                    });
                    return [2 /*return*/];
                }
                // Attach the decoded user ID to the request for further use
                req.user = { id: decoded.id };
                next(); // Proceed to the next middleware or controller
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error("Error in authentication middleware:", error_1);
                res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                    data: "Internal server error",
                    toastMessage: "An error occurred while verifying authentication.",
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.authenticateAdmin = authenticateAdmin;
// Middleware to verify Nurse user
var verifyNurse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, token, decoded, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = req.headers.authorization;
                if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                        data: "Unauthorized",
                        toastMessage: "Authentication required.",
                    });
                    return [2 /*return*/];
                }
                token = authHeader.split(" ")[1];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
                return [4 /*yield*/, users_1.default.findById(decoded.id)];
            case 2:
                user = _a.sent();
                if (!user || user.role !== constant_1.CONSTANTS.USER_ROLE.NURSE) {
                    res.status(403).json({
                        status: 403,
                        message: "Forbidden",
                        data: "Forbidden",
                        toastMessage: "Nurse access required.",
                    });
                    return [2 /*return*/];
                }
                req.user = user;
                next();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                if (error_2 instanceof jsonwebtoken_1.TokenExpiredError) {
                    res.status(401).json({
                        status: 401,
                        message: "Token expired",
                        data: "Token expired",
                        toastMessage: "Session expired. Please log in again.",
                    });
                    return [2 /*return*/];
                }
                if (error_2 instanceof jsonwebtoken_1.JsonWebTokenError) {
                    res.status(403).json({
                        status: 403,
                        message: "Invalid token",
                        data: "Invalid token",
                        toastMessage: "Session expired. Please log in again.",
                    });
                    return [2 /*return*/];
                }
                res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                    data: "Internal server error",
                });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyNurse = verifyNurse;
// Middleware to ensure the token exists in the database and is valid for a nurse
var authenticateNurse = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, storedAccessToken, decoded, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!accessToken) {
                    res.status(401).json({
                        status: 401,
                        message: "Unauthorized",
                        data: "Unauthorized",
                        toastMessage: "Please log in again.",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, accessTokens_1.AccessToken.findOne({ token: accessToken })];
            case 1:
                storedAccessToken = _b.sent();
                if (!storedAccessToken) {
                    res.status(403).json({
                        status: 403,
                        message: "Invalid or expired access token",
                        data: "Invalid or expired access token",
                        toastMessage: "Please log in again.",
                    });
                    return [2 /*return*/];
                }
                decoded = void 0;
                try {
                    decoded = jsonwebtoken_1.default.verify(accessToken, config_1.config.JWT_SECRET);
                }
                catch (error) {
                    console.error("Authentication error:", error);
                    res.status(403).json({
                        status: 403,
                        error: models_1.ErrorCodes[1002],
                        message: "Invalid token",
                        data: "Invalid token",
                        toastMessage: "Session expired. Please log in again.",
                    });
                    return [2 /*return*/];
                }
                // Attach the decoded user ID to the request for further use
                req.user = { id: decoded.id };
                next(); // Proceed to the next middleware or controller
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Error in authentication middleware:", error_3);
                res.status(500).json({
                    status: 500,
                    error: models_1.ErrorCodes[1002],
                    message: "Internal server error",
                    data: "Internal server error",
                    toastMessage: "An error occurred while verifying authentication.",
                });
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.authenticateNurse = authenticateNurse;
function verifyReceptionist(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            if (!req.user) {
                res.status(401).json({
                    status: 401,
                    message: "Unauthorized",
                    data: "User authentication failed.",
                    toastMessage: "Please log in to continue.",
                });
                return [2 /*return*/];
            }
            user = req.user;
            if (user.role !== constant_1.CONSTANTS.USER_ROLE.RECEPTIONIST) {
                res.status(403).json({
                    status: 403,
                    message: "Forbidden",
                    data: "Receptionist access required.",
                    toastMessage: "You do not have permission to access this resource.",
                });
                return [2 /*return*/];
            }
            next();
            return [2 /*return*/];
        });
    });
}
function authenticateDoctor(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken, storedAccessToken, decoded, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                    if (!accessToken) {
                        res.status(401).json({
                            status: 401,
                            message: "Unauthorized",
                            data: "Unauthorized",
                            toastMessage: "Please log in again.",
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, accessTokens_1.AccessToken.findOne({ token: accessToken })];
                case 1:
                    storedAccessToken = _b.sent();
                    if (!storedAccessToken) {
                        res.status(403).json({
                            status: 403,
                            message: "Invalid or expired access token",
                            data: "Invalid or expired access token",
                            toastMessage: "Please log in again.",
                        });
                        return [2 /*return*/];
                    }
                    decoded = void 0;
                    try {
                        decoded = jsonwebtoken_1.default.verify(accessToken, config_1.config.JWT_SECRET);
                    }
                    catch (error) {
                        console.log("the errors in verify errors are", error);
                        res.status(403).json({
                            status: 403,
                            message: "Invalid token",
                            data: "Invalid token",
                            toastMessage: "Session expired. Please log in again.",
                        });
                        return [2 /*return*/];
                    }
                    // Attach the decoded user ID to the request for further use
                    req.user = { id: decoded.id };
                    next(); // Proceed to the next middleware or controller
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    console.error("Error in authentication middleware:", error_4);
                    res.status(500).json({
                        status: 500,
                        message: "Internal server error",
                        data: "Internal server error",
                        toastMessage: "An error occurred while verifying authentication.",
                    });
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function verifyDoctor(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, existingUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.user) {
                        res.status(401).json({
                            status: 401,
                            message: "Unauthorized",
                            data: "User authentication failed.",
                            toastMessage: "Please log in to continue.",
                        });
                        return [2 /*return*/];
                    }
                    user = req.user;
                    return [4 /*yield*/, users_1.default.findById(user.id)];
                case 1:
                    existingUser = _a.sent();
                    if (!existingUser) {
                        res.status(404).json({
                            status: 404,
                            message: "User not found",
                            data: "The user does not exist in the database.",
                            toastMessage: "User not found in the system.",
                        });
                        return [2 /*return*/];
                    }
                    // Check if the user's role is DOCTOR
                    if (existingUser.role !== constant_1.CONSTANTS.USER_ROLE.DOCTOR) {
                        res.status(403).json({
                            status: 403,
                            message: "Forbidden",
                            data: "DOCTOR access required.",
                            toastMessage: "You do not have permission to access this resource.",
                        });
                        return [2 /*return*/];
                    }
                    next(); // Proceed to the next middleware or route handler
                    return [2 /*return*/];
            }
        });
    });
}

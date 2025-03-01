"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype,
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = loginController;
exports.refreshTokenController = refreshTokenController;
exports.logoutController = logoutController;
exports.getDoctorProfile = getDoctorProfile;
exports.updateDoctorProfile = updateDoctorProfile;
var users_1 = require("../../../models/users");
var refreshTokens_1 = require("../../../models/refreshTokens");
var accessTokens_1 = require("../../../models/accessTokens");
var bcryptjs_1 = require("bcryptjs");
var jwt_1 = require("../../../passport/jwt");
var models_1 = require("../../../models/models");
// Login Controller
function loginController(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      email,
      password,
      user,
      isPasswordValid,
      _b,
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      error_1;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          (_a = req.body), (email = _a.email), (password = _a.password);
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
              toastMessage: "User not found or verified",
            };
            next();
            return [2 /*return*/];
          }
          if (user.isDeleted === true) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              data: "User is Deleted",
              toastMessage: "User is Deleted",
            };
            next();
            return [2 /*return*/];
          }
          if (user.isEnabled === false) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              data: "User is Disabled",
              toastMessage: "User is Disabled",
            };
            next();
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            bcryptjs_1.default.compare(password, user.password),
          ];
        case 3:
          isPasswordValid = _c.sent();
          if (!isPasswordValid) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Invalid email or password",
              toastMessage: "Invalid email or password",
            };
            next();
            return [2 /*return*/];
          }
          (_b = (0, jwt_1.generateTokens)(user.id)),
            (accessToken = _b.accessToken),
            (accessTokenExpiresAt = _b.accessTokenExpiresAt),
            (refreshToken = _b.refreshToken),
            (refreshTokenExpiresAt = _b.refreshTokenExpiresAt);
          // Save tokens in the database
          return [
            4 /*yield*/,
            accessTokens_1.AccessToken.create({
              token: accessToken,
              userId: user.id,
              accessExpiresAt: accessTokenExpiresAt,
            }),
          ];
        case 4:
          // Save tokens in the database
          _c.sent();
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.create({
              token: refreshToken,
              userId: user.id,
              refreshExpiresAt: refreshTokenExpiresAt,
            }),
          ];
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
              accessExpiresAt: accessTokenExpiresAt,
              refresh_token: refreshToken,
              refreshExpiresAt: refreshTokenExpiresAt,
            },
            toastMessage: "Login successful",
          };
          next();
          return [2 /*return*/];
        case 6:
          error_1 = _c.sent();
          console.error("Login error:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            data:
              error_1 instanceof Error
                ? error_1.message
                : JSON.stringify(error_1),
            toastMessage: "Internal server error",
          };
          next();
          return [2 /*return*/];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
// Refresh Token Controller
function refreshTokenController(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var refreshToken,
      decoded,
      tokenFromDb,
      user,
      _a,
      accessToken,
      accessExpiresAt,
      _b,
      newRefreshToken,
      refreshExpiresAt,
      error_2;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 6, , 7]);
          refreshToken = req.body.refresh_token;
          console.log(refreshToken);
          if (!refreshToken) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              data: "Refresh token is required",
              toastMessage: "Refresh token is required",
            };
            return [2 /*return*/, next()];
          }
          decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
          if (!decoded) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Invalid or expired refresh token",
              toastMessage: "Invalid or expired refresh token log in again.",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.findOne({ token: refreshToken }),
          ];
        case 1:
          tokenFromDb = _c.sent();
          if (!tokenFromDb) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Refresh token not found",
              toastMessage: "Refresh token not found",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            users_1.default.findById(decoded.id).select("-password").lean(),
          ];
        case 2:
          user = _c.sent();
          if (!!user) return [3 /*break*/, 4];
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.deleteOne({ token: refreshToken }),
          ];
        case 3:
          _c.sent();
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1012],
            data: "User not found",
            toastMessage: "User not found",
          };
          return [2 /*return*/, next()];
        case 4:
          (_a = (0, jwt_1.generateAccessToken)(String(user._id))),
            (accessToken = _a.accessToken),
            (accessExpiresAt = _a.accessExpiresAt);
          (_b = (0, jwt_1.generateRefreshToken)(String(user._id))),
            (newRefreshToken = _b.refreshToken),
            (refreshExpiresAt = _b.refreshExpiresAt);
          // Update refresh token in DB
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.findOneAndUpdate(
              { userId: user._id },
              { token: newRefreshToken, refreshExpiresAt: refreshExpiresAt },
              { upsert: true },
            ),
          ];
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
          console.error("Refresh token error:", error_2);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            data: "An error occurred while refreshing the token. Please try again later",
            toastMessage:
              "An error occurred while refreshing the token. Please try again later",
          };
          next();
          return [3 /*break*/, 7];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
// Logout Controller
function logoutController(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var accessToken,
      refreshToken,
      decodedRefresh,
      deletedAccess,
      deletedRefresh,
      error_3;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          accessToken =
            (_a = req.headers.authorization) === null || _a === void 0
              ? void 0
              : _a.split(" ")[1];
          refreshToken = req.body.refresh_token;
          if (!accessToken || !refreshToken) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              data: "Access token and Refresh token are required",
              toastMessage: "Access token and Refresh token are required",
            };
            next();
            return [2 /*return*/];
          }
          decodedRefresh = (0, jwt_1.verifyRefreshToken)(refreshToken);
          if (!decodedRefresh) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1004],
              data: "Invalid or expired refresh token",
              toastMessage: "Invalid or expired refresh token",
            };
            next();
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            accessTokens_1.AccessToken.deleteOne({ token: accessToken }),
          ];
        case 1:
          deletedAccess = _b.sent();
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.deleteOne({
              token: refreshToken,
            }),
          ];
        case 2:
          deletedRefresh = _b.sent();
          if (!deletedAccess.deletedCount && !deletedRefresh.deletedCount) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              data: "Tokens not found or already deleted",
              toastMessage: "Tokens not found or already deleted",
            };
            next();
            return [2 /*return*/];
          }
          // Successfully logged out
          req.apiStatus = {
            isSuccess: true,
            data: "User logged out successfully",
            toastMessage: "Logged out successfully",
          };
          next();
          return [2 /*return*/];
        case 3:
          error_3 = _b.sent();
          console.error(
            "Logout error: ".concat(
              error_3 instanceof Error ? error_3.message : "Unknown error",
            ),
          );
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            data: "An error occurred while logging out. Please try again later",
            toastMessage:
              "An error occurred while logging out. Please try again later",
          };
          next();
          return [2 /*return*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function getDoctorProfile(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var projection, user, doesExist, adminProfile, refreshTokenData, error_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 4, , 5]);
          console.log(req.user);
          projection = req.body.project;
          // Ensure isDeleted and password are excluded from the projection
          if (projection) {
            // Remove isDeleted and password if they exist in projection
            delete projection.isDeleted;
            delete projection.password;
          } else {
            // If no projection is provided, set a default projection and exclude sensitive fields
            projection = {
              _id: 1,
              name: 1,
              email: 1,
              role: 1,
              createdAt: 1,
              updatedAt: 1,
            };
          }
          user = req.user;
          if (!user || !user.id) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Unauthorized",
              toastMessage: "Unauthorized",
            };
            next();
            return [2 /*return*/];
          }
          return [4 /*yield*/, users_1.default.findById(user.id)];
        case 1:
          doesExist = _a.sent();
          console.log(doesExist);
          if (!doesExist) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Admin profile not found",
              toastMessage: "Admin profile not found.",
            };
            next();
            return [2 /*return*/];
          }
          if (doesExist.isDeleted === true) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              data: "User is Deleted",
              toastMessage: "User is Deleted",
            };
            next();
            return [2 /*return*/];
          }
          if (doesExist.isEnabled === false) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              data: "User is Disabled",
              toastMessage: "User is Disabled",
            };
            next();
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            users_1.default.findById(user.id, projection).lean(),
          ];
        case 2:
          adminProfile = _a.sent();
          return [
            4 /*yield*/,
            refreshTokens_1.RefreshToken.findOne({ userId: user.id })
              .select("token refreshExpiresAt")
              .lean(),
          ];
        case 3:
          refreshTokenData = _a.sent();
          if (!refreshTokenData) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Refresh token not found",
              log: "Refresh token not found",
            };
            next();
            return [2 /*return*/];
          }
          req.apiStatus = {
            isSuccess: true,
            data: __assign({}, adminProfile),
            toastMessage: "Doctor profile fetched successfully",
          };
          next();
          return [2 /*return*/];
        case 4:
          error_4 = _a.sent();
          console.error(
            "Error fetching admin profile: ".concat(
              error_4 instanceof Error
                ? error_4.message
                : JSON.stringify(error_4),
            ),
          );
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            data: "An error occurred while fetching the profile",
            toastMessage: "An error occurred while fetching the profile",
          };
          return [2 /*return*/, next()];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function updateDoctorProfile(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var user,
      _a,
      name_1,
      email,
      role,
      isDelete,
      updateFields_1,
      updatedDoctor,
      error_5;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          _c.trys.push([0, 2, , 3]);
          user = req.user;
          console.log("first log", user);
          console.log("second log", user.id);
          if (!user || !user.id) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "Unauthorized",
              toastMessage: "Unauthorized",
            };
            next();
            return [2 /*return*/];
          }
          (_a = req.body),
            (name_1 = _a.name),
            (email = _a.email),
            (role = _a.role),
            (isDelete = _a.isDelete);
          if (role) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "you do not have permission to change roles",
              toastMessage: "you do not have permission to change roles",
            };
            next();
            return [2 /*return*/];
          }
          if (isDelete) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1012],
              data: "you do not have permission to delete user",
              toastMessage: "you do not have permission to delete user",
            };
            next();
            return [2 /*return*/];
          }
          updateFields_1 = { name: name_1, email: email };
          // Remove undefined fields to avoid unnecessary updates
          Object.keys(updateFields_1).forEach(function (key) {
            if (updateFields_1[key] === undefined) {
              delete updateFields_1[key];
            }
          });
          if (Object.keys(updateFields_1).length === 0) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              data: "Please provide valid fields to update",
              toastMessage: "Please provide valid fields to update",
            };
            next();
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            users_1.default.findByIdAndUpdate(user.id, updateFields_1, {
              new: true,
              select: "-password -isDelete",
            }),
          ];
        case 1:
          updatedDoctor = _c.sent();
          if (
            !updatedDoctor
            // || updatedDoctor.isDeleted===true
          ) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              data: "Doctor profile not updated",
              toastMessage: "Update failed",
            };
            next();
            return [2 /*return*/];
          }
          // Success response
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: updatedDoctor,
            toastMessage: "Profile updated successfully",
          };
          next();
          return [2 /*return*/];
        case 2:
          error_5 = _c.sent();
          console.error(
            "Error updating doctor profile: ".concat(error_5.message),
          );
          // Handle duplicate key (email already exists) error
          if (
            error_5.code === 11000 &&
            ((_b = error_5.keyPattern) === null || _b === void 0
              ? void 0
              : _b.email)
          ) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[11000],
              data: "Email already exists",
              toastMessage: "This email is already in use",
            };
            next();
            return [2 /*return*/];
          }
          // Generic error handling
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            data: "An error occurred while updating the profile",
            toastMessage: "An error occurred while updating the profile",
          };
          next();
          return [2 /*return*/];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}

"use strict";
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
exports.getOne =
  exports.getAll =
  exports.deleteUser =
  exports.updateUser =
  exports.createUser =
    void 0;
var users_1 = require("../../../models/users"); // Adjust path as needed
var bcryptjs_1 = require("bcryptjs");
var mongoose_1 = require("mongoose");
var config_1 = require("../../../config/config");
var aggregation_1 = require("../../../utils/aggregation");
var models_1 = require("../../../models/models");
//const SALT_ROUNDS = 15; // Define salt rounds as 15
var createUser = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      name_1,
      email,
      password,
      role,
      existingUser,
      hashedPassword,
      newUser,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 4, , 5]);
          (_a = req.body),
            (name_1 = _a.name),
            (email = _a.email),
            (password = _a.password),
            (role = _a.role);
          // Validate required fields
          if (!name_1 || !email || !password || !role) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              message: "All fields are required.",
              toastMessage: "Please provide all required fields.",
            };
            return [2 /*return*/, next()];
          }
          return [4 /*yield*/, users_1.default.findOne({ email: email })];
        case 1:
          existingUser = _b.sent();
          if (existingUser) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1013],
              message: "User with this email already exists.",
              toastMessage: "Email is already registered.",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            bcryptjs_1.default.hash(password, config_1.config.ROUNDS),
          ];
        case 2:
          hashedPassword = _b.sent();
          newUser = new users_1.default({
            name: name_1,
            email: email,
            password: hashedPassword,
            role: role,
          });
          return [4 /*yield*/, newUser.save()];
        case 3:
          _b.sent();
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "User created successfully",
            toastMessage: "User successfully created",
          };
          next();
          return [3 /*break*/, 5];
        case 4:
          error_1 = _b.sent();
          console.error("Error creating user:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            message: "Internal server error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [3 /*break*/, 5];
        case 5:
          return [2 /*return*/];
      }
    });
  });
};
exports.createUser = createUser;
// Adjust the import path based on your project structure
var updateUser = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var userId,
      _a,
      name_2,
      email,
      updateFields,
      userExists,
      updatedUser,
      error_2;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          userId = req.params.id;
          (_a = req.body), (name_2 = _a.name), (email = _a.email);
          updateFields = {};
          if (name_2 !== undefined) updateFields.name = name_2;
          if (email !== undefined) updateFields.email = email;
          // Validate if there are any fields to update
          if (Object.keys(updateFields).length === 0) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              message: "No valid fields provided for update.",
              toastMessage: "No changes detected.",
            };
            return [2 /*return*/, next()];
          }
          return [4 /*yield*/, users_1.default.findById(userId)];
        case 1:
          userExists = _b.sent();
          if (!userExists) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "User not found.",
              toastMessage: "User does not exist.",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            users_1.default
              .findByIdAndUpdate(userId, updateFields, {
                new: true,
                runValidators: true,
              })
              .select("-password -isDeleted"),
          ];
        case 2:
          updatedUser = _b.sent();
          if (!updatedUser) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              message: "User update failed.",
              toastMessage: "Could not update user.",
            };
            return [2 /*return*/, next()];
          }
          // Step 4: Send success response
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: updatedUser,
            toastMessage: "User successfully updated",
          };
          next();
          return [3 /*break*/, 4];
        case 3:
          error_2 = _b.sent();
          console.error("Error updating user:", error_2);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            message: "Error updating user",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
exports.updateUser = updateUser;
var deleteUser = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, user, error_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          id = req.query.id;
          // Validate ObjectId
          if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              message: "Invalid or missing user ID",
              toastMessage: "Invalid request",
            };
            return [2 /*return*/, next()];
          }
          return [4 /*yield*/, users_1.default.findById(id)];
        case 1:
          user = _a.sent();
          if (!user) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              toastMessage: "Invalid user ID",
            };
            return [2 /*return*/, next()];
          }
          if (user.isDeleted) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1004],
              message: "User already deleted",
              toastMessage: "User does not exist",
            };
            return [2 /*return*/, next()];
          }
          // Perform soft delete by setting isDeleted to true
          user.isDeleted = true;
          return [4 /*yield*/, user.save()];
        case 2:
          _a.sent();
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "User marked as deleted",
            toastMessage: "Item successfully deleted",
          };
          next();
          return [3 /*break*/, 4];
        case 3:
          error_3 = _a.sent();
          console.error("Error soft deleting user:", error_3);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1010],
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
};
exports.deleteUser = deleteUser;
var getAll = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var _a,
      _b,
      projection,
      _c,
      filter,
      _d,
      options,
      _e,
      search,
      date,
      fromDate,
      toDate,
      _f,
      totalCount,
      tableData,
      error_4;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          _g.trys.push([0, 2, , 3]);
          (_a = req.body),
            (_b = _a.projection),
            (projection = _b === void 0 ? {} : _b),
            (_c = _a.filter),
            (filter = _c === void 0 ? {} : _c),
            (_d = _a.options),
            (options = _d === void 0 ? {} : _d),
            (_e = _a.search),
            (search = _e === void 0 ? [] : _e),
            (date = _a.date),
            (fromDate = _a.fromDate),
            (toDate = _a.toDate);
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              users_1.default,
              filter,
              projection,
              options,
              search,
              date,
              fromDate,
              toDate,
            ),
          ];
        case 1:
          (_f = _g.sent()),
            (totalCount = _f.totalCount),
            (tableData = _f.tableData);
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: { totalCount: totalCount, tableData: tableData },
          };
          next();
          return [3 /*break*/, 3];
        case 2:
          error_4 = _g.sent();
          console.error("Error fetching data:", error_4);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
exports.getAll = getAll;
/**
 * Controller to fetch a single user by ID
 */
var getOne = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, projection, result, error_5;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          id = req.params.id;
          projection = req.body.projection;
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              toastMessage: "Invalid ID",
            };
          }
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              users_1.default,
              { _id: new mongoose_1.default.Types.ObjectId(id) },
              projection,
            ),
          ];
        case 1:
          result = _a.sent();
          if (!result.tableData.length) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1004],
              toastMessage: "Record not found or deleted",
            };
          }
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: result.tableData[0], // Access the first element of tableData
          };
          next();
          return [3 /*break*/, 3];
        case 2:
          error_5 = _a.sent();
          console.error("Error fetching record:", error_5);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
exports.getOne = getOne;

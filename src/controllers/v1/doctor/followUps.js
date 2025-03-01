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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = void 0;
exports.createUpdateFollowUp = createUpdateFollowUp;
exports.getAll = getAll;
exports.deleteFollowUp = deleteFollowUp;
var mongoose_1 = require("mongoose");
var followUps_1 = require("../../../models/followUps"); // Import Appointment model
var aggregation_1 = require("../../../utils/aggregation");
var users_1 = require("../../../models/users");
var patients_1 = require("../../../models/patients");
var mongodb_1 = require("mongodb");
var models_1 = require("../../../models/models");
function createUpdateFollowUp(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var _a,
      _id,
      patientId,
      diagnosis,
      treatment,
      prescription,
      visitDate,
      rest,
      doctorId,
      existingUser,
      existingPatient,
      updateFields,
      updatedFollowUp,
      newFollowUp,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 7, , 8]);
          (_a = req.body),
            (_id = _a._id),
            (patientId = _a.patientId),
            (diagnosis = _a.diagnosis),
            (treatment = _a.treatment),
            (prescription = _a.prescription),
            (visitDate = _a.visitDate),
            (rest = __rest(_a, [
              "_id",
              "patientId",
              "diagnosis",
              "treatment",
              "prescription",
              "visitDate",
            ]));
          doctorId = req.user.id;
          return [
            4 /*yield*/,
            users_1.default.findOne({
              _id: new mongodb_1.ObjectId(doctorId),
            }),
          ];
        case 1:
          existingUser = _b.sent();
          console.log(req.user);
          if (!existingUser) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "Doctor not found",
              toastMessage: "Doctor not found",
            };
            next();
            return [2 /*return*/];
          }
          if (existingUser.role !== "DOCTOR") {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "User is not authorized as a doctor",
              toastMessage: "User is not authorized as a doctor",
            };
            next();
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            patients_1.PatientModel.findOne({
              _id: new mongodb_1.ObjectId(patientId),
            }),
          ];
        case 2:
          existingPatient = _b.sent();
          if (!existingPatient) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "Patient not found",
              toastMessage: "Patient not found",
            };
            next();
            return [2 /*return*/];
          }
          if (!_id) return [3 /*break*/, 4];
          updateFields = __assign(
            {
              patientId: patientId,
              doctorId: doctorId,
              diagnosis: diagnosis,
              treatment: treatment,
              prescription: prescription,
              visitDate: visitDate,
            },
            rest,
          );
          delete updateFields.isDeleted; // Explicitly remove `isDeleted`
          return [
            4 /*yield*/,
            followUps_1.FollowUp.findByIdAndUpdate(_id, updateFields, {
              new: true,
            }),
          ];
        case 3:
          updatedFollowUp = _b.sent();
          if (!updatedFollowUp) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "FollowUp record not found",
              toastMessage: "FollowUp record not found",
            };
            next();
            return [2 /*return*/];
          }
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Follow-up updated successfully",
            toastMessage: "Follow-up updated successfully",
          };
          next();
          return [2 /*return*/];
        case 4:
          newFollowUp = new followUps_1.FollowUp({
            patientId: patientId,
            doctorId: doctorId,
            diagnosis: diagnosis,
            treatment: treatment,
            prescription: prescription,
            visitDate: visitDate,
          });
          return [4 /*yield*/, newFollowUp.save()];
        case 5:
          _b.sent();
          // "Follow-up created successfully",
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Follow-up created successfully",
            toastMessage: "Follow-up created successfully",
          };
          next();
          return [2 /*return*/];
        case 6:
          return [3 /*break*/, 8];
        case 7:
          error_1 = _b.sent();
          console.error("Error fetching data:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [2 /*return*/];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function getAll(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
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
      sanitizedProjection,
      sanitizedFilter,
      _f,
      totalCount,
      tableData,
      error_2;
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
          sanitizedProjection = __assign({}, projection);
          delete sanitizedProjection.isDeleted;
          sanitizedFilter = __assign(__assign({}, filter), {
            isDeleted: false,
          });
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              followUps_1.FollowUp,
              sanitizedFilter,
              sanitizedProjection,
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
          return [2 /*return*/];
        case 2:
          error_2 = _g.sent();
          console.error("Error fetching data:", error_2);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [2 /*return*/];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
var getOne = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id,
      _a,
      projection,
      objectId,
      sanitizedProjection,
      tableData,
      followUpObj,
      error_3;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          id = req.params.id;
          (_a = req.body.projection), (projection = _a === void 0 ? {} : _a);
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "Invalid FollowUp ID",
              toastMessage: "Invalid FollowUp ID",
            };
            next();
            return [2 /*return*/];
          }
          objectId = new mongoose_1.default.Types.ObjectId(id);
          sanitizedProjection = __assign({}, projection);
          delete sanitizedProjection.isDeleted;
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              followUps_1.FollowUp,
              { _id: objectId, isDeleted: false },
              sanitizedProjection,
            ),
          ];
        case 1:
          tableData = _b.sent().tableData;
          if (!tableData || tableData.length === 0) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "FollowUp record not found or deleted",
              toastMessage: "FollowUp record not found or deleted",
            };
            next();
            return [2 /*return*/];
          }
          followUpObj = tableData[0];
          // Only includes fields from sanitizedProjection
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: followUpObj,
          };
          next();
          return [2 /*return*/];
        case 2:
          error_3 = _b.sent();
          console.error("Error fetching data:", error_3);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [2 /*return*/];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
exports.getOne = getOne;
function deleteFollowUp(req, res, next) {
  return __awaiter(this, void 0, void 0, function () {
    var id, followup, error_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          id = req.params.id;
          // Validate ObjectId
          // "Invalid FollowUp ID"
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "Enter a valid id",
              toastMessage: "Enter a valid id",
            };
            next();
            return [2 /*return*/];
          }
          return [4 /*yield*/, followUps_1.FollowUp.findById(id)];
        case 1:
          followup = _a.sent();
          if (!followup) {
            // Fixed: Properly handle the null case
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "FollowUp record not found or deleted",
              toastMessage: "FollowUp record not found or deleted",
            };
            next();
            return [2 /*return*/];
          }
          if (followup.isDeleted) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              message: "FollowUp record already deleted",
              toastMessage: "FollowUp record already deleted",
            };
            next();
            return [2 /*return*/];
          }
          // Perform soft delete
          followup.isDeleted = true;
          return [4 /*yield*/, followup.save()];
        case 2:
          _a.sent();
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Follow-up deleted successfully",
            toastMessage: "Follow-up deleted successfully",
          };
          next();
          return [2 /*return*/];
        case 3:
          error_4 = _a.sent();
          console.error("Error fetching data:", error_4);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return [2 /*return*/];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}

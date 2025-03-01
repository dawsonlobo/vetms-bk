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
exports.deleteAppointment =
  exports.getOne =
  exports.getAll =
  exports.createUpdate =
    void 0;
var mongoose_1 = require("mongoose");
var appointments_1 = require("../../../models/appointments");
var aggregation_1 = require("../../../utils/aggregation");
var models_1 = require("../../../models/models");
var constant_1 = require("../../../config/constant");
var moment_1 = require("moment");
var accessTokens_1 = require("../../../models/accessTokens");
var createUpdate = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var authHeader,
      token,
      accessTokenRecord,
      receptionistId,
      _a,
      _id,
      doctorId,
      patientId,
      date,
      status_1,
      parsedDate,
      formattedDate,
      validatedStatus,
      appointment,
      isUpdate,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 6, , 7]);
          authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              toastMessage: "Unauthorized: Access token is missing",
            };
            return [2 /*return*/, next()];
          }
          token = authHeader.split(" ")[1];
          return [
            4 /*yield*/,
            accessTokens_1.AccessToken.findOne({ token: token }).exec(),
          ];
        case 1:
          accessTokenRecord = _b.sent();
          if (!accessTokenRecord) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              toastMessage: "Unauthorized: Invalid access token",
            };
            return [2 /*return*/, next()];
          }
          receptionistId = accessTokenRecord.userId;
          console.log("Authenticated receptionist ID:", receptionistId);
          (_a = req.body),
            (_id = _a._id),
            (doctorId = _a.doctorId),
            (patientId = _a.patientId),
            (date = _a.date),
            (status_1 = _a.status);
          console.log("Received request data:", req.body);
          // Prevent unauthorized modification of patientId or doctorId during an update
          if (_id && (req.body.patientId || req.body.doctorId)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              toastMessage:
                "You cannot modify patientId or doctorId during an update",
            };
            return [2 /*return*/, next()];
          }
          // Validate `_id`
          if (_id && !mongoose_1.default.Types.ObjectId.isValid(_id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              toastMessage: "Invalid Appointment ID",
            };
            return [2 /*return*/, next()];
          }
          parsedDate = null;
          if (date) {
            formattedDate = (0, moment_1.default)(date, "DD-MM-YYYY", true);
            if (!formattedDate.isValid()) {
              req.apiStatus = {
                isSuccess: false,
                error: models_1.ErrorCodes[1004],
                toastMessage: "Invalid date format. Use 'DD-MM-YYYY'.",
              };
              return [2 /*return*/, next()];
            }
            parsedDate = formattedDate.toDate();
          }
          validatedStatus =
            status_1 || constant_1.CONSTANTS.APPOINTMENT_STATUS.PENDING;
          appointment = void 0;
          isUpdate = Boolean(_id);
          if (!isUpdate) return [3 /*break*/, 3];
          return [
            4 /*yield*/,
            appointments_1.AppointmentModel.findOneAndUpdate(
              { _id: _id, receptionistId: receptionistId },
              __assign(
                __assign(
                  __assign({}, doctorId && { doctorId: doctorId }),
                  parsedDate && { date: parsedDate },
                ),
                { status: validatedStatus },
              ),
              { new: true },
            ).exec(),
          ];
        case 2:
          // Update appointment only if it belongs to the logged-in receptionist
          appointment = _b.sent();
          if (!appointment) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1004],
              toastMessage: "Appointment record not found",
            };
            return [2 /*return*/, next()];
          }
          return [3 /*break*/, 5];
        case 3:
          return [
            4 /*yield*/,
            new appointments_1.AppointmentModel({
              doctorId: doctorId,
              patientId: patientId,
              date: parsedDate,
              receptionistId: receptionistId, // Taken from AccessToken model
              status: constant_1.CONSTANTS.APPOINTMENT_STATUS.PENDING,
            }).save(),
          ];
        case 4:
          // Create a new appointment, automatically setting receptionistId
          appointment = _b.sent();
          _b.label = 5;
        case 5:
          console.log("Created/Updated appointment:", appointment);
          req.apiStatus = {
            isSuccess: true,
            message: isUpdate
              ? "Appointment record updated successfully"
              : "Appointment added successfully",
            data: isUpdate
              ? __assign({}, appointment.toObject())
              : {
                  _id: appointment._id,
                  createdAt: appointment.createdAt,
                  updatedAt: appointment.updatedAt,
                }, // Only selected fields for creation
            toastMessage: isUpdate
              ? "Appointment record updated successfully"
              : "Appointment added successfully",
          };
          next();
          return [2 /*return*/];
        case 6:
          error_1 = _b.sent();
          console.error("Error in createUpdate:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1006],
            toastMessage: "Internal Server Error",
          };
          next();
          return [2 /*return*/];
        case 7:
          return [2 /*return*/];
      }
    });
  });
};
exports.createUpdate = createUpdate;
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
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              appointments_1.AppointmentModel,
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
          error_2 = _g.sent();
          console.error("Error fetching appointments:", error_2);
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
var getOne = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, projection, result, error_3;
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
              toastMessage: "Invalid appointment ID",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              appointments_1.AppointmentModel,
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
              toastMessage: "Appointment not found or deleted",
            };
            return [2 /*return*/, next()];
          }
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: result.tableData[0], // Access the first element of tableData
          };
          next();
          return [3 /*break*/, 3];
        case 2:
          error_3 = _a.sent();
          console.error("Error fetching appointment:", error_3);
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
var deleteAppointment = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id, appointment, error_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          id = req.params.id;
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1003],
              toastMessage: "Invalid appointment ID provided",
            };
            return [2 /*return*/, next()];
          }
          return [
            4 /*yield*/,
            appointments_1.AppointmentModel.findByIdAndDelete(id).exec(),
          ];
        case 1:
          appointment = _a.sent();
          if (!appointment) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1004],
              toastMessage: "Appointment not found or already deleted",
            };
            return [2 /*return*/, next()];
          }
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Appointment deleted successfully",
            toastMessage: "Appointment deleted successfully",
          };
          next();
          return [3 /*break*/, 3];
        case 2:
          error_4 = _a.sent();
          console.error("Error deleting appointment:", error_4);
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
exports.deleteAppointment = deleteAppointment;

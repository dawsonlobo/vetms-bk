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
exports.deleteAppointment = exports.getOne = exports.createUpdate = void 0;
exports.getAll = getAll;
var mongoose_1 = require("mongoose");
var appointments_1 = require("../../../models/appointments");
var aggregation_1 = require("../../../utils/aggregation");
var constant_1 = require("../../../config/constant");
var models_1 = require("../../../models/models");
var users_1 = require("../../../models/users");
/**
 * Create or update an appointment (Nurse only)
 */
var createUpdate = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user,
      nurseId,
      nurse,
      _a,
      _id,
      doctorId,
      patientId,
      date,
      status_1,
      parsedDate,
      validatedStatus,
      appointment,
      isUpdate,
      error_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 6, , 7]);
          user = req.user;
          nurseId = user === null || user === void 0 ? void 0 : user._id;
          if (!nurseId) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1001],
              toastMessage: "Unauthorized access",
            };
            return [2 /*return*/, next()];
          }
          return [4 /*yield*/, users_1.default.findById(nurseId)];
        case 1:
          nurse = _b.sent();
          if (!nurse || nurse.isDeleted === true || nurse.isEnabled === false) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1007],
              toastMessage:
                "You cannot create or update appointments with a disabled or deleted account.",
            };
            return [2 /*return*/, next()];
          }
          (_a = req.body),
            (_id = _a._id),
            (doctorId = _a.doctorId),
            (patientId = _a.patientId),
            (date = _a.date),
            (status_1 = _a.status);
          // Prevent unauthorized modification of nurseId or patientId
          if (_id && (req.body.patientId || req.body.nurseId)) {
            req.apiStatus = {
              isSuccess: false,
              error: models_1.ErrorCodes[1002],
              toastMessage:
                "You cannot modify patientId or nurseId during an update",
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
            if (typeof date === "number") {
              parsedDate = new Date(date); // Convert epoch timestamp
            } else if (typeof date === "string") {
              parsedDate = new Date(date);
            }
            if (isNaN(parsedDate.getTime())) {
              req.apiStatus = {
                isSuccess: false,
                error: models_1.ErrorCodes[1005],
                toastMessage: "Invalid date format. Use epoch timestamp.",
              };
              return [2 /*return*/, next()];
            }
          }
          validatedStatus = status_1
            ? status_1.toLowerCase()
            : constant_1.CONSTANTS.APPOINTMENT_STATUS.PENDING;
          appointment = void 0;
          isUpdate = Boolean(_id);
          if (!isUpdate) return [3 /*break*/, 3];
          return [
            4 /*yield*/,
            appointments_1.AppointmentModel.findOneAndUpdate(
              { _id: _id, nurseId: nurseId },
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
          // Update appointment only if it belongs to the logged-in nurse
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
              date: parsedDate,
              nurseId: nurseId, // Taken from req.user
              patientId: patientId, // Make sure this is extracted from req.body
              status: constant_1.CONSTANTS.APPOINTMENT_STATUS.PENDING,
            }).save(),
          ];
        case 4:
          // Create a new appointment, automatically setting nurseId
          appointment = _b.sent();
          _b.label = 5;
        case 5:
          req.apiStatus = {
            isSuccess: true,
            message: isUpdate
              ? "Appointment record updated successfully"
              : "Appointment added successfully",
            data: isUpdate
              ? __assign(
                  __assign(
                    __assign(
                      {
                        _id: appointment._id,
                        createdAt: appointment.createdAt,
                        updatedAt: appointment.updatedAt,
                      },
                      doctorId && { doctorId: doctorId },
                    ),
                    parsedDate && { date: new Date(parsedDate).toISOString() },
                  ),
                  status_1 && { status: status_1 },
                )
              : {
                  _id: appointment._id,
                  createdAt: appointment.createdAt,
                  updatedAt: appointment.updatedAt,
                },
            toastMessage: isUpdate
              ? "Appointment record updated successfully"
              : "Appointment added successfully",
          };
          return [2 /*return*/, next()];
        case 6:
          error_1 = _b.sent();
          console.error("Error in createUpdate:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1006],
            toastMessage: "Internal Server Error",
          };
          return [2 /*return*/, next()];
        case 7:
          return [2 /*return*/];
      }
    });
  });
};
exports.createUpdate = createUpdate;
/**
 * Get all appointments for the logged-in nurse
 */
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
      Projection,
      Filter,
      parseEpoch,
      isoDate,
      regex_1,
      sortBy,
      sortOrder,
      sortOptions,
      page,
      itemsPerPage,
      skip,
      _f,
      totalCount,
      tableData,
      formattedData,
      error_2;
    var _g;
    var _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          _k.trys.push([0, 2, , 3]);
          (_a = req.body),
            (_b = _a.projection),
            (projection = _b === void 0 ? {} : _b),
            (_c = _a.filter),
            (filter = _c === void 0 ? {} : _c),
            (_d = _a.options),
            (options = _d === void 0 ? {} : _d),
            (_e = _a.search),
            (search = _e === void 0 ? {} : _e),
            (date = _a.date),
            (fromDate = _a.fromDate),
            (toDate = _a.toDate);
          Projection = __assign({}, projection);
          delete Projection.isDeleted;
          Filter = __assign(__assign({}, filter), { isDeleted: false });
          // Convert `doctorId` to ObjectId if it's a valid ObjectId string
          if (
            filter.doctorId &&
            mongoose_1.default.isValidObjectId(filter.doctorId)
          ) {
            Filter.doctorId = new mongoose_1.default.Types.ObjectId(
              filter.doctorId,
            );
          }
          // Case-insensitive status filtering
          if (filter.status) {
            Filter.status = new RegExp("^".concat(filter.status, "$"), "i");
          }
          console.log("Final Filter:", JSON.stringify(Filter, null, 2));
          parseEpoch = function (epoch) {
            var dateObj = new Date(epoch);
            dateObj.setUTCHours(0, 0, 0, 0);
            return dateObj;
          };
          // Apply single date filtering
          if (date) {
            isoDate = parseEpoch(date);
            Filter.date = {
              $gte: isoDate,
              $lt: new Date(isoDate.getTime() + 86400000),
            };
          }
          // Apply date range filtering
          if (fromDate && toDate) {
            Filter.date = {
              $gte: parseEpoch(fromDate),
              $lte: parseEpoch(toDate),
            };
          }
          // Apply search filters correctly
          if (search.term && search.fields && Array.isArray(search.fields)) {
            regex_1 = search.startsWith
              ? new RegExp("^".concat(search.term), "i")
              : new RegExp(search.term, "i");
            Filter.$or = search.fields.map(function (field) {
              var _a;
              return (_a = {}), (_a[field] = { $regex: regex_1 }), _a;
            });
          }
          sortBy =
            ((_h = options.sortBy) === null || _h === void 0
              ? void 0
              : _h.length) > 0
              ? options.sortBy[0]
              : "createdAt";
          sortOrder =
            ((_j = options.sortDesc) === null || _j === void 0
              ? void 0
              : _j.length) > 0 && options.sortDesc[0]
              ? -1
              : 1;
          sortOptions = ((_g = {}), (_g[sortBy] = sortOrder), _g);
          page = options.page && options.page > 0 ? options.page : 1;
          itemsPerPage = options.itemsPerPage >= 0 ? options.itemsPerPage : 10;
          // If itemsPerPage is 0, return an empty response immediately
          if (itemsPerPage === 0) {
            req.apiStatus = {
              isSuccess: true,
              message: "Success",
              data: { totalCount: 0, tableData: [] },
            };
            next();
            return [2 /*return*/];
          }
          skip = (page - 1) * itemsPerPage;
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              appointments_1.AppointmentModel,
              Filter,
              Projection,
              __assign(__assign({}, options), {
                sort: sortOptions,
                skip: skip,
                limit: itemsPerPage,
              }),
            ),
          ];
        case 1:
          (_f = _k.sent()),
            (totalCount = _f.totalCount),
            (tableData = _f.tableData);
          formattedData = tableData.map(function (appointment) {
            var formattedAppointment = __assign({}, appointment);
            if (appointment.date) {
              formattedAppointment.date = new Date(
                appointment.date,
              ).toISOString();
            } else {
              delete formattedAppointment.date; // Remove it from the response
            }
            return formattedAppointment;
          });
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: { totalCount: totalCount, tableData: formattedData },
          };
          next();
          return [2 /*return*/];
        case 2:
          error_2 = _k.sent();
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
    var user, id, _a, projection, Projection, result, appointment, error_3;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          _e.trys.push([0, 2, , 3]);
          user = req.user;
          if (!(user === null || user === void 0 ? void 0 : user._id)) {
            req.apiStatus = {
              isSuccess: false,
              message: "Unauthorized access",
              toastMessage: "User not authenticated",
              error: { statusCode: 401, message: "Unauthorized" },
            };
            return [2 /*return*/, next()];
          }
          id = req.params.id;
          (_a = req.body.projection), (projection = _a === void 0 ? {} : _a);
          // Validate ID format before making DB calls
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
              isSuccess: false,
              message: "Invalid appointment ID",
              toastMessage: "Invalid record",
              error: {
                statusCode: 400,
                message: "The provided ID format is incorrect.",
              },
            };
            return [2 /*return*/, next()];
          }
          Projection = __assign({}, projection);
          delete Projection.isDeleted;
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              appointments_1.AppointmentModel,
              {
                _id: new mongoose_1.default.Types.ObjectId(id),
                nurseId: user._id,
                isDeleted: false,
              },
              Projection,
            ),
          ];
        case 1:
          result = _e.sent();
          // Handle case where no record is found
          if (
            !((_b =
              result === null || result === void 0
                ? void 0
                : result.tableData) === null || _b === void 0
              ? void 0
              : _b.length)
          ) {
            req.apiStatus = {
              isSuccess: false,
              message: "Record not found or deleted",
              toastMessage: "No record found",
            };
            return [2 /*return*/, next()];
          }
          appointment = result.tableData[0];
          // Return formatted response with ISO date
          req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: {
              _id: appointment._id,
              patientId:
                (_c = appointment.patientId) !== null && _c !== void 0
                  ? _c
                  : appointment.petId, // Ensure correct field mapping
              doctorId: appointment.doctorId,
              date: appointment.date
                ? new Date(appointment.date * 1000).toISOString()
                : null, // Convert from epoch to ISO
              status:
                (_d = appointment.status) !== null && _d !== void 0
                  ? _d
                  : appointment.schedule, // Ensure correct mapping
              createdAt: appointment.createdAt, // No need to convert, handled by Mongoose
              updatedAt: appointment.updatedAt, // No need to convert, handled by Mongoose
            },
          };
          next();
          return [3 /*break*/, 3];
        case 2:
          error_3 = _e.sent();
          console.error("Error fetching appointment:", error_3);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
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
var deleteAppointment = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    var user, id, appointment, error_4;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          user = req.user;
          if (!(user === null || user === void 0 ? void 0 : user._id)) {
            res.status(401).json({ status: 401, message: "Unauthorized" });
            return [2 /*return*/];
          }
          id = req.params.id;
          if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res
              .status(400)
              .json({ status: 400, message: "Invalid appointment ID" });
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            appointments_1.AppointmentModel.findOneAndUpdate(
              { _id: id, nurseId: user._id }, // Ensure the appointment belongs to the logged-in nurse
              { isDeleted: true }, // Set isDeleted flag instead of deleting
              { new: true },
            ).exec(),
          ];
        case 1:
          appointment = _a.sent();
          if (!appointment) {
            res.status(404).json({
              status: 404,
              message: "Appointment not found or unauthorized",
            });
            return [2 /*return*/];
          }
          res
            .status(200)
            .json({ status: 200, message: "Appointment marked as deleted" });
          return [3 /*break*/, 3];
        case 2:
          error_4 = _a.sent();
          console.error("Error deleting appointment:", error_4);
          res
            .status(500)
            .json({ status: 500, message: "Internal Server Error" });
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
};
exports.deleteAppointment = deleteAppointment;

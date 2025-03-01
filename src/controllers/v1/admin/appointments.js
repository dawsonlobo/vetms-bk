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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.getAll = void 0;
var mongoose_1 = require("mongoose");
var appointments_1 = require("../../../models/appointments");
var constant_1 = require("../../../config/constant");
var aggregation_1 = require("../../../utils/aggregation");
var models_1 = require("../../../models/models");
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
      lookups,
      _f,
      totalCount,
      tableData,
      error_1;
    var _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          _h.trys.push([0, 2, , 3]);
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
          lookups = (
            (_g = req.body) === null || _g === void 0
              ? void 0
              : _g.lookupRequired
          )
            ? [
                {
                  $lookup: {
                    from: constant_1.CONSTANTS.COLLECTIONS.PATIENTS_COLLECTION, // Lookup patient details
                    localField: "patientId",
                    foreignField: "_id",
                    as: "patientDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$patientDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: constant_1.CONSTANTS.COLLECTIONS.USER_COLLECTION, // Lookup doctor details
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$doctorDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ]
            : [];
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
              lookups,
            ),
          ];
        case 1:
          (_f = _h.sent()),
            (totalCount = _f.totalCount),
            (tableData = _f.tableData);
          req.apiStatus = {
            isSuccess: true,
            data: { totalCount: totalCount, tableData: tableData },
            message: "Success",
          };
          return [3 /*break*/, 3];
        case 2:
          error_1 = _h.sent();
          console.error("Error fetching data:", error_1);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          return [3 /*break*/, 3];
        case 3:
          next();
          return [2 /*return*/];
      }
    });
  });
};
exports.getAll = getAll;
var getOne = function (req, res, next) {
  return __awaiter(void 0, void 0, void 0, function () {
    var id,
      _a,
      _b,
      projection,
      _c,
      lookupRequired,
      lookups,
      aggregationPipeline,
      tableData,
      error_2;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          _d.trys.push([0, 2, , 3]);
          id = req.params.id;
          (_a = req.body),
            (_b = _a.projection),
            (projection = _b === void 0 ? {} : _b),
            (_c = _a.lookupRequired),
            (lookupRequired = _c === void 0 ? false : _c);
          lookups = lookupRequired
            ? [
                {
                  $lookup: {
                    from: "patients", // Lookup patient details
                    localField: "patientId",
                    foreignField: "_id",
                    as: "patientDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$patientDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
                {
                  $lookup: {
                    from: "users", // Lookup doctor details
                    localField: "doctorId",
                    foreignField: "_id",
                    as: "doctorDetails",
                  },
                },
                {
                  $unwind: {
                    path: "$doctorDetails",
                    preserveNullAndEmptyArrays: true,
                  },
                },
              ]
            : [];
          aggregationPipeline = __spreadArray(
            __spreadArray(
              [{ $match: { _id: new mongoose_1.default.Types.ObjectId(id) } }],
              lookups,
              true,
            ),
            [
              { $project: projection || {} }, // Apply the projection if provided
            ],
            false,
          );
          return [
            4 /*yield*/,
            (0, aggregation_1.aggregateData)(
              appointments_1.AppointmentModel,
              {}, // No filter is needed for `getOne`, since we already match by ID
              projection,
              {}, // Empty options
              [], // No search is needed
              undefined, // No date, fromDate, or toDate
              undefined,
              undefined,
              aggregationPipeline,
            ),
          ];
        case 1:
          tableData = _d.sent().tableData;
          if (!tableData.length) {
            req.apiStatus = {
              isSuccess: false,
              message: "Record not found or deleted",
              toastMessage: "No record found",
            };
            next();
            return [2 /*return*/];
          }
          req.apiStatus = {
            isSuccess: true,
            data: tableData[0],
            message: "Success",
          };
          return [3 /*break*/, 3];
        case 2:
          error_2 = _d.sent();
          console.error("Error fetching record:", error_2);
          req.apiStatus = {
            isSuccess: false,
            error: models_1.ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          return [3 /*break*/, 3];
        case 3:
          next();
          return [2 /*return*/];
      }
    });
  });
};
exports.getOne = getOne;

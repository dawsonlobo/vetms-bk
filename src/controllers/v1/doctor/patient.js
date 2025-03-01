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
exports.getOne = void 0;
exports.getAll = getAll;
exports.Update = Update;
var mongoose_1 = require("mongoose");
var patients_1 = require("../../../models/patients");
var aggregation_1 = require("../../../utils/aggregation");
var models_1 = require("../../../models/models");
var getOne = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, projection, objectId, sanitizedProjection, tableData, followUpObj, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                projection = req.body.projection;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        message: "Invalid Appointment ID.",
                        toastMessage: "Invalid Appointment ID.",
                    };
                    next();
                    return [2 /*return*/];
                }
                objectId = new mongoose_1.default.Types.ObjectId(id);
                sanitizedProjection = __assign({}, projection);
                delete sanitizedProjection.isDeleted;
                return [4 /*yield*/, (0, aggregation_1.aggregateData)(patients_1.PatientModel, { _id: objectId, isDeleted: false }, sanitizedProjection)];
            case 1:
                tableData = (_a.sent()).tableData;
                if (!tableData || tableData.length === 0) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        message: "Patient record not found or deleted",
                        toastMessage: "Patient record not found or deleted",
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
                error_1 = _a.sent();
                console.error("Error fetching data:", error_1);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    message: "Internal Server Error",
                    toastMessage: "Something went wrong. Please try again.",
                };
                next();
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOne = getOne;
function getAll(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, projection, _c, filter, _d, options, _e, search, date, fromDate, toDate, sanitizedProjection, sanitizedFilter, _f, totalCount, tableData, error_2;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    _a = req.body, _b = _a.projection, projection = _b === void 0 ? {} : _b, _c = _a.filter, filter = _c === void 0 ? {} : _c, _d = _a.options, options = _d === void 0 ? {} : _d, _e = _a.search, search = _e === void 0 ? [] : _e, date = _a.date, fromDate = _a.fromDate, toDate = _a.toDate;
                    sanitizedProjection = __assign({}, projection);
                    delete sanitizedProjection.isDeleted;
                    sanitizedFilter = __assign(__assign({}, filter), { isDeleted: false });
                    return [4 /*yield*/, (0, aggregation_1.aggregateData)(patients_1.PatientModel, sanitizedFilter, sanitizedProjection, options, search, date, fromDate, toDate)];
                case 1:
                    _f = _g.sent(), totalCount = _f.totalCount, tableData = _f.tableData;
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
                        toastMessage: "Internal Server Error",
                    };
                    next();
                    return [2 /*return*/];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function Update(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, weight, bmi, medicalHistory, existingUser, updatedPatient, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    console.log("this is update controller");
                    console.log("Request Params:", req.params);
                    id = req.params.id;
                    console.log("Received ID:", id);
                    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "Invalid patient ID format.",
                            toastMessage: "Invalid patient ID format.",
                        };
                        next();
                        return [2 /*return*/];
                    }
                    _a = req.body, weight = _a.weight, bmi = _a.bmi, medicalHistory = _a.medicalHistory;
                    return [4 /*yield*/, patients_1.PatientModel.findById(id)];
                case 1:
                    existingUser = _b.sent();
                    console.log("Existing User:", existingUser);
                    if (!existingUser) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "Patient record not found.",
                            toastMessage: "Patient record not found.",
                        };
                        next();
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, patients_1.PatientModel.findByIdAndUpdate(id, { weight: weight, bmi: bmi, medicalHistory: medicalHistory }, { new: true })];
                case 2:
                    updatedPatient = _b.sent();
                    console.log("Updated Patient:", updatedPatient);
                    if (!updatedPatient) {
                        req.apiStatus = {
                            isSuccess: false,
                            error: models_1.ErrorCodes[1002],
                            data: "Error updating patient record.",
                            toastMessage: "Error updating patient record.",
                        };
                        next();
                        return [2 /*return*/];
                    }
                    req.apiStatus = {
                        isSuccess: true,
                        message: "Success",
                        data: "Patient updated successfully",
                        toastMessage: "Patient updated successfully",
                    };
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error("Error updating data:", error_3);
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        message: "Internal Server Error",
                        toastMessage: "Internal Server Error",
                    };
                    next();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// export const Update = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
//     try {
//       console.log("this is update controller");
//       const{id}=req.params;
//       console.log(id);
//         const { weight, bmi, medicalHistory } = req.body;
//      const existingUser = await PatientModel.findOne({ _id: new ObjectId(id) });
//         console.log(id);
//         console.log(existingUser);
//               const updateFields = { weight, bmi, medicalHistory };
//             //   if (updateFields.isDeleted) {
//             //     delete updateFields.isDeleted;
//             // }
//             const updatedPatients = await PatientModel.findById(new mongoose.Types.ObjectId(id), updateFields, { new: true });
//             console.log(updatedPatients);
//             if (!updatedPatients) {
//               req.apiStatus = {
//                 isSuccess: false,
//                 error:ErrorCodes[1002],
//                 data: "Patients record not found." ,
//                 toastMessage: "Patients record not found." ,
//               };
//               next();
//                  return;
//             }
//             req.apiStatus = {
//               isSuccess: true,
//             message: "Success",
//               data: "Appointment updated successfully",
//               toastMessage: "Appointment updated successfully",
//             };
//             next();
//             return;
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       req.apiStatus = {
//         isSuccess: false,
//         error:ErrorCodes[1002],
//         message: "Internal Server Error",
//         toastMessage: "Internal Server Error",
//       };
//       next();
//       return;
//     }
// };

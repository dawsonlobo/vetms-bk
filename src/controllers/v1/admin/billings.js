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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.getAll = exports.upsertBilling = void 0;
var mongoose_1 = require("mongoose");
var billings_1 = require("../../../models/billings");
var aggregation_1 = require("../../../utils/aggregation");
var constant_1 = require("../../../config/constant");
var models_1 = require("../../../models/models");
var upsertBilling = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _id, billingData, existingBilling, updatedBilling, newBilling, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = req.body, _id = _a._id, billingData = __rest(_a, ["_id"]);
                if (!_id) return [3 /*break*/, 3];
                if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        toastMessage: "Invalid Billing ID provided",
                    };
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, billings_1.BillingModel.findById(_id).exec()];
            case 1:
                existingBilling = _b.sent();
                if (!existingBilling) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                        toastMessage: "Billing record not found",
                    };
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, billings_1.BillingModel.findByIdAndUpdate(_id, billingData, { new: true }).exec()];
            case 2:
                updatedBilling = _b.sent();
                req.apiStatus = {
                    isSuccess: true,
                    message: "Billing record updated successfully",
                    data: updatedBilling || {},
                    toastMessage: "Billing record updated successfully",
                };
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, new billings_1.BillingModel(billingData).save()];
            case 4:
                newBilling = _b.sent();
                req.apiStatus = {
                    isSuccess: true,
                    message: "Billing record created successfully",
                    data: newBilling,
                    toastMessage: "Billing record created successfully",
                };
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("Error in upsertBilling:", error_1);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1010],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [3 /*break*/, 7];
            case 7:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.upsertBilling = upsertBilling;
var getAll = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, projection, _c, filter, _d, options, _e, search, date, fromDate, toDate, lookups, _f, totalCount, tableData, error_2;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                _h.trys.push([0, 2, , 3]);
                _a = req.body, _b = _a.projection, projection = _b === void 0 ? {} : _b, _c = _a.filter, filter = _c === void 0 ? {} : _c, _d = _a.options, options = _d === void 0 ? {} : _d, _e = _a.search, search = _e === void 0 ? [] : _e, date = _a.date, fromDate = _a.fromDate, toDate = _a.toDate;
                lookups = ((_g = req.body) === null || _g === void 0 ? void 0 : _g.lookupRequired)
                    ? [
                        {
                            $lookup: {
                                from: constant_1.CONSTANTS.COLLECTIONS.PATIENTS_COLLECTION,
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
                                from: constant_1.CONSTANTS.COLLECTIONS.USER_COLLECTION,
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
                return [4 /*yield*/, (0, aggregation_1.aggregateData)(billings_1.BillingModel, filter, projection, options, search, date, fromDate, toDate, lookups)];
            case 1:
                _f = _h.sent(), totalCount = _f.totalCount, tableData = _f.tableData;
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: { totalCount: totalCount, tableData: tableData },
                };
                return [3 /*break*/, 3];
            case 2:
                error_2 = _h.sent();
                console.error("Error fetching data:", error_2);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [3 /*break*/, 3];
            case 3:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.getAll = getAll;
var getOne = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, projection, objectId, tableData, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body.projection, projection = _a === void 0 ? {} : _a;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                    };
                    return [2 /*return*/, next()];
                }
                objectId = new mongoose_1.default.Types.ObjectId(id);
                return [4 /*yield*/, (0, aggregation_1.aggregateData)(billings_1.BillingModel, { _id: objectId, isDeleted: false }, projection)];
            case 1:
                tableData = (_b.sent()).tableData;
                if (!tableData || tableData.length === 0) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1002],
                    };
                    return [2 /*return*/, next()];
                }
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: tableData[0],
                };
                return [3 /*break*/, 3];
            case 2:
                error_3 = _b.sent();
                console.error("Error fetching bill:", error_3);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1010],
                };
                return [3 /*break*/, 3];
            case 3:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.getOne = getOne;

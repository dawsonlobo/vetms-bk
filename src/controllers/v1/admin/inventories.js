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
exports.getOne = exports.getAll = exports.deleteInventory = exports.updateInventory = exports.createInventory = void 0;
var inventories_1 = require("../../../models/inventories");
var mongoose_1 = require("mongoose");
var aggregation_1 = require("../../../utils/aggregation");
var models_1 = require("../../../models/models");
var createInventory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, price, quantity, newInventoryItem, savedItem, savedItemObject, responseData, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, price = _a.price, quantity = _a.quantity;
                if (!name_1 || price === undefined || quantity === undefined) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1001], // Adjust error code as needed
                        toastMessage: "Missing required fields: name, price, or quantity",
                    };
                    return [2 /*return*/, next()];
                }
                newInventoryItem = new inventories_1.InventoryModel({
                    name: name_1,
                    price: price,
                    quantity: quantity,
                    isDeleted: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                return [4 /*yield*/, newInventoryItem.save()];
            case 1:
                savedItem = _b.sent();
                savedItemObject = savedItem.toObject();
                delete savedItemObject.isDeleted;
                responseData = savedItemObject;
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: responseData,
                    toastMessage: "Item successfully added to inventory",
                };
                return [2 /*return*/, next()];
            case 2:
                error_1 = _b.sent();
                console.error("Error creating inventory:", error_1);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [2 /*return*/, next()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createInventory = createInventory;
var updateInventory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, name_2, price, quantity, isDeleted, updatedItem, responseData, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, name_2 = _a.name, price = _a.price, quantity = _a.quantity, isDeleted = _a.isDeleted;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1003],
                        toastMessage: "Invalid inventory ID",
                    };
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, inventories_1.InventoryModel.findByIdAndUpdate(id, __assign(__assign(__assign(__assign(__assign({}, (name_2 && { name: name_2 })), (price !== undefined && { price: price })), (quantity !== undefined && { quantity: quantity })), (isDeleted !== undefined && { isDeleted: isDeleted })), { updatedAt: new Date() }), { new: true })];
            case 1:
                updatedItem = _b.sent();
                if (!updatedItem) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1004],
                        toastMessage: "Inventory item not found",
                    };
                    return [2 /*return*/, next()];
                }
                responseData = updatedItem.toObject();
                delete responseData.isDeleted;
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: responseData,
                    toastMessage: "Item successfully updated",
                };
                return [2 /*return*/, next()];
            case 2:
                error_2 = _b.sent();
                console.error("Error updating inventory:", error_2);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [2 /*return*/, next()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.updateInventory = updateInventory;
var deleteInventory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deletedItem, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1003],
                        toastMessage: "Invalid inventory ID",
                    };
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, inventories_1.InventoryModel.findByIdAndUpdate(id, { isDeleted: true, updatedAt: new Date() }, { new: true })];
            case 1:
                deletedItem = _a.sent();
                if (!deletedItem) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1004],
                        toastMessage: "Inventory item not found",
                    };
                    return [2 /*return*/, next()];
                }
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: "Inventory item marked as deleted",
                    toastMessage: "Item successfully deleted",
                };
                return [2 /*return*/, next()];
            case 2:
                error_3 = _a.sent();
                console.error("Error soft deleting inventory:", error_3);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [2 /*return*/, next()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.deleteInventory = deleteInventory;
var getAll = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, projection, _c, filter, _d, options, _e, search, date, fromDate, toDate, _f, totalCount, tableData, error_4;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                _a = req.body, _b = _a.projection, projection = _b === void 0 ? {} : _b, _c = _a.filter, filter = _c === void 0 ? {} : _c, _d = _a.options, options = _d === void 0 ? {} : _d, _e = _a.search, search = _e === void 0 ? [] : _e, date = _a.date, fromDate = _a.fromDate, toDate = _a.toDate;
                return [4 /*yield*/, (0, aggregation_1.aggregateData)(inventories_1.InventoryModel, filter, projection, options, search, date, fromDate, toDate)];
            case 1:
                _f = _g.sent(), totalCount = _f.totalCount, tableData = _f.tableData;
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: { totalCount: totalCount, tableData: tableData },
                };
                return [2 /*return*/, next()];
            case 2:
                error_4 = _g.sent();
                console.error("Error fetching data:", error_4);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [2 /*return*/, next()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAll = getAll;
var getOne = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
                    return [2 /*return*/, next()];
                }
                return [4 /*yield*/, (0, aggregation_1.aggregateData)(inventories_1.InventoryModel, { _id: new mongoose_1.default.Types.ObjectId(id) }, projection)];
            case 1:
                result = _a.sent();
                if (!result.tableData.length) {
                    req.apiStatus = {
                        isSuccess: false,
                        error: models_1.ErrorCodes[1004],
                        toastMessage: "Record not found or deleted",
                    };
                    return [2 /*return*/, next()];
                }
                req.apiStatus = {
                    isSuccess: true,
                    message: "Success",
                    data: result.tableData[0],
                };
                return [2 /*return*/, next()];
            case 2:
                error_5 = _a.sent();
                console.error("Error fetching record:", error_5);
                req.apiStatus = {
                    isSuccess: false,
                    error: models_1.ErrorCodes[1002],
                    toastMessage: "Something went wrong. Please try again.",
                };
                return [2 /*return*/, next()];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOne = getOne;

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
exports.FeedbackObj = exports.FEEDBACK_STATUS = exports.ResponseObj = exports.StatusCodes = exports.ErrorCodes = void 0;
exports.initializeModels = initializeModels;
var mongoose_1 = require("mongoose");
var patients_1 = require("./patients"); // Correct import
function initializeModels() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            mongoose_1.default.model("patients", patients_1.PatientModel.schema); // Correctly register the model
            console.log("Models initialized");
            return [2 /*return*/];
        });
    });
}
exports.ErrorCodes = {
    // 10XX - Common errors
    1001: {
        message: "Missing mandatory input params",
        errorCode: 1001,
        statusCode: 400,
    },
    1002: {
        message: "Failed to Find Data",
        errorCode: 1002,
        statusCode: 400,
    },
    1003: {
        message: "Failed to Update Data",
        errorCode: 1003,
        statusCode: 400,
    },
    1004: {
        message: "Failed to Delete Data",
        errorCode: 1004,
        statusCode: 400,
    },
    1005: {
        message: "Failed to Add Data",
        errorCode: 1005,
        statusCode: 400,
    },
    1006: {
        message: "Error",
        errorCode: 1006,
        statusCode: 400,
    },
    1007: {
        message: "ses Error",
        errorCode: 1007,
        statusCode: 400,
    },
    1008: {
        message: "Razor Pay Error",
        errorCode: 1008,
        statusCode: 400,
    },
    1009: {
        message: "Whatsapp Error",
        errorCode: 1009,
        statusCode: 400,
    },
    1010: {
        message: "Catch Error",
        errorCode: 1010,
        statusCode: 400,
    },
    1011: {
        message: "Send Otp Error",
        errorCode: 1009,
        statusCode: 400,
    },
    1012: {
        message: "Unauthorized  Error",
        errorCode: 10012,
        statusCode: 401,
    },
    1013: {
        message: "Already Exists",
        errorCode: 10013,
        statusCode: 400,
    },
    // Add other error codes here...
};
exports.StatusCodes = {
    // Bobcat Server Response Codes
    0: {
        message: "OK",
        statusCode: 0,
    },
    // Add other status codes here...
};
var ResponseObj = /** @class */ (function () {
    function ResponseObj(status, message, data, toastMessage) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.toastMessage = toastMessage;
    }
    ResponseObj.prototype.toJson = function () {
        return { status: this.status, message: this.message, data: this.data };
    };
    // public toPlain(): string {
    //   return ⁠ {`${this.status} ${this.message} ${JSON.stringify(this.data)`} ⁠;
    // }
    ResponseObj.prototype.toJsonString = function () {
        return JSON.stringify({
            status: this.status,
            message: this.message,
            data: this.data,
        });
    };
    return ResponseObj;
}());
exports.ResponseObj = ResponseObj;
var FEEDBACK_STATUS;
(function (FEEDBACK_STATUS) {
})(FEEDBACK_STATUS || (exports.FEEDBACK_STATUS = FEEDBACK_STATUS = {}));
// SENT = "SENT",
// FAILED = "FAILED",
var FeedbackObj = /** @class */ (function () {
    function FeedbackObj(status, code, message, retryCount) {
        this.retryCount = 0;
        this.status = status;
        this.message = message;
        this.code = code;
        this.retryCount = retryCount;
    }
    FeedbackObj.prototype.toJson = function () {
        return {
            status: this.status,
            code: this.code,
            message: this.message,
            retryCount: this.retryCount,
        };
    };
    // public toPlain(): string {
    //   return ⁠ ${this.status} ${this.message} ⁠;
    // }
    FeedbackObj.prototype.toJsonString = function () {
        return JSON.stringify({
            status: this.status,
            code: this.code,
            message: this.message,
            retryCount: this.retryCount,
        });
    };
    return FeedbackObj;
}());
exports.FeedbackObj = FeedbackObj;

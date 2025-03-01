"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitPoint = void 0;
var models_1 = require("../models/models");
var logger_1 = require("../logger/v1/logger");
/**
 *
 * @param req
 * @param res
 */
var exitPoint = function (req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var txId = (_a = req.txId) !== null && _a !== void 0 ? _a : "";
    var path = req.baseUrl + req.url;
    var reqData = {
        txId: txId,
        path: path,
    };
    // Include body, query, and params if they exist
    if (req.body) {
        reqData.body = req.body;
    }
    if (req.query) {
        reqData.query = req.query;
    }
    if (req.params) {
        reqData.params = req.params;
    }
    if (req.user) {
        req.user = JSON.parse(JSON.stringify(req.user));
        var user = req.user;
        reqData.userId = String(user._id);
    }
    // Token
    var authorizationHeader = (_b = req.headers.authorization) !== null && _b !== void 0 ? _b : "";
    var parts = authorizationHeader.split(" ");
    var token;
    if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
        token = parts[1];
        reqData.token = token;
    }
    else {
        logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info("Authorization header is not in the expected format");
    }
    reqData.response = (_c = req === null || req === void 0 ? void 0 : req.apiStatus) === null || _c === void 0 ? void 0 : _c.data;
    JSON.stringify(reqData);
    if ((_d = req.apiStatus) === null || _d === void 0 ? void 0 : _d.data) {
        if ((_e = req === null || req === void 0 ? void 0 : req.apiStatus) === null || _e === void 0 ? void 0 : _e.isSuccess) {
            var responseObj = new models_1.ResponseObj(200, "Success", req.apiStatus.data, req.apiStatus.toastMessage);
            res.status(responseObj.status).json(responseObj);
        }
        else {
            var responseObj = new models_1.ResponseObj((_h = (_g = (_f = req.apiStatus) === null || _f === void 0 ? void 0 : _f.error) === null || _g === void 0 ? void 0 : _g.statusCode) !== null && _h !== void 0 ? _h : 500, (_l = (_k = (_j = req.apiStatus) === null || _j === void 0 ? void 0 : _j.error) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : "Unknown error", (_m = req.apiStatus) === null || _m === void 0 ? void 0 : _m.data, (_o = req.apiStatus) === null || _o === void 0 ? void 0 : _o.toastMessage);
            res.status(responseObj.status).json(responseObj);
        }
    }
};
exports.exitPoint = exitPoint;

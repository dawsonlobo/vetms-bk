"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryPoint = void 0;
var Helper = require("../utils/helper");
var entryPoint = function (req, res, next) {
    req.startTime = Date.now();
    req.txId = Helper.generateTransactionId();
    next();
};
exports.entryPoint = entryPoint;

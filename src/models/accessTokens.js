"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessToken = void 0;
var mongoose_1 = require("mongoose");
var AccessTokenSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
}, {
    timestamps: true,
});
exports.AccessToken = (0, mongoose_1.model)("AccessToken", AccessTokenSchema);

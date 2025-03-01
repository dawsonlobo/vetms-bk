"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
var mongoose_1 = require("mongoose");
var OTPSchema = new mongoose_1.Schema(
  {
    userId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);
exports.OTP = (0, mongoose_1.model)("OTP", OTPSchema);

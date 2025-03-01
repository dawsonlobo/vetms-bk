"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
var mongoose_1 = require("mongoose");
// Define the Mongoose Schema
var PaymentSchema = new mongoose_1.Schema(
  {
    appointmentId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "appointments",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      required: true,
    },
    referenceNo: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false }, // Added isDeleted field
  },
  {
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
  },
);
// Export the Mongoose Model
exports.PaymentModel = mongoose_1.default.model("payments", PaymentSchema);

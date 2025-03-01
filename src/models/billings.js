"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModel = void 0;
var mongoose_1 = require("mongoose");
// Define the Mongoose Schema
var BillItemSchema = new mongoose_1.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
});
var BillingSchema = new mongoose_1.Schema(
  {
    patientId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "patients",
      required: true,
    },
    receptionistId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    doctorId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    totalAmount: { type: Number, required: true },
    billItems: { type: [BillItemSchema], required: true },
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
exports.BillingModel = mongoose_1.default.model("billings", BillingSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModel = void 0;
var mongoose_1 = require("mongoose");
var constant_1 = require("../config/constant");
// Define the Mongoose Schema
var AppointmentSchema = new mongoose_1.Schema(
  {
    patientId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "patients",
      required: true,
    },
    doctorId: {
      type: mongoose_1.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    nurseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" }, // Optional field
    receptionistId: { type: mongoose_1.Schema.Types.ObjectId, ref: "users" }, // Newly added optional field
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(constant_1.CONSTANTS.APPOINTMENT_STATUS),
      required: true,
    },
    remarks: { type: String }, // Default value set to an empty string
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
  },
);
// Export the Mongoose Model
exports.AppointmentModel = mongoose_1.default.model(
  "appointments",
  AppointmentSchema,
);

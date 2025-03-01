"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUp = void 0;
var mongoose_1 = require("mongoose");
var FollowUpSchema = new mongoose_1.Schema(
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
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    prescription: { type: String, required: true },
    visitDate: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, bufferCommands: true, versionKey: false },
);
exports.FollowUp = (0, mongoose_1.model)("followUps", FollowUpSchema);

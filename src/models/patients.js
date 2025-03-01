"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModel = void 0;
var mongoose_1 = require("mongoose");
// Define the Mongoose Schema
var PatientSchema = new mongoose_1.Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    dob: { type: Date, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    medicalHistory: { type: [String], required: true },
    bmi: { type: Number, required: true },
    bloodGroup: {
      type: String,
      enum: [
        "DEA 1.1+",
        "DEA 1.1-",
        "DEA 1.2+",
        "DEA 1.2-",
        "DEA 3",
        "DEA 4",
        "DEA 5",
        "DEA 7",
        "A",
        "B",
        "AB",
      ],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
  },
);
exports.PatientModel = mongoose_1.default.model("patients", PatientSchema);

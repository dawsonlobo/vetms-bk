import mongoose, { Document, Schema, Model } from "mongoose";
import { CONSTANTS } from "../config/constant";

/**
 * @swagger
 * components:
 *   schemas:
 *     appointments:
 *       type: object
 *       required:
 *         - patientId
 *         - doctorId
 *         - nurseId
 *         - date
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the appointment
 *           example: "507f1f77bcf86cd799439011"
 *         patientId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the patient for the appointment
 *           example: "60d5ec49f72b4c0015d3b456"
 *         doctorId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the doctor for the appointment
 *           example: "60d5ec49f72b4c0015d3b123"
 *         nurseId:
 *           type: string
 *           format: objectId
 *           nullable: true
 *           description: Unique identifier of the assigned nurse (if applicable)
 *           example: "60d5ec49f72b4c0015d3b789"
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *           example: "2025-03-10"
 *         status:
 *           type: string
 *           enum: 
 *             - PENDING
 *             - CANCELLED
 *             - COMPLETED
 *             - NOT_ATTENDED
 *           description: Status of the appointment
 *           example: "PENDING"
 *         remarks:
 *           type: string
 *           description: Additional comments or notes about the appointment
 *           example: "Patient requested a follow-up next week."
 *           default: ""
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the appointment record is marked as deleted
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the appointment was created
 *           example: "2024-02-19T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the appointment was last updated
 *           example: "2024-02-20T15:45:30Z"
 */

// Define the Appointment Interface
export interface IAppointment {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  nurseId?: mongoose.Types.ObjectId; // Added nurseId (optional)
  date: Date;
  status: keyof typeof CONSTANTS.APPOINTMENT_STATUS; // Updated to use constants dynamically
  remarks?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the interface with Mongoose Document
export interface IAppointmentModel extends IAppointment, Document {}

// Define the Mongoose Schema
const AppointmentSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "patients", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    nurseId: { type: Schema.Types.ObjectId, ref: "users" }, // Optional field
    date: { type: Date, required: true },
    status: { type: String, enum: Object.values(CONSTANTS.APPOINTMENT_STATUS), required: true },
    remarks: { type: String, default: "" }, // Default value set to an empty string
    isDeleted: { type: Boolean, default: false }, 
  },
  {     
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
  } 
);

// Export the Mongoose Model
export const AppointmentModel: Model<IAppointmentModel> = mongoose.model<IAppointmentModel>(
  "appointments",
  AppointmentSchema
);
  
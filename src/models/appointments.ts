import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     appointments:
 *       type: object
 *       required:
 *         - petId
 *         - doctorId
 *         - date
 *         - schedule
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the appointment
 *           example: "507f1f77bcf86cd799439011"
 *         petId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the pet for the appointment
 *           example: "60d5ec49f72b4c0015d3b456"
 *         doctorId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the doctor for the appointment
 *           example: "60d5ec49f72b4c0015d3b123"
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *           example: "2025-03-10"
 *         schedule:
 *           type: string
 *           enum: 
 *             - SCHEDULED
 *             - COMPLETED
 *             - CANCELLED
 *           description: Status of the appointment
 *           example: "SCHEDULED"
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
  petId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  date: Date;
  schedule: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the interface with Mongoose Document
export interface IAppointmentModel extends IAppointment, Document {}

// Define the Mongoose Schema
const AppointmentSchema: Schema = new Schema(
  {
    petId: { type: Schema.Types.ObjectId, ref: "pets", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "doctors", required: true },
    date: { type: Date, required: true },
    schedule: { type: String, enum: ["SCHEDULED", "COMPLETED", "CANCELLED"], required: true },
    isDeleted: { type: Boolean, default: false }, // Added isDeleted field
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Export the Mongoose Model
export const AppointmentModel: Model<IAppointmentModel> = mongoose.model<IAppointmentModel>(
  "appointments",
  AppointmentSchema
);

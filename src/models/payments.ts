import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     payments:
 *       type: object
 *       required:
 *         - appointmentId
 *         - amount
 *         - paymentStatus
 *         - reference_no
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the payment
 *           example: "507f1f77bcf86cd799439011"
 *         appointmentId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the appointment related to the payment
 *           example: "60d5ec49f72b4c0015d3b789"
 *         amount:
 *           type: number
 *           description: Payment amount
 *           example: 1200.50
 *         paymentStatus:
 *           type: string
 *           enum:
 *             - PENDING
 *             - PAID
 *             - CANCELLED
 *           description: Status of the payment
 *           example: "PAID"
 *         reference_no:
 *           type: string
 *           description: Unique reference number for the payment
 *           example: "TXN123456789"
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the payment record is marked as deleted
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment was created
 *           example: "2024-02-19T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the payment was last updated
 *           example: "2024-02-20T15:45:30Z"
 */

// Define the Payment Interface
export interface IPayment {
  appointmentId: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: "PENDING" | "PAID" | "CANCELLED";
  reference_no: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the interface with Mongoose Document
export interface IPaymentModel extends IPayment, Document {}

// Define the Mongoose Schema
const PaymentSchema: Schema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "appointments", required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["PENDING", "PAID", "CANCELLED"], required: true },
    reference_no: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false }, // Added isDeleted field
  },
  { timestamps: true } // Automatically manages createdAt and updatedAt
);

// Export the Mongoose Model
export const PaymentModel: Model<IPaymentModel> = mongoose.model<IPaymentModel>(
  "payments",
  PaymentSchema
);

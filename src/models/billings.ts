import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     billings:
 *       type: object
 *       required:
 *         - petId
 *         - receptionistId
 *         - doctorId
 *         - totalAmount
 *         - billItems
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the bill
 *           example: "507f1f77bcf86cd799439011"
 *         petId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the pet
 *           example: "60d5ec49f72b4c0015d3b456"
 *         receptionistId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the receptionist who processed the bill
 *           example: "60d5ec49f72b4c0015d3b789"
 *         doctorId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the doctor who provided treatment
 *           example: "60d5ec49f72b4c0015d3b123"
 *         totalAmount:
 *           type: number
 *           description: Total amount for the bill
 *           example: 1500.75
 *         billItems:
 *           type: array
 *           description: List of items included in the bill
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the billed item
 *                 example: "X-Ray"
 *               description:
 *                 type: string
 *                 description: Description of the billed item
 *                 example: "X-Ray scan for leg injury"
 *               quantity:
 *                 type: number
 *                 description: Quantity of the billed item
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: Price per unit of the billed item
 *                 example: 500
 *               amount:
 *                 type: number
 *                 description: Total amount for this item (Quantity * Price)
 *                 example: 500
 *         isDeleted:
 *           type: boolean
 *           description: Indicates if the billing record is marked as deleted
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the bill was created
 *           example: "2024-02-19T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the bill was last updated
 *           example: "2024-02-20T15:45:30Z"
 */

// Define the Bill Item Interface
export interface IBillItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

// Define the Billing Interface
export interface IBilling {
  patientId: mongoose.Types.ObjectId;
  receptionistId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  totalAmount: number;
  billItems: IBillItem[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the interface with Mongoose Document
export interface IBillingModel extends IBilling, Document {}

// Define the Mongoose Schema
const BillItemSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const BillingSchema: Schema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "patients", required: true },
    receptionistId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    totalAmount: { type: Number, required: true },
    billItems: { type: [BillItemSchema], required: true },
    isDeleted: { type: Boolean, default: false }, // Added isDeleted field
  },
  {  timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
 } // Automatically manages createdAt and updatedAt
);

// Export the Mongoose Model
export const BillingModel: Model<IBillingModel> = mongoose.model<IBillingModel>(
  "billings",
  BillingSchema
);

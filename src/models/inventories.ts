import mongoose, { Document, Schema, Model } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     inventories:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the inventory item
 *           example: "507f1f77bcf86cd799439011"
 *         name:
 *           type: string
 *           description: Name of the inventory item
 *           example: "Dog Food"
 *         price:
 *           type: number
 *           description: Price of the inventory item
 *           example: 500.75
 *         quantity:
 *           type: number
 *           description: Available quantity of the inventory item
 *           example: 20
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the inventory item was created
 *           example: "2024-02-19T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the inventory item was last updated
 *           example: "2024-02-20T15:45:30Z"
 */

// Define the Inventory Interface
export interface IInventory {
  name: string;
  price: number;
  quantity: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Extend the interface with Mongoose Document
export interface IInventoryModel extends IInventory, Document {}

// Define the Mongoose Schema
const InventorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }, // Added isDeleted field
  },
  {     timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
} // Automatically manages createdAt and updatedAt
);

// Export the Mongoose Model
export const InventoryModel: Model<IInventoryModel> = mongoose.model<IInventoryModel>(
  "inventories",
  InventorySchema
);

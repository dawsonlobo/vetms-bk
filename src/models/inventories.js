"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModel = void 0;
var mongoose_1 = require("mongoose");
// Define the Mongoose Schema
var InventorySchema = new mongoose_1.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
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
exports.InventoryModel = mongoose_1.default.model(
  "inventories",
  InventorySchema,
);

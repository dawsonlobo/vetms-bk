"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: The unique ID of the user
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "Dr. John Smith"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "john.smith@example.com"
 *         password:
 *           type: string
 *           description: Encrypted password of the user
 *           example: "$2b$10$7sPbQKq5b6pP0v9hB1X1euLXjzXq99yI8kTvqzQyQxUIUOJDgN/Nm"  # Hashed password
 *         role:
 *           type: string
 *           enum: [ADMIN, DOCTOR, RECEPTIONIST, NURSE]
 *           description: Role of the user in the system
 *           example: "DOCTOR"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2024-02-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2024-02-06T15:30:00Z"
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var constant_1 = require("../config/constant");
var UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(constant_1.CONSTANTS.USER_ROLE),
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
}, {
    timestamps: true,
    usePushEach: true,
    bufferCommands: true,
    versionKey: false,
});
var UserModel = mongoose_1.default.model("users", UserSchema);
exports.default = UserModel;

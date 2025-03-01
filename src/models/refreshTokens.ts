import { Schema, model, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     refreshToken:
 *       type: object
 *       required:
 *         - userId
 *         - token
 *         - createdAt
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the access token
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the user associated with the token
 *           example: "6512c5f3e4b09a12d8f42b69"
 *         token:
 *           type: string
 *           description: JWT or session token for authentication
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC9..."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the token was created
 *           example: "2024-02-10T12:00:00Z"
 */

export interface IRefreshToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
  },
  { timestamps: true },
);

export const RefreshToken = model<IRefreshToken>(
  "refreshTokens",
  RefreshTokenSchema,
);

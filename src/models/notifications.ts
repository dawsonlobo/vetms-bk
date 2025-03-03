import { Schema, model, Document } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the notification
 *           example: "6512c5f3e4b09a12d8f42b80"
 *         title:
 *           type: string
 *           description: Title of the notification
 *           example: "New Patient Added"
 *         message:
 *           type: string
 *           description: Detailed notification message
 *           example: "A new patient John Doe has been added to the system."
 *         userId:
 *           type: string
 *           format: ObjectId
 *           description: ID of the user receiving the notification (Admin)
 *           example: "6512c5f3e4b09a12d8f42b81"
 *         isRead:
 *           type: boolean
 *           description: Status indicating whether the notification has been read
 *           example: false
 *         isDeleted:
 *           type: boolean
 *           description: Status indicating whether the notification has been deleted
 *           example: false
 *         otherDetails:
 *           type: object
 *           description: Additional details about the notification
 *           example: { "patientName": "John Doe", "appointmentDate": "2024-02-10" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the notification was created
 *           example: "2024-02-10T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the notification was last updated
 *           example: "2024-02-11T15:30:00Z"
 */

export interface INotification extends Document {
  title: string;
  message: string;
  userId: Schema.Types.ObjectId;
  isRead: boolean;
  isDeleted: boolean;
  otherDetails?: object;
  createdAt?: Date;
  updatedAt?: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    otherDetails: { type: Object, default: {} },
  },
  {
    timestamps: true,
    bufferCommands: true,
    versionKey: false,
  }
);

export const Notification = model<INotification>("Notification", NotificationSchema);

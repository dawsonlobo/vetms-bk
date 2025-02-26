import { Schema, model, Document } from "mongoose";
/**
 * @swagger
 * components:
 *   schemas:
 *     followUp:
 *       type: object
 *       required:
 *         - petId
 *         - doctorId
 *         - diagnosis
 *         - treatment
 *         - prescription
 *         - visitDate
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the follow-up record
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         petId:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the pet associated with the follow-up
 *           example: "6512c5f3e4b09a12d8f42b69"
 *         doctorId:
 *           type: string
 *           format: ObjectId
 *           description: Unique ID of the doctor responsible for the follow-up
 *           example: "6512c5f3e4b09a12d8f42b70"
 *         diagnosis:
 *           type: string
 *           description: Diagnosis of the pet's condition
 *           example: "Skin infection due to allergy"
 *         treatment:
 *           type: string
 *           description: Treatment provided to the pet
 *           example: "Antibiotic injection and medicated shampoo"
 *         prescription:
 *           type: string
 *           description: Prescribed medications for the pet
 *           example: "Amoxicillin 250mg, Antihistamines"
 *         visitDate:
 *           type: string
 *           format: date
 *           description: Date of the follow-up visit
 *           example: "2024-02-10"
 *         isDeleted:
 *           type: Boolean
 *           description: Flag indicating whether the follow-up record is deleted
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the follow-up record was created
 *           example: "2024-02-10T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the follow-up record was last updated
 *           example: "2024-02-11T15:30:00Z"
 */

export interface IFollowUp extends Document {
  patientId: Schema.Types.ObjectId;
  doctorId: Schema.Types.ObjectId;
  diagnosis: string;
  treatment: string;
  prescription: string;
  visitDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

const FollowUpSchema: Schema= new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  prescription: { type: String, required: true },
  visitDate: { type: Date, required: true },
  isDeleted: { type: Boolean, default: false },
},{ timestamps: true,
  bufferCommands: true,
  versionKey: false,
});

export const FollowUp = model<IFollowUp>("followUps", FollowUpSchema);

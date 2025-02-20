import mongoose, { Document, Schema, Model } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     patients:
 *       type: object
 *       required:
 *         - name
 *         - species
 *         - breed
 *         - age
 *         - weight
 *         - gender
 *         - medicalHistory
 *         - BMI
 *         - bloodGroup         
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the pet
 *           example: 507f1f77bcf86cd799439011
 *         name:
 *           type: string
 *           description: Name of the pet
 *           example: "Buddy"
 *         species:
 *           type: string
 *           description: Species of the pet
 *           example: "Dog"
 *         breed:
 *           type: string
 *           description: Breed of the pet
 *           example: "Golden Retriever"
 *         age:
 *           type: number
 *           description: Age of the pet in years
 *           example: 3
 *         weight:
 *           type: number
 *           description: Weight of the pet in kilograms
 *           example: 25.5
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE]
 *           description: Gender of the pet
 *           example: "MALE"
 *         medicalHistory:
 *           type: string
 *           description: Medical history of the pet
 *           example: "Vaccinated, No major illnesses"
 *         BMI:
 *           type: number
 *           description: Body Mass Index of the pet
 *           example: 18.2
 *         bloodGroup:
 *           type: string
 *           enum: 
 *             - DEA 1.1+
 *             - DEA 1.1-
 *             - DEA 1.2+
 *             - DEA 1.2-
 *             - DEA 3
 *             - DEA 4
 *             - DEA 5
 *             - DEA 7
 *             - A
 *             - B
 *             - AB
 *           description: Blood group of the pet
 *           example: "DEA 1.1+"
 *         isDeleted:
 *           type: boolean
 *           description: Flag to indicate soft deletion of the pet
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the pet record was created
 *           example: "2024-02-19T12:34:56Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the pet record was last updated
 *           example: "2024-02-20T15:45:30Z"
 */

export interface IPatient {
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: "MALE" | "FEMALE";
  medicalHistory: string;
  BMI: number;
  bloodGroup:
    | "DEA 1.1+"
    | "DEA 1.1-"
    | "DEA 1.2+"
    | "DEA 1.2-"
    | "DEA 3"
    | "DEA 4"
    | "DEA 5"
    | "DEA 7"
    | "A"
    | "B"
    | "AB";
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPatientModel extends IPatient, Document {}

// Define the Mongoose Schema
const PatientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    species: { type: String, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, enum: ["MALE", "FEMALE"], required: true },
    medicalHistory: { type: [String], required: true },
    BMI: { type: Number, required: true },
    bloodGroup: {
      type: String,
      enum: [
        "DEA 1.1+",
        "DEA 1.1-",
        "DEA 1.2+",
        "DEA 1.2-",
        "DEA 3",
        "DEA 4",
        "DEA 5",
        "DEA 7",
        "A",
        "B",
        "AB",
      ],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true ,
    versionKey:false
  },
);

export const PatientModel: Model<IPatientModel> = mongoose.model<IPatientModel>(
  "patients",
  PatientSchema
);

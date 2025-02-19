import mongoose from "mongoose";
import { PatientModel } from "./patients"; // Correct import

export async function initializeModels() {
  mongoose.model("patients", PatientModel.schema); // Correctly register the model
  console.log("Models initialized");
}

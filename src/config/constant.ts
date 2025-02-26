import { AppointmentModel } from "../models/appointments";

export const CONSTANTS = {
    COLLECTIONS: {
      APPOINTMENTS_COLLECTION: "appointments",
      PATIENTS_COLLECTION: "patients",
      USER_COLLECTION: "users"
    },
    APPOINTMENT_STATUS: {
      PENDING: "pending",
      CANCELLED: "cancelled",
      COMPLETED: "completed",
      NOTATTENDED:"not attended"
      
    }
}
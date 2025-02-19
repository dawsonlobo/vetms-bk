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
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     appointments:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the appointment
 *           example: "507f1f77bcf86cd799439011"
 *         petId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the pet for the appointment
 *           example: "60d5ec49f72b4c0015d3b456"
 *         doctorId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the doctor for the appointment
 *           example: "60d5ec49f72b4c0015d3b123"
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the appointment
 *           example: "2025-03-10"
 *         schedule:
 *           type: string
 *           enum: 
 *             - SCHEDULED
 *             - COMPLETED
 *             - CANCELLED
 *           description: Status of the appointment
 *           example: "SCHEDULED"
 */

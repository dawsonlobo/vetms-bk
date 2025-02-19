/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the payment
 *           example: "507f1f77bcf86cd799439011"
 *         appointmentId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the appointment related to the payment
 *           example: "60d5ec49f72b4c0015d3b789"
 *         amount:
 *           type: number
 *           description: Payment amount
 *           example: 1200.50
 *         paymentStatus:
 *           type: string
 *           enum:
 *             - PENDING
 *             - PAID
 *             - CANCELLED
 *           description: Status of the payment
 *           example: "PAID"
 *         reference_no:
 *           type: string
 *           description: Unique reference number for the payment
 *           example: "TXN123456789"
 */

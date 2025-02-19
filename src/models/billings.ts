/**
 * @swagger
 * components:
 *   schemas:
 *     billings:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: Unique identifier for the bill
 *           example: "507f1f77bcf86cd799439011"
 *         petId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the pet
 *           example: "60d5ec49f72b4c0015d3b456"
 *         receptionistId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the receptionist who processed the bill
 *           example: "60d5ec49f72b4c0015d3b789"
 *         doctorId:
 *           type: string
 *           format: objectId
 *           description: Unique identifier of the doctor who provided treatment
 *           example: "60d5ec49f72b4c0015d3b123"
 *         totalAmount:
 *           type: number
 *           description: Total amount for the bill
 *           example: 1500.75
 *         billItems:
 *           type: array
 *           description: List of items included in the bill
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the billed item
 *                 example: "X-Ray"
 *               description:
 *                 type: string
 *                 description: Description of the billed item
 *                 example: "X-Ray scan for leg injury"
 *               quantity:
 *                 type: number
 *                 description: Quantity of the billed item
 *                 example: 1
 *               price:
 *                 type: number
 *                 description: Price per unit of the billed item
 *                 example: 500
 *               amount:
 *                 type: number
 *                 description: Total amount for this item (Quantity * Price)
 *                 example: 500
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     patients:
 *       type: object
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
 */

import { Router } from "express";
import {
  getAll,
  getOne,
} from "../../../controllers/v1/nurse/patients";
import { entryPoint } from "../../../middlewares/entrypoint";
import { exitPoint } from "../../../middlewares/exitpoint";
import { verifyNurse } from "../../../middlewares/auth";
import passport from "../../../passport/passport";
const router = Router();
/**
 * @swagger
 * /v1/nurse/patients/getAllForNurse:
 *   post:
 *     tags:
 *       - nurse/patients
 *     security:
 *       - nurseBearerAuth: []
 *     summary: Get all
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: "object"
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving patients
 *               options:
 *                 type: object
 *                 description: Options for pagination and sorting
 *               pagination:
 *                 type: object
 *                 description: Pagination settings for the response
 *               search:
 *                 type: array
 *                 description: Search settings for the request
 *                 items:
 *                   type: object
 *               date:
 *                 type: integer
 *                 description: The specific date in Unix timestamp format
 *               fromDate:
 *                 type: integer
 *                 description: The starting date in Unix timestamp format
 *               toDate:
 *                 type: integer
 *                 description: The ending date in Unix timestamp format
 *           examples:
 *             projectionExample:
 *               summary: Projection Example
 *               value:
 *                 projection:
 *                   _id: 1
 *                   name: 1
 *                   species: 1
 *                   breed: 1
 *                   age: 1
 *                   weight: 1
 *                   gender: 1
 *                   medicalHistory: 1
 *                   bmi: 1
 *                   bloodGroup: 1
 *             filterExample:
 *                summary: filter example
 *                value:
 *                  filter:
 *                    name: "rammy"
 *             singleDateExample:
 *               summary: Multi-date Example
 *               value:
 *                 date: 1738658701
 *             multiDateExample:
 *               summary: Single-date Example
 *               value:
 *                 fromDate: 1707036301
 *                 toDate: 1738658701
 *             pagination:
 *               summary: Pagination Example
 *               value:
 *                 options:
 *                   page: 1
 *                   itemsPerPage: 10
 *             sortExample:
 *               summary: Sort Example
 *               value:
 *                 options:
 *                   sortBy:
 *                     - "createdAt"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "Golden Retriever"
 *                     fields: ["breed"]
 *                     startsWith: true
 *                     endsWith: false
 *     responses:
 *       200:
 *         description: Get all patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 status:
 *                   type: "integer"
 *                   format: "int64"
 *                 message:
 *                   type: "string"
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     totalCount:
 *                       type: "integer"
 *                       description: Total number of patients
 *                     tableData:
 *                       type: "array"
 *                       items:
 *                         type: "object"
 *                         properties:
 *                           _id:
 *                             type: "string"
 *                             description: The unique ID of the patient
 *                           name:
 *                             type: "string"
 *                             description: The name of the patient
 *                           species:
 *                             type: "string"
 *                             description: The species of the patient
 *                           breed:
 *                             type: "string"
 *                             description: The breed of the patient
 *                           age:
 *                             type: "integer"
 *                             description: The age of the patient
 *                           weight:
 *                             type: "number"
 *                             format: "float"
 *                             description: The weight of the patient
 *                           gender:
 *                             type: "string"
 *                             enum: ["MALE", "FEMALE"]
 *                             description: The gender of the patient
 *                           medicalHistory:
 *                             type: "string"
 *                             description: The medical history of the patient
 *                           BMI:
 *                             type: "number"
 *                             format: "float"
 *                             description: The BMI of the patient
 *                           bloodGroup:
 *                             type: "string"
 *                             enum: ["DEA 1.1+", "DEA 1.1-", "DEA 1.2+", "DEA 1.2-", "DEA 3", "DEA 4", "DEA 5", "DEA 7", "A", "B", "AB"]
 *                             description: The blood group of the patient
 *                           createdAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the patient record was created
 *                           updatedAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the patient record was last updated
 *             examples:
 *               example1:
 *                 summary: "Successful response with data"
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     totalCount: 2
 *                     tableData:
 *                     -   _id: "66b3279c39c21f7342c125b4"
 *                         name: "Buddy"
 *                         species: "Dog"
 *                         breed: "Golden Retriever"
 *                         age: 5
 *                         weight: 30.5
 *                         gender: "MALE"
 *                         medicalHistory: "No known issues"
 *                         bmi: 24.7
 *                         bloodGroup: "DEA 1.1+"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c1520n"
 *                         name: "Mittens"
 *                         species: "Cat"
 *                         breed: "Persian"
 *                         age: 3
 *                         weight: 4.8
 *                         gender: "FEMALE"
 *                         medicalHistory: "Allergic to certain foods"
 *                         bmi: 22.1
 *                         bloodGroup: "A"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 */
router.post(
  "/getAllForNurse",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyNurse,
  getAll,
  exitPoint
);
/**
 * @swagger
 * /v1/nurse/patients/getOneForNurse/{id}:
 *   post:
 *     tags:
 *       - nurse/patients
 *     security:
 *       - nurseBearerAuth: []
 *     summary: Get one
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the patient to retrieve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project:
 *                 type: object
 *                 description: Fields to include or exclude in the response
 *           examples:
 *             projectionExample:
 *               summary: Example with projection
 *               value:
 *                 projection:
 *                   _id: 1
 *                   name: 1
 *     responses:
 *       200:
 *         description: Get one patient.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   format: int64
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                          _id:
 *                            type: string
 *                            description: The unique ID of the patient
 *                          name:
 *                            type: string
 *                            description: The name of the patient
 *                          species:
 *                            type: string
 *                            description: The species of the patient
 *                          breed:
 *                            type: string
 *                            description: The breed of the patient
 *                          age:
 *                            type: integer
 *                            description: The age of the patient
 *                          weight:
 *                            type: number
 *                            format: float
 *                            description: The weight of the patient
 *                          gender:
 *                            type: string
 *                            enum: ["MALE", "FEMALE"]
 *                            description: The gender of the patient
 *                          medicalHistory:
 *                            type: array
 *                            items:
 *                              type: string
 *                            description: The medical history of the patient
 *                          BMI:
 *                            type: number
 *                            format: float
 *                            description: The BMI of the patient
 *                          bloodGroup:
 *                            type: string
 *                            enum: ["DEA 1.1+", "DEA 1.1-", "DEA 1.2+", "DEA 1.2-", "DEA 3", "DEA 4", "DEA 5", "DEA 7", "A", "B", "AB"]
 *                            description: The blood group of the patient
 *                          createdAt:
 *                            type: string
 *                            format: date-time
 *                            description: Timestamp when the patient record was created
 *                          updatedAt:
 *                            type: string
 *                            format: date-time
 *                            description: Timestamp when the patient record was last updated
 *             examples:
 *               get-one-patient:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "66b3279c39c21f7342c1520p"
 *                     name: "Buddy"
 *                     species: "Dog"
 *                     breed: "Labrador Retriever"
 *                     age: 5
 *                     weight: 30.5
 *                     gender: "MALE"
 *                     medicalHistory: "Vaccinated, No known allergies"
 *                     BMI: 23.4
 *                     bloodGroup: "DEA 1.1+"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */

router.post(
  "/getOneForNurse/:id",
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  getOne,
  exitPoint
);
export default router;

import { Router } from "express";
import {
  createUpdate,
  getAll,
  getOne,
} from "../../../controllers/v1/receptionist/patients";
import { exitPoint } from "../../../middlewares/exitpoint";
import { entryPoint } from "../../../middlewares/entrypoint";
import { verifyReceptionist } from "../../../middlewares/auth";
import passport from "../../../passport/passport";
const router = Router();

/**
 * @swagger
 * /v1/receptionist/patients/createupdate:
 *   post:
 *     tags:
 *       - receptionist/patients
 *     summary: Create or update a patient record
 *     description: This endpoint allows the receptionist to create a new patient record or update an existing one based on the provided `_id`.
 *     security:
 *       - adminBearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - species
 *               - breed
 *               - dob
 *               - weight
 *               - gender
 *               - medicalHistory
 *               - bmi
 *               - bloodGroup
 *             properties:
 *                _id:
 *                  type: string
 *                  description: The unique ID of the patient (only required for updates)
 *                name:
 *                  type: string
 *                  description: Name of the patient
 *                species:
 *                  type: string
 *                  description: Species of the patient (e.g., Dog, Cat)
 *                breed:
 *                  type: string
 *                  description: Breed of the patient
 *                dob:
 *                  type: string
 *                  format: date
 *                  description: Date of birth of the patient (YYYY-MM-DD)
 *                weight:
 *                  type: number
 *                  description: Weight of the patient in kg
 *                gender:
 *                  type: string
 *                  enum: [MALE, FEMALE]
 *                  description: Gender of the patient
 *                medicalHistory:
 *                  type: array
 *                  items:
 *                    type: string
 *                  description: List of past medical conditions
 *                bmi:
 *                  type: number
 *                  description: BMI of the patient
 *                bloodGroup:
 *                  type: string
 *                  enum:
 *                    - DEA 1.1+
 *                    - DEA 1.1-
 *                    - DEA 1.2+
 *                    - DEA 1.2-
 *                    - DEA 3
 *                    - DEA 4
 *                    - DEA 5
 *                    - DEA 7
 *                    - A
 *                    - B
 *                    - AB
 *                  description: Blood group of the patient
 *                isDeleted:
 *                  type: boolean
 *                  description: Whether the patient record is deleted
 *           examples:
 *             createPatient:
 *               summary: Example request body for creating a patient
 *               value:
 *                 name: "Buddy"
 *                 species: "Dog"
 *                 breed: "Golden Retriever"
 *                 dob: "2019-06-15"
 *                 weight: 30
 *                 gender: "MALE"
 *                 medicalHistory:
 *                   - "Vaccinated"
 *                   - "Hip Dysplasia"
 *                 bmi: 22.5
 *                 bloodGroup: "DEA 1.1+"
 *             updatePatient:
 *               summary: Example request body for updating a patient
 *               value:
 *                 _id: "66b3279c39c21f7342c100c4"
 *                 name: "Buddy"
 *                 species: "Dog"
 *                 breed: "Golden Retriever"
 *                 dob: "2018-04-20"
 *                 weight: 32
 *                 gender: "MALE"
 *                 medicalHistory:
 *                   - "Vaccinated"
 *                   - "Hip Dysplasia"
 *                   - "Arthritis"
 *                 bmi: 23.0
 *                 bloodGroup: "DEA 1.1+"
 *     responses:
 *       200:
 *         description: Patient record created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   format: int64
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Message describing the result of the operation
 *                 data:
 *                   type: object
 *                   description: The created or updated patient record
 *                 toastMessage:
 *                   type: string
 *                   description: The message that is sent
 *             examples:
 *               createExample:
 *                 summary: Successful response for creating a patient
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Patient added successfully"
 *                   toastMessage: "Patient added successfully"
 *               updateExample:
 *                 summary: Successful response for updating a patient
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Patient record updated successfully"
 *                   toastMessage: "Patient record updated successfully"
 */

router.post(
  "/createupdate",
  entryPoint,
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyReceptionist,
  createUpdate,
  exitPoint,
);
/**
 * @swagger
 * /v1/receptionist/patients/getAll:
 *   post:
 *     tags:
 *       - receptionist/patients
 *     security:
 *       - adminBearerAuth: []
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
 *                   dob: 1
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
 *                           dob:
 *                             type: "string"
 *                             format: "date"
 *                             description: The date of the patient
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
 *                           bmi:
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
 *                         dob: "2020-05-15"
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
 *                         dob: "2022-09-10"
 *                         weight: 4.8
 *                         gender: "FEMALE"
 *                         medicalHistory: "Allergic to certain foods"
 *                         bmi: 22.1
 *                         bloodGroup: "A"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 */
router.post(
  "/getAll",
  entryPoint,
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyReceptionist,
  getAll,
  exitPoint,
);

/**
 * @swagger
 * /v1/receptionist/patients/getOne/{id}:
 *   post:
 *     tags:
 *       - receptionist/patients
 *     security:
 *       - adminBearerAuth: []
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
 *                          dob:
 *                            type: string
 *                            format: date
 *                            description: The date of the patient
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
 *                          bmi:
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
 *                     dob: 5
 *                     weight: 30.5
 *                     gender: "MALE"
 *                     medicalHistory: "Vaccinated, No known allergies"
 *                     BMI: 23.4
 *                     bloodGroup: "DEA 1.1+"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */

router.post(
  "/getOne/:id",
  entryPoint,
  entryPoint,
  passport.authenticate("bearer", { session: false }),
  verifyReceptionist,
  getOne,
  exitPoint,
);
export default router;

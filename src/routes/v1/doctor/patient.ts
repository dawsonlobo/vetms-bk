import { Router,Request,Response, NextFunction } from 'express';
import * as patients from '../../../controllers/v1/doctor/patient'
const router = Router();
import { exitPoint } from '../../../middlewares/exitpoint';
import { entryPoint } from '../../../middlewares/entrypoint';





/**
 * @swagger
 * /v1/doctor/patients/getOne/{id}:
 *   post:
 *     summary: Get one patient 
 *     tags: 
 *        - doctor/patients
 *     security:
 *       - doctorBearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the follow-up record to retrieve
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
 *                   species: 1
 *                   breed: 1
 *                   age: 1
 *                   weight: 1
 *                   gender: 1
 *                   medicalHistory: 1
 *                   bloodGroup: 1
 *                   bmi: 1
 *     responses:
 *       200:
 *         description: Get one follow-up record.
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
 *                     _id:
 *                       type: string
 *                       format: objectId
 *                       description: Unique identifier for the pet
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       description: Name of the pet
 *                       example: "Buddy"
 *                     species:
 *                       type: string
 *                       description: Species of the pet
 *                       example: "Dog"
 *                     breed:
 *                       type: string
 *                       description: Breed of the pet
 *                       example: "Golden Retriever"
 *                     DOB:
 *                       type: string
 *                       format: date
 *                       description: Date of birth of the patient
 *                       example: "1990-05-15"
 *                     weight:
 *                       type: number
 *                       description: Weight of the pet in kilograms
 *                       example: 25.5
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE]
 *                       description: Gender of the pet
 *                       example: "MALE"
 *                     medicalHistory:
 *                       type: string
 *                       description: Medical history of the pet
 *                       example: "Vaccinated, No major illnesses"
 *                     BMI:
 *                       type: number
 *                       description: Body Mass Index of the pet
 *                       example: 18.2
 *                     bloodGroup:
 *                       type: string
 *                       enum: 
 *                         - DEA 1.1+
 *                         - DEA 1.1-
 *                         - DEA 1.2+
 *                         - DEA 1.2-
 *                         - DEA 3
 *                         - DEA 4
 *                         - DEA 5
 *                         - DEA 7
 *                         - A
 *                         - B
 *                         - AB
 *                       description: Blood group of the pet
 *                       example: "DEA 1.1+"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the pet record was created
 *                       example: "2024-02-19T12:34:56Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the pet record was last updated
 *                       example: "2024-02-20T15:45:30Z"
 *             examples:
 *               get-one-followup:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "6512c5f3e4b09a12d8f42b68"
 *                     name: "Buddy"
 *                     species: "Dog"
 *                     breed: "Golden Retriever"
 *                     DOB: "1990-05-15"
 *                     weight: 25.5
 *                     gender: "MALE"
 *                     medicalHistory: "Vaccinated, No major illnesses"
 *                     BMI: 18.2
 *                     bloodGroup: "DEA 1.1+"
 *                     createdAt: "2024-02-19T12:34:56Z"
 *                     updatedAt: "2024-02-20T15:45:30Z"
 */

router.post("/getone/:id",entryPoint,patients.getOne,exitPoint);



/**
 * @swagger
 * /v1/doctor/patients/getall:
 *   post:
 *     tags: 
 *       - doctor/patients
 *     summary: Get all appointments
 *     security:
 *       - doctorBearerAuth: []  # Requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving follow-ups
 *               options:
 *                 type: object
 *                 description: Options for pagination and sorting
 *               pagination:
 *                 type: object
 *                 description: Pagination settings
 *               search:
 *                 type: array
 *                 description: Search settings for the request
 *                 items:
 *                   type: object
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Specific date filter
 *               fromDate:
 *                 type: string
 *                 format: date-time
 *                 description: Starting date filter
 *               toDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ending date filter
 *           examples:
 *             projection:
 *               summary: Projection Example
 *               value:
 *                 projection:
 *                   name: 1
 *                   species: 1
 *             date:
 *               summary: Using Single Date Filter
 *               value:
 *                 date: 1738758000  # Epoch timestamp for 2025-02-05T07:00:00Z
 *             dateRange:
 *               summary: Using Date Range Filter (Epoch Time)
 *               value:
 *                 fromDate: 1738368000  # Epoch timestamp for 2025-02-01T00:00:00Z
 *                 toDate: 1739222399  # Epoch timestamp for 2025-02-10T23:59:59Z
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
 *                     - "date"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "FEMALE"
 *                     fields: ["gender"]
 *                     startsWith: true
 *     responses:
 *       200:
 *         description: Get all follow-ups.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   format: int64
 *                   description: Status code
 *                   example: 200
 *                 message:
 *                   type: string
 *                   description: Response message
 *                   example: "Success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of follow-ups
 *                     tableData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             format: ObjectId
 *                             description: Unique ID of the follow-up record
 *                           name:
 *                             type: string
 *                             description: Name of the pet
 *                             example: "Buddy"
 *                           species:
 *                             type: string
 *                             description: Species of the pet
 *                             example: "Dog"
 *                           breed:
 *                             type: string
 *                             description: Breed of the pet
 *                             example: "Golden Retriever"
 *                           DOB:
 *                             type: string
 *                             format: date
 *                             description: Date of birth of the patient
 *                             example: "1990-05-15"
 *                           weight:
 *                             type: number
 *                             description: Weight of the pet in kilograms
 *                             example: 25.5
 *                           gender:
 *                             type: string
 *                             enum: [MALE, FEMALE]
 *                             description: Gender of the pet
 *                             example: "MALE"
 *                           medicalHistory:
 *                             type: string
 *                             description: Medical history of the pet
 *                             example: "Vaccinated, No major illnesses"
 *                           BMI:
 *                             type: number
 *                             description: Body Mass Index of the pet
 *                             example: 18.2
 *                           bloodGroup:
 *                             type: string
 *                             enum: 
 *                               - DEA 1.1+
 *                               - DEA 1.1-
 *                               - DEA 1.2+
 *                               - DEA 1.2-
 *                               - DEA 3
 *                               - DEA 4
 *                               - DEA 5
 *                               - DEA 7
 *                               - A
 *                               - B
 *                               - AB
 *                             description: Blood group of the pet
 *                             example: "DEA 1.1+"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the pet record was created
 *                             example: "2024-02-19T12:34:56Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the pet record was last updated
 *                             example: "2024-02-20T15:45:30Z"
 *             examples:
 *               example1:
 *                 summary: "Successful response with follow-up data"
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
 *                         DOB: "1990-05-15"
 *                         weight: 25.5
 *                         gender: "MALE"
 *                         medicalHistory: "Vaccinated, No major illnesses"
 *                         BMI: 18.2
 *                         bloodGroup: "DEA 1.1+"
 *                         createdAt: "2024-02-19T12:34:56Z"
 *                         updatedAt: "2024-02-20T15:45:30Z"
 *                     -   _id: "65f1c4a58e4c3d1a8b9f2c72"
 *                         name: "Buddy"
 *                         species: "Cat"
 *                         breed: "Golden Retriever"
 *                         DOB: "1990-05-15"
 *                         weight: 25.5
 *                         gender: "MALE"
 *                         medicalHistory: "Vaccinated, No major illnesses"
 *                         BMI: 18.2
 *                         bloodGroup: "DEA 1.1+"
 *                         createdAt: "2024-02-19T12:34:56Z"
 *                         updatedAt: "2024-02-20T15:45:30Z"
 */
router.post("/getall",entryPoint,patients.getAll,exitPoint);



/**
 * @swagger
 * /v1/doctor/patients/update/{_id}:
 *   post:
 *     tags:
 *       - doctor/patients
 *     summary: Update an appointment record
 *     security:
 *       - doctorBearerAuth: []  # Requires a bearer token for this route
 *     parameters:
 *       - in: path
 *         name: _id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the appointment to retrieve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Weight of the pet in kilograms
 *                 example: 25.5
 *               BMI:
 *                 type: number
 *                 description: Body Mass Index of the pet
 *                 example: 18.2
 *               medicalHistory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Medical history of the pet
 *                 example: ["Vaccinated", "No major illnesses"]
 *           examples:
 *             updateAppointment:
 *               summary: Example request body for updating an appointment
 *               value:
 *                 weight: 25.5
 *                 BMI: 18.2
 *                 medicalHistory: ["Vaccinated", "No major illnesses"]
 *     responses:
 *       200:
 *         description: Appointment record created/updated successfully
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
 *                   description: The created or updated appointment record
 *                 toastMessage:
 *                   type: string
 *                   description: The message that is sent
 *             examples:
 *               updateExample:
 *                 summary: Successful response for updating an appointment
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Appointment record updated successfully"
 *                   toastMessage: "Appointment record updated successfully"
 */

router.post("/update/:_id",entryPoint,patients.Update,exitPoint);


export default router;
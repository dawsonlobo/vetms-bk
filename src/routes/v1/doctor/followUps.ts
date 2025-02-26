import { Router,Request,Response, NextFunction } from 'express';
import * as followUp from '../../../controllers/v1/doctor/followUps'
const router = Router();


/**
 * @swagger
 *paths:
 *  /v1/doctor/followUps/create:
 *    post:
 *      summary: Create a new follow-up record
 *      tags: 
 *        - doctor/followups
 *      security:
 *        - doctorBearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - patientId
 *                - doctorId
 *                - diagnosis
 *                - treatment
 *                - prescription
 *                - visitDate
 *              properties:
 *                patientId:
 *                  type: string
 *                  format: ObjectId
 *                  description: Unique ID of the pet associated with the follow-up
 *                doctorId:
 *                  type: string
 *                  format: ObjectId
 *                  description: Unique ID of the doctor responsible for the follow-up
 *                diagnosis:
 *                  type: string
 *                  description: Diagnosis of the pet's condition
 *                treatment:
 *                  type: string
 *                  description: Treatment provided to the pet
 *                prescription:
 *                  type: string
 *                  description: Prescribed medications for the pet
 *                visitDate:
 *                  type: string
 *                  format: date
 *                  description: Date of the follow-up visit
 *            examples:
 *              Example 1:
 *                summary: Example of a follow-up record
 *                value:
 *                  patientId: "67b6c39098c669e6c66adef8"
 *                  doctorId: "67bbfed74cea23da08bb62a6"
 *                  diagnosis: "Skin infection due to allergy"
 *                  treatment: "Antibiotic injection and medicated shampoo"
 *                  prescription: "Amoxicillin 250mg, Antihistamines"
 *                  visitDate: "2024-02-10"
 *              Example 2:
 *                summary: Another example of a follow-up record
 *                value:
 *                  patientId: "6512c5f3e4b09a12d8f42b80"
 *                  doctorId: "6512c5f3e4b09a12d8f42b81"
 *                  diagnosis: "Ear infection"
 *                  treatment: "Ear drops and pain relief medication"
 *                  prescription: "Otibiotic ointment, Ibuprofen"
 *                  visitDate: "2024-03-15"
 *      responses:
 *        201:
 *          description: Follow-up record created successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: integer
 *                    format: int64
 *                    description: Status code
 *                  message:
 *                    type: string
 *                    description: Message describing the result of the operation
 *                  data:
 *                    type: string
 *                    description: The response data
 *                  toastMessage:
 *                    type: string
 *                    description: The toast message
 *              examples:
 *                example1:
 *                  summary: Successful follow-up record creation response
 *                  value:
 *                    status: 201
 *                    message: "Success"
 *                    data: "Follow-up record created successfully"
 *                    toastMessage: "Follow-up recorded successfully"
 */



router.post("/create",followUp.createFollowUp);

/**
 * @swagger
 * /v1/admin/followUps/getOne/{id}:
 *   post:
 *     summary: Get one follow-up 
 *     tags: 
 *        - doctor/followups
 *     security:
 *       - adminBearerAuth: []  # Requires a bearer token
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
 *                   patientId: 1
 *                   diagnosis: 1
 *                   createdAt: 1
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
 *                       format: ObjectId
 *                       description: Unique ID of the follow-up record
 *                     patientId:
 *                       type: string
 *                       format: ObjectId
 *                       description: Unique ID of the pet associated with the follow-up
 *                     doctorId:
 *                       type: string
 *                       format: ObjectId
 *                       description: Unique ID of the doctor responsible for the follow-up
 *                     diagnosis:
 *                       type: string
 *                       description: Diagnosis of the pet's condition
 *                     treatment:
 *                       type: string
 *                       description: Treatment provided to the pet
 *                     prescription:
 *                       type: string
 *                       description: Prescribed medications for the pet
 *                     visitDate:
 *                       type: string
 *                       format: date
 *                       description: Date of the follow-up visit
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the follow-up record was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the follow-up record was last updated
 *             examples:
 *               get-one-followup:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "6512c5f3e4b09a12d8f42b68"
 *                     patientId: "6512c5f3e4b09a12d8f42b69"
 *                     doctorId: "6512c5f3e4b09a12d8f42b70"
 *                     diagnosis: "Skin infection due to allergy"
 *                     treatment: "Antibiotic injection and medicated shampoo"
 *                     prescription: "Amoxicillin 250mg, Antihistamines"
 *                     visitDate: "2024-02-10"
 *                     createdAt: "2024-02-10T12:00:00Z"
 *                     updatedAt: "2024-02-11T15:30:00Z"
 */




router.post("/getone",followUp.getOne);



/**
 * @swagger
 * /v1/doctor/followups/delete/{id}:
 *   post:
 *     summary: Delete a follow-up record
 *     tags: 
 *       - doctor/followups
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the follow-up record to be deleted
 *     responses:
 *       200:
 *         description: Follow-up record deleted successfully
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
 *                   type: string
 *                   description: The response data
 *                 toastMessage:
 *                   type: string
 *                   description: The toast message
 *             example:
 *               status: 200
 *               message: "Success"
 *               data: "Follow-up record deleted successfully"
 *               toastMessage: "Follow-up successfully deleted"
 *       404:
 *         description: Follow-up record not found or already deleted
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
 *                 error:
 *                   type: string
 *             example:
 *               status: 404
 *               message: "error"
 *               error: "Follow-up record not found or already deleted"
 */

router.post("/delete/:id",followUp.deleteFollowUp);


/**
 * @swagger
 * /v1/admin/followUps/getall:
 *   post:
 *     tags: 
 *       - doctor/followups
 *     summary: Get all follow-ups
 *     security:
 *       - adminBearerAuth: []  # Requires authentication
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
 *                   petId: 1
 *                   doctorId: 1
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
 *                     - "visitDate"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "diagnosis"
 *                     fields: ["diagnosis", "treatment"]
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
 *                             description: Unique follow-up ID
 *                           petId:
 *                             type: string
 *                             description: Pet ID
 *                           doctorId:
 *                             type: string
 *                             description: Doctor ID
 *                           diagnosis:
 *                             type: string
 *                             description: Diagnosis details
 *                           treatment:
 *                             type: string
 *                             description: Treatment details
 *                           prescription:
 *                             type: string
 *                             description: Prescription given
 *                           visitDate:
 *                             type: string
 *                             format: date-time
 *                             description: Visit date timestamp
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Follow-up creation timestamp
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Last updated timestamp
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
 *                         petId: "66b3279c39c21f7342c125b4"
 *                         doctorId: "66b3279c39c21f7342c152c5"
 *                         diagnosis: "Flu"
 *                         treatment: "Rest and fluids"
 *                         prescription: "Vitamin C supplements"
 *                         visitDate: "2025-02-05T07:00:00Z"
 *                         createdAt: "2025-02-05T07:30:00Z"
 *                         updatedAt: "2025-02-06T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c152c5"
 *                         petId: "65a3279c39c21f7342c125b4"
 *                         doctorId: "65b437ac48d21e8343d256c7"
 *                         diagnosis: "Skin Infection"
 *                         treatment: "Antibiotic cream"
 *                         prescription: "Apply twice daily"
 *                         visitDate: "2025-02-06T10:15:00Z"
 *                         createdAt: "2025-02-06T11:00:00Z"
 *                         updatedAt: "2025-02-06T12:30:00Z"
 */

router.post("/getall",followUp.getAll);

export default router;
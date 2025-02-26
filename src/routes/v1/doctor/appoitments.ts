import { Router,Request,Response, NextFunction } from 'express';
import * as appointment from '../../../controllers/v1/doctor/appointments'
const router = Router();





/**
 * @swagger
 * /v1/doctor/appointments/update/{_id}:
 *   post:
 *     tags:
 *       - doctor/appointments
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
 *               - patientId
 *               - doctorId
 *               - date
 *               - status
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the pet for the appointment
 *               doctorId:
 *                 type: string
 *                 description: The ID of the doctor assigned to the appointment
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The scheduled date and time of the appointment
 *               status:
 *                 type: string
 *                 enum: [SCHEDULED, COMPLETED, CANCELLED]
 *                 description: Status of the appointment
 *           examples:
 *             updateAppointment:
 *               summary: Example request body for updating an appointment
 *               value:
 *                 patientId: "66b3279c39c21f7342c100c4"
 *                 doctorId: "66b3279c39c21f7342c100c5"
 *                 date: "2025-03-05T14:00:00.000Z"
 *                 status: "COMPLETED"
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

router.post("/update/:_id",appointment.Update);




/**
 * @swagger
 * /v1/doctor/appointments/getOne/{id}:
 *   post:
 *     summary: Get one appointment 
 *     tags: 
 *        - doctor/appointments
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
 *                   petId: 1
 *                   doctorId: 1
 *                   date: 1
 *                   status: 1
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
 *                     petId:
 *                       type: string
 *                       format: ObjectId
 *                       description: Unique ID of the pet associated with the follow-up
 *                     doctorId:
 *                       type: string
 *                       format: ObjectId
 *                       description: Unique ID of the doctor responsible for the follow-up
 *                     date:
 *                       type: string
 *                       description: Diagnosis of the pet's condition
 *                     status:
 *                       type: string
 *                       description: Treatment provided to the pet
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
 *                     petId: "6512c5f3e4b09a12d8f42b69"
 *                     doctorId: "6512c5f3e4b09a12d8f42b70"
 *                     date: 2025-03-01T10:00:00.000+00:00
 *                     status: "SCHEDULED"
 *                     createdAt: "2024-02-10T12:00:00Z"
 *                     updatedAt: "2024-02-11T15:30:00Z"
 */

router.post("/getone/:id",appointment.getOne);




/**
 * @swagger
 * /v1/doctor/appointments/getall:
 *   post:
 *     tags: 
 *       - doctor/appointments
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
 *                     - "date"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "CANCELLED"
 *                     fields: ["status"]
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
 *                           petId:
 *                             type: string
 *                             format: ObjectId
 *                             description: Unique ID of the pet associated with the follow-up
 *                           doctorId:
 *                             type: string
 *                             format: ObjectId
 *                             description: Unique ID of the doctor responsible for the follow-up
 *                           date:
 *                             type: string
 *                             description: Diagnosis of the pet's condition
 *                           status:
 *                             type: string
 *                             enum: [SCHEDULED, COMPLETED, CANCELLED]
 *                             description: Treatment provided to the pet
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the follow-up record was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the follow-up record was last updated
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
 *                         petId: "6512c5f3e4b09a12d8f42b69"
 *                         doctorId: "6512c5f3e4b09a12d8f42b70"
 *                         date: 2025-03-01T10:00:00.000+00:00
 *                         status: "SCHEDULED"
 *                         createdAt: "2024-02-10T12:00:00Z"
 *                         updatedAt: "2024-02-11T15:30:00Z" 
 *                     -   _id: "67b9b29b0b78abeac1a39dbb"
 *                         petId: "6512c5f3e4b09a12d8f42b69"
 *                         doctorId: "6512c5f3e4b09a12d8f42b70"
 *                         date: 2025-03-01T10:00:00.000+00:00
 *                         status: "CANCELLED"
 *                         createdAt: "2024-02-10T12:00:00Z"
 *                         updatedAt: "2024-02-11T15:30:00Z" 
 */

router.post("/getall",appointment.getAll);




export default router;
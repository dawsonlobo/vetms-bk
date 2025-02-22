import { Router,Request,Response } from 'express';
import { getAll, getOne } from '../../../controllers/v1/admin/payments';
const router = Router()

/**
 * @swagger
 * /v1/admin/payments/getAll:
 *   post:
 *     tags:
 *       - admin/payments
 *     security:
 *       - adminBearerAuth: []
 *     summary: Get all 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include in the response (projection)
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving payments
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
 *                   appointmentId: 1
 *                   amount: 1
 *                   paymentStatus: 1
 *                   referenceNo: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *             singleDateExample:
 *               summary: Single-date Example
 *               value:
 *                 date: 1738658701
 *             multiDateExample:
 *               summary: Multi-date Example
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
 *                   - term: "PAID"
 *                     fields: ["paymentStatus"]
 *                     startsWith: true
 *     responses:
 *       200:
 *         description: Get all payments.
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
 *                     totalCount:
 *                       type: integer
 *                       description: Total number of payments
 *                     tableData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The unique ID of the payment
 *                           appointmentId:
 *                             type: string
 *                             description: The appointment ID associated with the payment
 *                           amount:
 *                             type: number
 *                             format: float
 *                             description: The payment amount
 *                           paymentStatus:
 *                             type: string
 *                             enum: ["PENDING", "PAID", "CANCELLED"]
 *                             description: The payment status
 *                           reference_no:
 *                             type: string
 *                             description: The payment reference number
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the payment record was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Timestamp when the payment record was last updated
 *             examples:
 *               example1:
 *                 summary: Successful response with data
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     totalCount: 2
 *                     tableData:
 *                     -   _id: "66b3279c39c21f7342c125b4"
 *                         appointmentId: "66b3279c39c21f7342c12000"
 *                         amount: 100.5
 *                         paymentStatus: "PAID"
 *                         referenceNo: "PAY123456"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c1520n"
 *                         appointmentId: "66b3279c39c21f7342c12001"
 *                         amount: 200.0
 *                         paymentStatus: "PENDING"
 *                         reference_no: "PAY789012"
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 */
router.post('/getAll',
   // passport.authenticate('bearer', { session: false }),
    getAll,
    //exitPoint
    );
/**
 * @swagger
 * /v1/admin/payments/getOne/{id}:
 *   post:
 *     tags:
 *       - admin/payments
 *     security:
 *       - adminBearerAuth: []
 *     summary: Get one
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the payment to retrieve
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
 *                 project:
 *                   _id: 1
 *                   amount: 1
 *     responses:
 *       200:
 *         description: Get one payment.
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
 *                       description: The unique ID of the payment
 *                     appointmentId:
 *                       type: string
 *                       description: The appointment ID related to the payment
 *                     amount:
 *                       type: number
 *                       format: float
 *                       description: The payment amount
 *                     paymentStatus:
 *                       type: string
 *                       enum: ["PENDING", "PAID", "CANCELLED"]
 *                       description: The status of the payment
 *                     reference_no:
 *                       type: string
 *                       description: Reference number for the payment
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the payment record was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the payment record was last updated
 *             examples:
 *               get-one-payment:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "66b3279c39c21f7342c1520p"
 *                     appointmentId: "66b3279c39c21f7342c1abc3"
 *                     amount: 1500.50
 *                     paymentStatus: "PAID"
 *                     reference_no: "PAY123456789"
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */
router.post('/getOne/:id',
    // passport.authenticate('bearer', { session: false }),
     getOne,
     //exitPoint
     );
 export default router;
/**
 * @swagger
 * /v1/admin/billings/all:
 *   post:
 *     tags:
 *       - admin/billings
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
 *                 description: Filters to apply when retrieving billings
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
 *                 project:
 *                   _id: 1
 *                   petId: 1
 *                   receptionistId: 1
 *                   doctorId: 1
 *                   totalAmount: 1
 *                   billItems: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *             singleDateExample:
 *               summary: Single Date Example
 *               value:
 *                 date: 1738658701
 *             multiDateExample:
 *               summary: Multi-Date Example
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
 *                   - term: "5000"
 *                     fields: ["totalAmount"]
 *                     startsWith: true
 *     responses:
 *       200:
 *         description: Get all billings.
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
 *                       description: Total number of billings
 *                     tableData:
 *                       type: "array"
 *                       items:
 *                         type: "object"
 *                         properties:
 *                           _id:
 *                             type: "string"
 *                             description: The unique ID of the billing record
 *                           petId:
 *                             type: "string"
 *                             description: The ID of the pet associated with the billing
 *                           receptionistId:
 *                             type: "string"
 *                             description: The ID of the receptionist who processed the billing
 *                           doctorId:
 *                             type: "string"
 *                             description: The ID of the doctor who attended to the pet
 *                           totalAmount:
 *                             type: "number"
 *                             format: "float"
 *                             description: The total amount billed
 *                           billItems:
 *                             type: "array"
 *                             description: List of items in the bill
 *                             items:
 *                               type: "object"
 *                               properties:
 *                                 itemName:
 *                                   type: "string"
 *                                   description: Name of the billed item
 *                                 price:
 *                                   type: "number"
 *                                   format: "float"
 *                                   description: Price of the billed item
 *                                 quantity:
 *                                   type: "integer"
 *                                   description: Quantity of the billed item
 *                           createdAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the billing record was created
 *                           updatedAt:
 *                             type: "string"
 *                             format: "date-time"
 *                             description: Timestamp when the billing record was last updated
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
 *                         petId: "66b3279c39c21f7342c1520p"
 *                         receptionistId: "66b3279c39c21f7342c178d"
 *                         doctorId: "66b3279c39c21f7342c19ab"
 *                         totalAmount: 5000.75
 *                         billItems:
 *                           - itemName: "Vaccination"
 *                             price: 2000.50
 *                             quantity: 1
 *                           - itemName: "Deworming"
 *                             price: 1000.25
 *                             quantity: 1
 *                           - itemName: "Consultation Fee"
 *                             price: 2000.00
 *                             quantity: 1
 *                         createdAt: "2025-02-01T08:00:00Z"
 *                         updatedAt: "2025-02-01T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c1520n"
 *                         petId: "66b3279c39c21f7342c1520q"
 *                         receptionistId: "66b3279c39c21f7342c178e"
 *                         doctorId: "66b3279c39c21f7342c19ac"
 *                         totalAmount: 3000.50
 *                         billItems:
 *                           - itemName: "General Checkup"
 *                             price: 1500.00
 *                             quantity: 1
 *                           - itemName: "Grooming"
 *                             price: 1500.50
 *                             quantity: 1
 *                         createdAt: "2025-02-02T08:30:00Z"
 *                         updatedAt: "2025-02-02T08:30:00Z"
 */


/**
 * @swagger
 * /v1/admin/billing/{id}:
 *   post:
 *     tags:
 *       - admin/billings
 *     security:
 *       - adminBearerAuth: []
 *     summary: Get one 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the billing record to retrieve
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
 *                   totalAmount: 1
 *                   billItems: 1
 *     responses:
 *       200:
 *         description: Get one billing record.
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
 *                       description: The unique ID of the billing record
 *                     petId:
 *                       type: string
 *                       description: The ID of the pet associated with the billing
 *                     receptionistId:
 *                       type: string
 *                       description: The ID of the receptionist who processed the billing
 *                     doctorId:
 *                       type: string
 *                       description: The ID of the doctor associated with the billing
 *                     totalAmount:
 *                       type: number
 *                       format: float
 *                       description: The total amount of the billing
 *                     billItems:
 *                       type: array
 *                       description: List of items in the bill
 *                       items:
 *                         type: object
 *                         properties:
 *                           itemName:
 *                             type: string
 *                             description: Name of the billed item
 *                           quantity:
 *                             type: integer
 *                             description: Quantity of the billed item
 *                           price:
 *                             type: number
 *                             format: float
 *                             description: Price of the billed item
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the billing record was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the billing record was last updated
 *             examples:
 *               get-one-billing:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "66b3279c39c21f7342c1520b"
 *                     petId: "66b3279c39c21f7342c1520p"
 *                     receptionistId: "66b3279c39c21f7342c1520r"
 *                     doctorId: "66b3279c39c21f7342c1520d"
 *                     totalAmount: 250.75
 *                     billItems:
 *                       - itemName: "Vaccination"
 *                         quantity: 1
 *                         price: 150.50
 *                       - itemName: "General Check-up"
 *                         quantity: 1
 *                         price: 100.25
 *                     createdAt: "2025-02-01T08:00:00Z"
 *                     updatedAt: "2025-02-01T08:00:00Z"
 */

import { Router,Request,Response,NextFunction } from 'express';
import { getAll, getOne ,createUser,updateUser,deleteUser} from '../../../controllers/v1/admin/users';
import { authenticateAdmin } from '../../../middlewares/auth';
import { exitPoint } from '../../../middlewares/exitpoint';
import { entryPoint } from '../../../middlewares/entrypoint';
const router = Router()
/**
/**
 * @swagger
 * /v1/admin/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [admin/users]
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
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [DOCTOR, RECEPTIONIST, NURSE]
 *           examples:
 *             Doctor:
 *               summary: Example of a Doctor user
 *               value:
 *                 name: "Dr. Jane Doe"
 *                 email: "jane.doe@example.com"
 *                 password: "securepassword"
 *                 role: "DOCTOR"
 *             Receptionist:
 *               summary: Example of a Receptionist user
 *               value:
 *                 name: "Lisa Thompson"
 *                 email: "lisa.thompson@example.com"
 *                 password: "securepassword"
 *                 role: "RECEPTIONIST"
 *             Nurse:
 *               summary: Example of a Nurse user
 *               value:
 *                 name: "Michael Johnson"
 *                 email: "michael.johnson@example.com"
 *                 password: "securepassword"
 *                 role: "NURSE"
 *     responses:
 *       201:
 *         description: User created successfully
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
 *             examples:
 *               example1:
 *                 summary: Successful user creation response
 *                 value:
 *                   status: 201
 *                   message: "Success"
 *                   data: "User created successfully"
 *                   toastMessage: "User successfully created"
 */
router.post('/create',
    entryPoint,
    // passport.authenticate('bearer', { session: false }), 
    createUser, 
    exitPoint
    );
/**
 * @swagger
 * /v1/admin/users/update/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [admin/users]
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *         example: "6512c5f3e4b09a12d8f42b68"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the user (optional)
 *                 example: "Dr. Jane Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Updated email address (optional)
 *                 example: "jane.doe@example.com"
 *               role:
 *                 type: string
 *                 enum: [DOCTOR, RECEPTIONIST, NURSE]
 *                 description: Updated role of the user (optional)
 *                 example: "NURSE"
 *               isDeleted:
 *                 type: boolean
 *                 description: Mark the user as deleted (optional)
 *                 example: false
 *           examples:
 *             UpdateNameAndRole:
 *               summary: Example of updating name and role
 *               value:
 *                 name: "Dr. Jane Doe"
 *                 role: "NURSE"
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   description: Message describing the result of the operation
 *                   example: "Success"
 *                 data:
 *                   type: string
 *                   description: The response data
 *                   example: "User updated successfully"
 *                 toastMessage:
 *                   type: string
 *                   description: The toast message
 *                   example: "User successfully updated"
 *             examples:
 *               example1:
 *                 summary: Successful user update response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "User updated successfully"
 *                   toastMessage: "User successfully updated"
 */
router.put('/update/:id',
     entryPoint,
    //passport.authenticate('bearer', { session: false }),
     updateUser,
    exitPoint
    );

/**
 * @swagger
 * /v1/admin/users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [admin/users]
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to be deleted
 *         example: "6512c5f3e4b09a12d8f42b68"
 *     responses:
 *       200:
 *         description: User deleted successfully
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
 *                   description: Message describing the result of the operation
 *                   example: "Success"
 *                 data:
 *                   type: string
 *                   description: The response data
 *                   example: "User deleted successfully"
 *                 toastMessage:
 *                   type: string
 *                   description: The toast message
 *                   example: "User successfully deleted"
 *             examples:
 *               example1:
 *                 summary: Successful user deletion response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "User deleted successfully"
 *                   toastMessage: "User successfully deleted"
*/
router.delete('/delete/:id',
    entryPoint,
    //passport.authenticate('bearer', { session: false }),
    deleteUser, 
     exitPoint
    );
/**
 * @swagger
 * /v1/admin/users/getAll:
 *   post:
 *     tags:
 *       - admin/users
 *     summary: Get all users
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
 *                 description: Filters to apply when retrieving users
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
 *                   email: 1
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
 *                     - "createdAt"
 *                   sortDesc:
 *                     - true
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   - term: "john"
 *                     fields: ["name", "email"]
 *                     startsWith: true
 *                     endsWith: true
 *     responses:
 *       200:
 *         description: Get all users.
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
 *                       description: Total number of users
 *                     tableData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Unique user ID
 *                           name:
 *                             type: string
 *                             description: User's name
 *                           email:
 *                             type: string
 *                             description: User's email
 *                           role:
 *                             type: string
 *                             description: User role
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: User creation timestamp
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Last updated timestamp
 *             examples:
 *               example1:
 *                 summary: "Successful response with user data"
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     totalCount: 2
 *                     tableData:
 *                     -   _id: "66b3279c39c21f7342c125b4"
 *                         name: "John Doe"
 *                         email: "john.doe@example.com"
 *                         role: "DOCTOR"
 *                         createdAt: "2025-02-05T07:00:00Z"
 *                         updatedAt: "2025-02-05T07:30:00Z"
 *                     -   _id: "66b3279c39c21f7342c152c5"
 *                         name: "Jane Smith"
 *                         email: "jane.smith@example.com"
 *                         role: "RECEPTIONIST"
 *                         createdAt: "2025-02-06T10:15:00Z"
 *                         updatedAt: "2025-02-06T11:00:00Z"
 */

router.post('/getAll',
    entryPoint,
   // passport.authenticate('bearer', { session: false }),
    getAll,
    exitPoint
    );
/**
 * @swagger
 * /v1/admin/users/getOne/{id}:
 *   post:
 *     tags:
 *       - admin/users
 *     summary: Get one user
 *     security:
 *       - adminBearerAuth: []  # This requires a bearer token for this route
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to retrieve
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
 *                   createdAt: 1
 *     responses:
 *       200:
 *         description: Get one.
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
 *                        _id:
 *                          type: string
 *                          format: ObjectId
 *                          description: The unique ID of the user
 *                        name:
 *                          type: string
 *                          description:   User's name
 *                        email:
 *                          type: string
 *                          description: User's email
 *                        role:
 *                          type: string
 *                          description: User role
 *                        createdAt:
 *                          type: string
 *                          format: date-time
 *                          description: Timestamp when the user was created
 *                        updatedAt:
 *                          type: string
 *                          format: date-time
 *                          description: Timestamp when the user was last updated
 *             examples:
 *               get-one-user:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "success"
 *                   data:
 *                      _id: "66b3279c39c21f7342c100c3"
 *                      name: "John Doe"
 *                      email: "john.doe@example.com"
 *                      role: "DOCTOR"
 *                      createdAt: "2024-02-04T12:00:00.000Z"
 *                      updatedAt: "2024-02-04T12:00:00.000Z"
 */

router.post('/getOne/:id',
    entryPoint,
    // passport.authenticate('bearer', { session: false }),
     getOne,
     exitPoint
     );
 export default router;
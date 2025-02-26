import { Router,Request,Response,NextFunction } from 'express';
import {createInventory,updateInventory,deleteInventory,getAll,getOne} from '../../../controllers/v1/admin/inventories'
import { authenticateAdmin } from '../../../middlewares/auth';
import { exitPoint } from '../../../middlewares/exitpoint';
import { entryPoint } from '../../../middlewares/entrypoint';

const router = Router();

/**
 * @swagger
 * /v1/admin/inventory/create:
 *   post:
 *     summary: Create a new inventory 
 *     tags: [admin/inventory]
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
 *               - price
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the inventory item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the inventory item
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the item in stock
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the item was created
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the item was last updated
 *           examples:
 *             Example 1:
 *               summary: Example of an inventory item
 *               value:
 *                 name: "Dog Food"
 *                 price: 29.99
 *                 quantity: 50
 *             Example 2:
 *               summary: Example of another inventory item
 *               value:
 *                 name: "Cat Toy"
 *                 price: 9.99
 *                 quantity: 100
 *     responses:
 *       201:
 *         description: Inventory item created successfully
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
 *                 summary: Successful inventory item creation response
 *                 value:
 *                   status: 201
 *                   message: "Success"
 *                   data: "Inventory item created successfully"
 *                   toastMessage: "Item successfully added to inventory"
 */
router.post('/create',
    entryPoint,
    // passport.authenticate('bearer', { session: false }), 
    createInventory, 
    exitPoint
    );
/**
 * @swagger
 * /v1/admin/inventory/update/{id}:
 *   put:
 *     summary: Update an existing inventory item 
 *     tags: [admin/inventory]
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the inventory item
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Updated price of the inventory item
 *               quantity:
 *                 type: integer
 *                 description: Updated quantity of the item in stock
 *               isDeleted:
 *                 type: boolean
 *                 description: Flag to mark item as deleted (soft delete)
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the item was created
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the item was last updated
 *           examples:
 *             Example 1:
 *               summary: Update inventory item details
 *               value:
 *                 name: "Premium Dog Food"
 *                 price: 34.99
 *                 quantity: 40
 *     responses:
 *       200:
 *         description: Inventory item updated or marked as deleted successfully
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
 *                 summary: Successful inventory update response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Inventory item updated successfully"
 *                   toastMessage: "Item successfully updated"
 */
router.put('/update/:id', 
    entryPoint,
    //passport.authenticate('bearer', { session: false }),
     updateInventory, 
     exitPoint
    );

/**
 * @swagger
 * /v1/admin/inventory/delete/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [admin/inventory]
 *     security:
 *       - adminBearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item to be deleted
 *     responses:
 *       200:
 *         description: Inventory item deleted successfully
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
 *               data: "Inventory item permanently deleted"
 *               toastMessage: "Item successfully deleted"
 *       404:
 *         description: Inventory item not found
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
 *               error: "Inventory item not found"
 */
router.delete('/delete/:id',
    entryPoint,
    //passport.authenticate('bearer', { session: false }),
    deleteInventory, 
     exitPoint
    );
/**
 * @swagger
 * /v1/admin/inventory/getAll:
 *   post:
 *     tags:
 *       - admin/inventory
 *     summary: Get all inventory items
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
 *                 description: Filters to apply when retrieving inventory items
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
 *                   price: 1
 *             filterExample:
 *               summary: Filter Example
 *               value:
 *                 filter:
 *                   name: 
 *                     $regex: "Premium"
 *                     $options: "i"
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
 *                   - term: "cat"
 *                     fields: ["name"]
 *                     startsWith: true
 *                     endsWith: false
 *     responses:
 *       200:
 *         description: Get all inventory items.
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
 *                       description: Total number of inventory items
 *                     tableData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Unique inventory ID
 *                           name:
 *                             type: string
 *                             description: Name of the inventory item
 *                           price:
 *                             type: number
 *                             description: Price of the inventory item
 *                           quantity:
 *                             type: integer
 *                             description: Quantity available
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: Inventory item creation timestamp
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: Last updated timestamp
 *             examples:
 *               example1:
 *                 summary: "Successful response with inventory data"
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     totalCount: 2
 *                     tableData:
 *                     -   _id: "66b3279c39c21f7342c125b4"
 *                         name: "Laptop"
 *                         price: 1200.50
 *                         quantity: 10
 *                         createdAt: "2025-02-05T07:30:00Z"
 *                         updatedAt: "2025-02-06T08:00:00Z"
 *                     -   _id: "66b3279c39c21f7342c152c5"
 *                         name: "Phone"
 *                         price: 800.00
 *                         quantity: 25
 *                         createdAt: "2025-02-06T11:00:00Z"
 *                         updatedAt: "2025-02-06T12:30:00Z"
 */
router.post('/getAll',
    entryPoint,
   // passport.authenticate('bearer', { session: false }),
    getAll,
    //exitPoint
    );
/**
 * @swagger
 * /v1/admin/inventory/getOne/{id}:
 *   post:
 *     summary: Get one inventory item
 *     tags: [admin/inventory]
 *     security:
 *       - adminBearerAuth: []  # Requires a bearer token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the inventory item to retrieve
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
 *                   name: 1
 *                   price: 1
 *                   quantity: 1
 *     responses:
 *       200:
 *         description: Get one inventory item.
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
 *                     name:
 *                       type: string
 *                       description: Name of the inventory item
 *                     price:
 *                       type: number
 *                       format: float
 *                       description: Price of the inventory item
 *                     quantity:
 *                       type: integer
 *                       format: int32
 *                       description: Quantity available in stock
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the inventory item was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the inventory item was last updated
 *             examples:
 *               get-one-inventory:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     name: "Dog Food - Premium"
 *                     price: 29.99
 *                     quantity: 50
 *                     createdAt: "2024-02-10T12:00:00Z"
 *                     updatedAt: "2024-02-11T15:30:00Z"
 */
router.post('/getOne/:id',
    entryPoint,
    // passport.authenticate('bearer', { session: false }),
     getOne,
     exitPoint
     );

     export default router;
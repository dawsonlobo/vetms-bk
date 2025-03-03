/**
 * @swagger
 * /v1/generic/notifications/getAll:
 *   post:
 *     tags:
 *       - generic/notifications
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     summary: Get all notifications
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
 *                 example:
 *                   _id: 1
 *                   title: 1
 *                   message: 1
 *                   userId: 1
 *                   isRead: 1
 *                   isDeleted: 1
 *               filter:
 *                 type: object
 *                 description: Filters to apply when retrieving notifications
 *               options:
 *                 type: object
 *                 properties:
 *                   page:
 *                     type: integer
 *                     description: Page number for pagination
 *                   itemsPerPage:
 *                     type: integer
 *                     description: Number of items per page
 *                   sortBy:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Fields to sort by
 *                   sortDesc:
 *                     type: array
 *                     items:
 *                       type: boolean
 *                     description: Sort order (true for descending, false for ascending)
 *               search:
 *                 type: object
 *                 description: Search settings for the request
 *                 properties:
 *                   term:
 *                     type: string
 *                     description: Search term to match
 *                   fields:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: Fields to search in
 *                   startsWith:
 *                     type: boolean
 *                     description: Whether to search from the start of the field
 *           examples:
 *             projectionExample:
 *               summary: Projection Example
 *               value:
 *                 projection:
 *                   _id: 1
 *                   title: 1
 *                   message: 1
 *                   userId: 1
 *                   isRead: 1
 *             filterExample:
 *               summary: Filter Example
 *               value:
 *                 filter:
 *                   isRead: false
 *                   isDeleted: false
 *             paginationExample:
 *               summary: Pagination Example
 *               value:
 *                 options:
 *                   page: 1
 *                   itemsPerPage: 10
 *             sortExample:
 *               summary: Sort Example
 *               value:
 *                 options:
 *                   sortBy: ["createdAt"]
 *                   sortDesc: [true]
 *             searchExample:
 *               summary: Search Example
 *               value:
 *                 search:
 *                   term: "appointment"
 *                   fields: ["title", "message"]
 *                   startsWith: false
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique ID of the notification
 *                       title:
 *                         type: string
 *                         description: Notification title
 *                       message:
 *                         type: string
 *                         description: Notification message content
 *                       userId:
 *                         type: string
 *                         description: ID of the user the notification is for
 *                       isRead:
 *                         type: boolean
 *                         description: Whether the notification has been read
 *                       isDeleted:
 *                         type: boolean
 *                         description: Whether the notification has been marked as deleted
 *                       otherDetails:
 *                         type: object
 *                         description: Additional details related to the notification
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the notification was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp when the notification was last updated
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of items
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     itemsPerPage:
 *                       type: integer
 *                       description: Number of items per page
 *
 * /v1/generic/notifications/getOne/{id}:
 *   post:
 *     tags:
 *       - generic/notifications
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     summary: Get one notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the notification to retrieve
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projection:
 *                 type: object
 *                 description: Fields to include or exclude in the response
 *           examples:
 *             projectionExample:
 *               summary: Example with projection
 *               value:
 *                 projection:
 *                   _id: 1
 *                   title: 1
 *                   message: 1
 *                   userId: 1
 *                   isRead: 1
 *                   isDeleted: 1
 *                   otherDetails: 1
 *                   createdAt: 1
 *                   updatedAt: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved notification details.
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
 *                       description: The unique ID of the notification
 *                     title:
 *                       type: string
 *                       description: Notification title
 *                     message:
 *                       type: string
 *                       description: Notification message content
 *                     userId:
 *                       type: string
 *                       description: ID of the user the notification is for
 *                     isRead:
 *                       type: boolean
 *                       description: Whether the notification has been read
 *                     isDeleted:
 *                       type: boolean
 *                       description: Whether the notification has been marked as deleted
 *                     otherDetails:
 *                       type: object
 *                       description: Additional details related to the notification
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the notification was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the notification was last updated
 *             examples:
 *               get-one-notification:
 *                 summary: Successful response
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data:
 *                     _id: "67c19180b2e8bfba6a12a561"
 *                     title: "New Appointment"
 *                     message: "You have a new appointment scheduled"
 *                     userId: "67b6c3b098c669e6c66adef9"
 *                     isRead: false
 *                     isDeleted: false
 *                     otherDetails: {
 *                       appointmentId: "67c19180b2e8bfba6a12a789"
 *                     }
 *                     createdAt: "2025-02-19T10:00:00Z"
 *                     updatedAt: "2025-02-19T10:00:00Z"
 *
 * /v1/generic/notifications/updateAll:
 *   put:
 *     tags:
 *       - generic/notifications
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     summary: Update multiple notifications
 *     description: Update multiple notifications matching the filter criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 description: Filters to select notifications to update
 *                 example:
 *                   userId: "67b6c3b098c669e6c66adef9"
 *                   isRead: false
 *               update:
 *                 type: object
 *                 description: Fields to update
 *                 example:
 *                   isRead: true
 *           examples:
 *             markAllAsRead:
 *               summary: Mark all as read
 *               value:
 *                 filter:
 *                   userId: "67b6c3b098c669e6c66adef9"
 *                   isRead: false
 *                 update:
 *                   isRead: true
 *             softDeleteNotifications:
 *               summary: Soft delete notifications
 *               value:
 *                 filter:
 *                   userId: "67b6c3b098c669e6c66adef9"
 *                   createdAt: { $lt: "2025-01-01T00:00:00Z" }
 *                 update:
 *                   isDeleted: true
 *     responses:
 *       200:
 *         description: Notifications updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Status code
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 matchedCount:
 *                   type: integer
 *                   description: Number of documents that matched the filter
 *                 modifiedCount:
 *                   type: integer
 *                   description: Number of documents that were modified
 *             examples:
 *               notificationsUpdated:
 *                 summary: Successful update
 *                 value:
 *                   status: 200
 *                   message: "Notifications updated successfully"
 *                   matchedCount: 5
 *                   modifiedCount: 5
 *
 * /v1/generic/notifications/delete/{id}:
 *   delete:
 *     tags:
 *       - generic/notifications
 *     security:
 *       - bearerAuth: []  # Requires a bearer token
 *     summary: Delete a notification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
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
 *                   description: The data that is sent
 *                 toastMessage:
 *                   type: string
 *                   description: The message that is sent
 *             examples:
 *               delete:
 *                 summary: Successful
 *                 value:
 *                   status: 200
 *                   message: "Success"
 *                   data: "Notification deleted successfully"
 *                   toastMessage: "Notification deleted successfully"
 */
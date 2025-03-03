// Import required dependencies
import { Request, Response, NextFunction } from "express";
import { Notification } from "../../models/notifications"; // Adjust path as needed
import mongoose from "mongoose";

/**
 * @description Get all notifications with filter, pagination and search
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projection = {}, filter = {}, options = {}, search = {} } = req.body;
    
    // Set default pagination values
    const page = parseInt(options.page as string) || 1;
    const itemsPerPage = parseInt(options.itemsPerPage as string) || 10;
    
    // Handle search functionality
    let searchQuery = {};
    if (search.term && search.fields && search.fields.length > 0) {
      const searchFields = search.fields.reduce((acc: any, field: string) => {
        if (search.startsWith) {
          acc[field] = { $regex: `^${search.term}`, $options: "i" };
        } else {
          acc[field] = { $regex: search.term, $options: "i" };
        }
        return acc;
      }, {});
      
      searchQuery = { $or: Object.entries(searchFields).map(([key, value]) => ({ [key]: value })) };
    }
    
    // Combine filters
    const combinedFilter = { ...filter, ...searchQuery };
    
    // Sorting logic
    const sortOptions: any = {};
    if (options.sortBy && options.sortDesc && options.sortBy.length === options.sortDesc.length) {
      options.sortBy.forEach((field: string, index: number) => {
        sortOptions[field] = options.sortDesc[index] ? -1 : 1;
      });
    } else {
      // Default sort by createdAt descending
      sortOptions.createdAt = -1;
    }
    
    // Get total count for pagination
    const total = await Notification.countDocuments(combinedFilter);
    
    // Get the notifications with pagination
    const notifications = await Notification.find(combinedFilter, projection)
      .sort(sortOptions)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);
      
    // Set response
    res.locals.status = 200;
    res.locals.message = "Success";
    res.locals.data = notifications;
    res.locals.pagination = {
      total,
      page,
      itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage)
    };
    
    return next();
  } catch (error) {
    res.locals.status = 500;
    res.locals.message = "Error occurred while fetching notifications";
    res.locals.data = error;
    return next();
  }
};

/**
 * @description Get one notification by ID
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.locals.status = 400;
      res.locals.message = "Invalid notification ID";
      return next();
    }
    
    // Find notification by ID
    const notification = await Notification.findById(id, projection);
    
    if (!notification) {
      res.locals.status = 404;
      res.locals.message = "Notification not found";
      return next();
    }
    
    // Set response
    res.locals.status = 200;
    res.locals.message = "Success";
    res.locals.data = notification;
    
    return next();
  } catch (error) {
    res.locals.status = 500;
    res.locals.message = "Error occurred while fetching notification";
    res.locals.data = error;
    return next();
  }
};

/**
 * @description Update multiple notifications based on filter
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const updateAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter = {}, update = {} } = req.body;
    
    // Validate input
    if (Object.keys(filter).length === 0) {
      res.locals.status = 400;
      res.locals.message = "Filter criteria is required";
      return next();
    }
    
    if (Object.keys(update).length === 0) {
      res.locals.status = 400;
      res.locals.message = "Update fields are required";
      return next();
    }
    
    // Add updatedAt timestamp
    const updateData = {
      ...update,
      updatedAt: new Date()
    };
    
    // Update notifications matching the filter
    const result = await Notification.updateMany(filter, { $set: updateData });
    
    // Set response
    res.locals.status = 200;
    res.locals.message = "Notifications updated successfully";
    res.locals.matchedCount = result.matchedCount;
    res.locals.modifiedCount = result.modifiedCount;
    
    return next();
  } catch (error) {
    res.locals.status = 500;
    res.locals.message = "Error occurred while updating notifications";
    res.locals.data = error;
    return next();
  }
};

/**
 * @description Delete a notification by ID
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.locals.status = 400;
      res.locals.message = "Invalid notification ID";
      return next();
    }
    
    // Find and delete notification
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      res.locals.status = 404;
      res.locals.message = "Notification not found";
      return next();
    }
    
    // Set response
    res.locals.status = 200;
    res.locals.message = "Success";
    res.locals.data = "Notification deleted successfully";
    res.locals.toastMessage = "Notification deleted successfully";
    
    return next();
  } catch (error) {
    res.locals.status = 500;
    res.locals.message = "Error occurred while deleting notification";
    res.locals.data = error;
    return next();
  }
};
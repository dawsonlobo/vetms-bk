import { Request, Response, NextFunction } from 'express';
import { InventoryModel } from '../models/inventories'; // Adjust path based on your structure
import mongoose from 'mongoose';

export const createInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, price, quantity } = req.body;
  
      // Validate required fields
      if (!name || price === undefined || quantity === undefined) {
        res.status(400).json({
          status: 400,
          message: 'Missing required fields: name, price, or quantity',
        });
        return;
      }
  
      // Create inventory item
      const newInventoryItem = new InventoryModel({
        name,
        price,
        quantity,
        isDeleted: false, // Ensure it's set to false initially
        createdAt: new Date(),
        updatedAt: new Date(),
      });
  
      // Save to database
      const savedItem = await newInventoryItem.save();
      
      // Exclude 'isDeleted' field from response
      const { isDeleted, ...responseData } = savedItem.toObject();
  
      res.status(201).json({
        status: 201,
        message: 'Success',
        data: responseData, // Use responseData instead of savedItem
        toastMessage: 'Item successfully added to inventory',
      });
    } catch (error) {
      console.error('Error creating inventory:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error,
      });
    }
  };
  
// Adjust path as needed
export const updateInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, price, quantity, isDeleted } = req.body;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          status: 400,
          message: 'Invalid inventory ID',
        });
        return;
      }
  
      // Find and update inventory item
      const updatedItem = await InventoryModel.findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          ...(price !== undefined && { price }),
          ...(quantity !== undefined && { quantity }),
          ...(isDeleted !== undefined && { isDeleted }),
          updatedAt: new Date(),
        },
        { new: true } // Return updated document
      );
  
      if (!updatedItem) {
        res.status(404).json({
          status: 404,
          message: 'Inventory item not found',
        });
        return;
      }
  
      // Exclude 'isDeleted' field from response
      const { isDeleted: _, ...responseData } = updatedItem.toObject();
  
      res.status(200).json({
        status: 200,
        message: 'Success',
        data: responseData, // Use responseData instead of updatedItem
        toastMessage: 'Item successfully updated',
      });
    } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error,
      });
    }
  };
  
 // Adjust the path as needed

export const deleteInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 400,
        message: 'Invalid inventory ID',
      });
      return;
    }

    // Find and soft delete the inventory item
    const deletedItem = await InventoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: new Date() }, // Soft delete by updating `isDeleted`
      { new: true }
    );

    if (!deletedItem) {
      res.status(404).json({
        status: 404,
        message: 'error',
        error: 'Inventory item not found',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: 'Inventory item marked as deleted',
      toastMessage: 'Item successfully deleted',
    });
  } catch (error) {
    console.error('Error soft deleting inventory:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error
    });
  }
};


export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      projection = {}, // Fields to return
      filter = {}, // Query filters
      options = {}, // Pagination & sorting options
      pagination = {}, // Page & limit
      search = [], // Search terms
      date, // Specific date filter
      fromDate, // Date range start
      toDate, // Date range end
    } = req.body;

    let query: any = { isDeleted: false, ...filter }; // Ensure soft-deleted items are excluded

    // Handle date filtering
    if (date) {
      query.createdAt = { $eq: new Date(date * 1000) }; // Convert epoch to date
    } else if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate * 1000),
        $lte: new Date(toDate * 1000),
      };
    }

    // Handle search logic
    if (search.length > 0) {
      const searchQueries = search.map(({ term, fields, startsWith }: any) => ({
        $or: fields.map((field: string) => ({
          [field]: startsWith ? new RegExp(`^${term}`, 'i') : new RegExp(term, 'i'),
        })),
      }));
      query.$and = query.$and ? [...query.$and, ...searchQueries] : searchQueries;
    }

    // Handle pagination & sorting
    const { page = 1, itemsPerPage = 10, sortBy = ['createdAt'], sortDesc = [true] } = options;
    const sort: any = {};
    sortBy.forEach((field: string, index: number) => {
      sort[field] = sortDesc[index] ? -1 : 1;
    });

    // Get total count before pagination
    const totalCount = await InventoryModel.countDocuments(query);

    // Fetch paginated results
    const tableData = await InventoryModel.find(query, projection)
      .sort(sort)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: {
        totalCount,
        tableData,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error,
    });
  }
};


export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // Extract ID from URL path
    const { project = {} } = req.body; // Extract projection fields from request body

    if (!id) {
      res.status(400).json({ status: 400, message: 'Inventory ID is required' });
      return;
    }

    const inventoryItem = await InventoryModel.findOne({ _id: id, isDeleted: false }, project);

    if (!inventoryItem) {
      res.status(404).json({ status: 404, message: 'Inventory item not found' });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: inventoryItem,
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
      error: error
    });
  }
};
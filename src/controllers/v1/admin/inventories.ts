import { Request, Response, NextFunction } from 'express';
import { InventoryModel } from '../../../models/inventories'; // Adjust path based on your structure
import mongoose from 'mongoose';
import { aggregateData } from "../../../utils/aggregation";
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
      projection = {},
      filter = {},
      options = {},
      search = [],
      date,
      fromDate,
      toDate,
    } = req.body;

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      InventoryModel,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate
    );

    res.status(200).json({
      status: 200,
      message: "Success",
      data: { totalCount, tableData },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};
export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ status: 400, message: "Invalid ID" });
    }

    const result = await aggregateData(InventoryModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

    if (!result.tableData.length) {
      res.status(404).json({ status: 404, message: "Record not found or deleted" });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: result.tableData[0], // Access the first element of tableData
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error: error });
  }
};

import { Request, Response, NextFunction } from 'express';
import { InventoryModel } from '../../../models/inventories';
import mongoose from 'mongoose';
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models"

export const createInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, price, quantity } = req.body;

        if (!name || price === undefined || quantity === undefined) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001], // Adjust error code as needed
                toastMessage: 'Missing required fields: name, price, or quantity',
            };
            return next();
        }

        const newInventoryItem = new InventoryModel({
            name,
            price,
            quantity,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedItem = await newInventoryItem.save();
        const { isDeleted, ...responseData } = savedItem.toObject();

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: responseData,
            toastMessage: "Item successfully added to inventory",
        };
        return next();
    } catch (error) {
        console.error("Error creating inventory:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
        };
        return next();
    }
};

export const updateInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, price, quantity, isDeleted } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                toastMessage: "Invalid inventory ID",
            };
            return next();
        }

        const updatedItem = await InventoryModel.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(price !== undefined && { price }),
                ...(quantity !== undefined && { quantity }),
                ...(isDeleted !== undefined && { isDeleted }),
                updatedAt: new Date(),
            },
            { new: true }
        );

        if (!updatedItem) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004],
                toastMessage: "Inventory item not found",
            };
            return next();
        }

        const { isDeleted: _, ...responseData } = updatedItem.toObject();

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: responseData,
            toastMessage: "Item successfully updated",
        };
        return next();
    } catch (error) {
        console.error("Error updating inventory:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
        };
        return next();
    }
};

export const deleteInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                toastMessage: "Invalid inventory ID",
            };
            return next();
        }

        const deletedItem = await InventoryModel.findByIdAndUpdate(
            id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );

        if (!deletedItem) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004],
                toastMessage: "Inventory item not found",
            };
            return next();
        }

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "Inventory item marked as deleted",
            toastMessage: "Item successfully deleted",
        };
        return next();
    } catch (error) {
        console.error("Error soft deleting inventory:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
        };
        return next();
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

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: { totalCount, tableData },
        };
        return next();
    } catch (error) {
        console.error("Error fetching data:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
        };
        return next();
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { projection } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                toastMessage: "Invalid ID",
            };
            return next();
        }

        const result = await aggregateData(InventoryModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

        if (!result.tableData.length) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004],
                toastMessage: "Record not found or deleted",
            };
            return next();
        }

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: result.tableData[0],
        };
        return next();
    } catch (error) {
        console.error("Error fetching record:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            toastMessage: "Something went wrong. Please try again.",
        };
        return next();
    }
};

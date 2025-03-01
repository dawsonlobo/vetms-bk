import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the patients model
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

// Helper function to convert **epoch (milliseconds)** to a Date object set to UTC midnight
const parseEpoch = (epoch: number): Date => {
  const dateObj = new Date(epoch); // Convert epoch to Date
  dateObj.setUTCHours(0, 0, 0, 0); // Normalize to UTC midnight
  return dateObj;
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    // Convert `date`, `fromDate`, `toDate` from epoch to Date format
    if (date) {
      const isoDate = parseEpoch(date);
      filter.date = {
        $gte: isoDate,
        $lt: new Date(isoDate.getTime() + 86400000), // Less than next day
      };
    }

    if (fromDate && toDate) {
      filter.date = {
        $gte: parseEpoch(fromDate),
        $lte: parseEpoch(toDate),
      };
    }

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      PatientModel,
      filter,
      projection,
      options,
      search,
    );

    // Convert `date` field in response to ISO format
    const formattedData = tableData.map((item: any) => ({
      ...item,
      date: item.date ? new Date(item.date).toISOString() : null, // Convert only if `date` exists
    }));

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: { totalCount, tableData: formattedData },
    };
    next();
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  }
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

    const result = await aggregateData(
      PatientModel,
      { _id: new mongoose.Types.ObjectId(id) },
      projection,
    );

    if (!result.tableData.length) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        toastMessage: "Record not found or deleted",
      };
      return next();
    }

    // Convert `date` field in response to ISO format
    const formattedResult = {
      ...result.tableData[0],
      date: result.tableData[0].date
        ? new Date(result.tableData[0].date).toISOString()
        : null,
    };

    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: formattedResult,
    };
    next();
  } catch (error) {
    console.error("Error fetching record:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  }
};

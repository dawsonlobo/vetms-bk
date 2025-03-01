import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the patients model
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

// Helper function to convert **epoch (milliseconds)** to a Date object set to UTC midnight

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

    // Helper function to convert epoch (IST) to UTC midnight date range
    const parseEpochIST = (epoch: number): { $gte: Date; $lt: Date } => {
      const utcDate = new Date(epoch); // Epoch is in milliseconds
      utcDate.setUTCHours(0, 0, 0, 0); // Convert to UTC midnight
      const nextDay = new Date(utcDate.getTime() + 86400000); // Add 1 day
      return { $gte: utcDate, $lt: nextDay };
    };

    // Handle single date filtering (Convert IST input to UTC range)
    if (date) {
      filter.date = parseEpochIST(date);
    }

    // Handle date range filtering (Convert IST to UTC range)
    if (fromDate && toDate) {
      filter.date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      PatientModel,
      filter,
      projection,
      options,
      search
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
        const { projection = {} } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            req.apiStatus = {
                isSuccess: false,
                message: "Invalid patient ID",
                toastMessage: "Invalid record",
                error: { statusCode: 400, message: "The provided ID format is incorrect." },
            };
            return next();
        }

        const Projection = { ...projection };
        delete Projection.isDeleted;

        const result = await aggregateData(
            PatientModel,
            { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
            Projection
        );

        if (!result?.tableData?.length) {
            req.apiStatus = {
                isSuccess: false,
                message: "Record not found or deleted",
                toastMessage: "No record found",
            };
            return next();
        }

        const patient = result.tableData[0];

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: patient,
        };
        next();
    } catch (error) {
        console.error("Error fetching patient:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
        };
        next();
    }
};

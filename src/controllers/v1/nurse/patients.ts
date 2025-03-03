import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the patients model
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

// Helper function to convert **epoch (milliseconds)** to a Date object set to UTC midnight

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let {
      projection = {},
      filter = {},
      options = {},
      search = [],
      date,
      fromDate,
      toDate,
      sort = { createdAt: -1 }, // Default sorting by createdAt (latest first)
    } = req.body;

    // Ensure filter is an object
    if (typeof filter !== "object") {
      filter = {};
    }

    // Helper function to convert epoch (IST) to UTC midnight range
    const parseEpochIST = (epoch: number): { $gte: Date; $lt: Date } => {
      const start = new Date(epoch); // Start time (exact timestamp)
      const end = new Date(epoch + 999); // End time (999ms later for precision)

      return { $gte: start, $lt: end };
    };

    // If searching by exact createdAt timestamp (epoch in milliseconds)
    if (date) {
      filter.createdAt = parseEpochIST(date);
    }

    // If searching by a date range (fromDate, toDate)
    if (fromDate && toDate) {
      filter.createdAt = {
        $gte: new Date(fromDate), // Convert fromDate to Date
        $lte: new Date(toDate), // Convert toDate to Date
      };
    }

    // Ensure sorting is an object
    if (typeof sort !== "object") {
      sort = { createdAt: -1 }; // Default sorting
    }

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      PatientModel,
      filter,
      projection,
      { ...options, sort }, // Ensure sorting is passed
      search,
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

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        message: "Invalid patient ID",
        toastMessage: "Invalid record",
        error: {
          statusCode: 400,
          message: "The provided ID format is incorrect.",
        },
      };
      return next();
    }

    const Projection = { ...projection };
    delete Projection.isDeleted;

    const result = await aggregateData(
      PatientModel,
      { _id: new mongoose.Types.ObjectId(id), isDeleted: false },
      Projection,
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

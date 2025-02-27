import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the Patient model
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

export const createUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, ...patientData } = req.body;

    let result;
    if (id) {
      // Update existing patient record
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1003],
          toastMessage: "Invalid ID",
        };
        return next();
      }

      result = await PatientModel.findByIdAndUpdate(id, patientData, { new: true, runValidators: true });

      if (!result) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          toastMessage: "Record not found or deleted",
        };
        return next();
      }
    } else {
      // Create new patient record
      result = await PatientModel.create(patientData);
    }

    req.apiStatus = {
      isSuccess: true,
      message: id ? "Patient updated successfully" : "Patient created successfully",
      data: result,
    };
    next();
  } catch (error) {
    console.error("Error in createUpdate:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
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
      PatientModel,
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
    next(); // Pass control to the next middleware
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    next(); // Pass control to the error-handling middleware
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

    const result = await aggregateData(PatientModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

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
      data: result.tableData[0], // Access the first element of tableData
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
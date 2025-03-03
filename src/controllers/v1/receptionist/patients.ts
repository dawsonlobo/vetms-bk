import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the Patient model
import mongoose from "mongoose";
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";

export const createUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _id, dob, ...patientData } = req.body;

    let result;

    if (_id) {
      // Validate ObjectId format
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1003],
          toastMessage: "Invalid ID format",
        };
        return next();
      }

      // Avoid unnecessary recursive updates
      const updateFields = { ...patientData };
      delete updateFields.isDeleted; // Ensure we don't unintentionally modify this field

      result = await PatientModel.findByIdAndUpdate(
        _id,
        { $set: updateFields },
        { new: true, runValidators: true, strict: true },
      ).lean(); // Use lean() to return a plain JavaScript object

      if (!result) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1004],
          toastMessage: "Patient not found or deleted",
        };
        return next();
      }

      req.apiStatus = {
        isSuccess: true,
        message: "Success",
        data: "Patient updated successfully",
        toastMessage: "Patient updated successfully",
      };
      return next();
    } else {
      // If no _id is provided, create a new patient
      if (!dob) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1005],
          toastMessage: "Date of Birth (dob) is required",
        };
        return next();
      }

      const calculatedAge = Math.floor(
        (new Date().getTime() - new Date(dob).getTime()) /
          (1000 * 60 * 60 * 24 * 365.25),
      );

      result = await PatientModel.create({
        ...patientData,
        dob,
        age: calculatedAge,
        isDeleted: false,
      });

      req.apiStatus = {
        isSuccess: true,
        message: "Success",
        data: "Patient added successfully",
        toastMessage: "Patient added successfully",
      };
      return next();
    }
  } catch (error) {
    console.error("Error in createOrUpdatePatient:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1002],
      toastMessage: "Something went wrong. Please try again.",
    };
    return next();
  }
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

    let dateFilter: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      dateFilter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    } else if (fromDate && toDate) {
      dateFilter.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Merge date filter with other filters
    const finalFilter = { ...filter, ...dateFilter };

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      PatientModel,
      finalFilter,
      projection,
      options,
      search
    );

    // Convert timestamps to epoch format
    const formattedData = tableData.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt).getTime(),
      updatedAt: new Date(item.updatedAt).getTime(),
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

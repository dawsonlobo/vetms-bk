import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments"; 
import { CONSTANTS } from "../../../config/constant";

import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from "../../../models/models";
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

    const lookups = req.body?.lookupRequired ? [
      {
        $lookup: {
          from: CONSTANTS.COLLECTIONS.PATIENTS_COLLECTION, // Lookup patient details
          localField: "patientId",
          foreignField: "_id",
          as: "patientDetails"
        }
      },
      { 
        $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } 
      },
      {
        $lookup: {
          from: CONSTANTS.COLLECTIONS.USER_COLLECTION, // Lookup doctor details
          localField: "doctorId",
          foreignField: "_id",
          as: "doctorDetails"
        }
      },
      { 
        $unwind: { path: "$doctorDetails", preserveNullAndEmptyArrays: true } 
      }

    ] : [];

    //console.log("Lookup Pipeline:", JSON.stringify(lookups, null, 2)); // Debugging

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
      AppointmentModel,
      filter,
      projection,
      options,
      search,
      date,
      fromDate,
      toDate,
      lookups
    );

   
    req.apiStatus = {
      isSuccess: true,
      data: { totalCount, tableData },
      message: "Success",
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
  } next();
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {}, lookupRequired = false } = req.body;

    // Build lookup stages if lookupRequired is true
    const lookups = lookupRequired
      ? [
          {
            $lookup: {
              from: "patients", // Lookup patient details
              localField: "patientId",
              foreignField: "_id",
              as: "patientDetails"
            }
          },
          { 
            $unwind: { path: "$patientDetails", preserveNullAndEmptyArrays: true } 
          },
          {
            $lookup: {
              from: "users", // Lookup doctor details
              localField: "doctorId",
              foreignField: "_id",
              as: "doctorDetails"
            }
          },
          { 
            $unwind: { path: "$doctorDetails", preserveNullAndEmptyArrays: true } 
          }
        ]
      : [];

    // Add the match stage to find the specific document by _id
    const aggregationPipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Match the ID
      ...lookups, // Add the lookup stages if needed
      { $project: projection || {} }, // Apply the projection if provided
    ];

    // Call aggregateData with the modified pipeline for a single record
    const { totalCount, tableData } = await aggregateData(
      AppointmentModel,
      {}, // No filter is needed for `getOne`, since we already match by ID
      projection,
      {}, // Empty options
      [], // No search is needed
      undefined, // No date, fromDate, or toDate
      undefined,
      undefined,
      aggregationPipeline // Pass the pipeline directly
    );

    if (!tableData.length) {
      req.apiStatus = {
        isSuccess: false,
        message: "Record not found or deleted",
        toastMessage: "No record found",
      };
      next();
      return;
    }


    req.apiStatus = {
      isSuccess: true,
      data: tableData[0],
      message: "Success",
    };
  } catch (error) {
    console.error("Error fetching record:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
  }
   next();
};

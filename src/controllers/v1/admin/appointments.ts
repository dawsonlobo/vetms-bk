import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments"; 
import { CONSTANTS } from "../../../config/constant";

import { aggregateData } from "../../../utils/aggregation";



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
      res.status(404).json({ status: 404, message: "Record not found or deleted" });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: tableData[0], // Access the first element of tableData
    });
  } catch (error) {
    console.error("Error fetching record:", error);
    res.status(500).json({ status: 500, message: "Internal Server Error", error });
  }
};

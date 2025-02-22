import { Request, Response, NextFunction } from "express";
import { PatientModel } from "../../../models/patients"; // Import the Patient model
import mongoose, { SortOrder } from "mongoose";
import { aggregateData } from "../../../utils/aggregation";

export const createUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { _id, ...patientData } = req.body;
  
      if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
        res.status(400).json({
          status: 400,
          message: "Invalid Patient ID",
          toastMessage: "Invalid Patient ID provided",
        });
        return;
      }
  
      let isUpdate = Boolean(_id);
      let patient;
  
      if (isUpdate) {
        patient = await PatientModel.findByIdAndUpdate(_id, patientData, { new: true }).exec();
      } else {
        patient = await new PatientModel(patientData).save();
      }
  
      if (!patient) {
        res.status(404).json({
          status: 404,
          message: "Patient not found",
          toastMessage: "Patient record not found",
        });
        return;
      }
  
      res.status(200).json({
        status: 200,
        message: "Success",
        data: isUpdate ? "Patient record updated successfully" : "Patient added successfully",
        toastMessage: isUpdate ? "Patient record updated successfully" : "Patient added successfully",
      });
  
    } catch (error) {
      console.error("Error in createUpdate:", error);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        toastMessage: "Something went wrong. Please try again.",
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
      PatientModel,
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
// Adjust path as needed

// Ensure this path matches your project structure

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ status: 400, message: "Invalid ID" });
    }

    const result = await aggregateData(PatientModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

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
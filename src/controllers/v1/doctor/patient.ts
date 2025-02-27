import { Request, Response } from "express";
import mongoose from "mongoose";
import {PatientModel} from "../../../models/patients"
import { aggregateData } from "../../../utils/aggregation";




export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 400, message: "Invalid Appointment ID" });
      return;
    }

    const objectId = new mongoose.Types.ObjectId(id); // Convert string to ObjectId

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(PatientModel, { _id: objectId, isDeleted: false }, sanitizedProjection);

    if (!tableData || tableData.length === 0) {
      res.status(404).json({ status: 404, message: "FollowUp record not found or deleted" });
      return;
    }

    const followUpObj = tableData[0];

    res.status(200).json({
      status: 200,
      message: "Success",
      data: followUpObj, // Only includes fields from sanitizedProjection
    });
  } catch (error) {
    console.error("Error fetching FollowUp record:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error,
    });
  }
};



export async function getAll(req: Request, res: Response): Promise<void> {
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

    // Remove isDeleted from projection to ensure it's never included
    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Ensure deleted records are not included in the filter
    const sanitizedFilter = { ...filter, isDeleted: false };

    // Call reusable aggregation function
    const { totalCount, tableData } = await aggregateData(
        PatientModel,
      sanitizedFilter,
      sanitizedProjection,
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




export const Update = async (req: Request, res: Response): Promise<void> => {
    try {
      
        const{_id}=req.params;
        const { weight, bmi, medicalHistory } = req.body;
        

              const updateFields = { weight, bmi, medicalHistory };
              
            //   if (updateFields.isDeleted) {
            //     delete updateFields.isDeleted;
            // }

            const updatedPatients = await PatientModel.findByIdAndUpdate(_id, updateFields, { new: true });


            if (!updatedPatients) {
                res.status(404).json({ status: 404, message: "Patients record not found" });
                return;
            }
  
            res.status(200).json({
                status: 200,
                message: "Success",
                data: "Appointment updated successfully",
                toastMessage: "Appointment updated successfully",
            });

              
              
    

    } catch (error) {
        console.error("Error in createUpdate:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};

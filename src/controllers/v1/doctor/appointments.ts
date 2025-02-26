import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { PatientModel } from "../../../models/patients";
import { aggregateData } from "../../../utils/aggregation";
import UserModel from "../../../models/users"
import { ObjectId } from "mongodb";





export const Update = async (req: Request, res: Response): Promise<void> => {
    try {
      
        const{_id}=req.params;
        const { patientId, doctorId, date, status } = req.body;


        const existingUser = await UserModel.findOne({ _id: new ObjectId(doctorId) });

        if (!existingUser) {
            res.status(404).json({ message: "Doctor not found" });
            return;
        }
  
        if (existingUser.role !== "DOCTOR") {
            res.status(403).json({ message: "doctorId is not authorized as a doctor" });
            return;
        }


              const existingPatient = await PatientModel.findOne({ _id: new ObjectId(patientId) });
        
              if (!existingPatient) {
                  res.status(404).json({ message: "Patient not found" });
                  return;
              }


              const existingApointment=await AppointmentModel.findOne({_id:new ObjectId(_id)});
              if(existingApointment){

              const updateFields = { patientId, doctorId, date, status };
              
            //   if (updateFields.isDeleted) {
            //     delete updateFields.isDeleted;
            // }

            const updatedAppointments = await AppointmentModel.findByIdAndUpdate(_id, updateFields, { new: true });


            if (!updatedAppointments) {
                res.status(404).json({ status: 404, message: "FollowUp record not found" });
                return;
            }
  
            res.status(200).json({
                status: 200,
                message: "Success",
                data: "Appointment updated successfully",
                toastMessage: "Appointment updated successfully",
            });
              
              }else{
                res.status(404).json({ status: 404, message: "Appointment record not found matching the appointment id" });
              return;
              }
    

    } catch (error) {
        console.error("Error in createUpdate:", error);
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
};



export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const { tableData } = await aggregateData(AppointmentModel, { _id: objectId, isDeleted: false }, sanitizedProjection);

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



export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
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
        AppointmentModel,
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

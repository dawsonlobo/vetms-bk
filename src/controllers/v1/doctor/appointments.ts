import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppointmentModel } from "../../../models/appointments";
import { PatientModel } from "../../../models/patients";
import { aggregateData } from "../../../utils/aggregation";
import UserModel from "../../../models/users"
import { ObjectId } from "mongodb";
import { CONSTANTS } from "../../../config/constant";
import { ErrorCodes } from "../../../models/models";






export const Update = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const { _id } = req.params;
        const { remarks } = req.body;

        // Find the existing appointment
        const existingAppointment = await AppointmentModel.findOne({ _id: new ObjectId(_id) });

        if (!existingAppointment) {
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "Internal Server Error",
            toastMessage: "Something went wrong. Please try again.",
          };
          next();
          return;
        } 
              
            
            // "Appointment record not found matching the appointment id" });
            
        // Extract current status
        const { status } = existingAppointment;

        // Prepare update fields
        const updateFields: Record<string, any> = { remarks };

        // Only update status if it's "pending", do nothing if it's "cancelled"
        if (status === CONSTANTS.APPOINTMENT_STATUS.PENDING) {
            updateFields.status = CONSTANTS.APPOINTMENT_STATUS.COMPLETED;
        } else if (status === CONSTANTS.APPOINTMENT_STATUS.CANCELLED) {
          console.error("Error fetching data:");
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "Cannot update cancelled or not attended status.",
            toastMessage: "Cannot update cancelled or not attended status.",
          };
          next();
          return;
        } 
        

      
        // Update appointment
        const updatedAppointment = await AppointmentModel.findByIdAndUpdate(_id, updateFields, { new: true });

        if (!updatedAppointment) {
          req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message: "Follow-up record not found.",
            toastMessage: "Follow-up record not found.",
          };
          next();
             return;
        }
        
  req.apiStatus = {
  isSuccess: true,
  message: "Success",
  data: "Appointment updated successfully",
  toastMessage: "Appointment updated successfully",
};
next();
return;

    } catch (error) {
      console.error("Error fetching data:", error);
      req.apiStatus = {
        isSuccess: false,
        error:ErrorCodes[1002],
        message: "Something went wrong. Please try again.",
        toastMessage: "Something went wrong. Please try again.",
      } 
      next(); 
      return;   
      };
    };



export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1002],
        toastMessage: "Invalid Appointment ID",
      };
      next();
      return;
    }
    const objectId = new mongoose.Types.ObjectId(id); // Convert string to ObjectId

    // Remove isDeleted from projection to ensure it's never included

    const sanitizedProjection = { ...projection };
    delete sanitizedProjection.isDeleted;

    // Fetch follow-up data using aggregation
    const { tableData } = await aggregateData(AppointmentModel, { _id: objectId, isDeleted: false }, sanitizedProjection);

    if (!tableData || tableData.length === 0) {
      req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1010],
      toastMessage: 
    };
    next();
    return;
    }

    // "Something went wrong. Please try again."

    const followUpObj = tableData[0];
    
    req.apiStatus = {
      isSuccess: true,
      message: "Success",
      data: followUpObj,
    };
    next();
    return;
  } catch (error) {
    console.error("Error in upsertBilling:", error);
    req.apiStatus = {
      isSuccess: false,
      error: ErrorCodes[1010],
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
  return;
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
    next();
    return;
  } catch (error) {
    console.error("Error fetching data:", error);
    req.apiStatus = {
      isSuccess: false,
      error:ErrorCodes[1002],
      message: "Internal Server Error",
      toastMessage: "Something went wrong. Please try again.",
    };
    next();
    return;
  }
};

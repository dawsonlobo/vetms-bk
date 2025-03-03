    import { Request, Response, NextFunction } from "express";
import {ErrorCodes} from "../../../models/models"
import {AppointmentModel} from "../../../models/appointments"
import {FollowUp} from "../../../models/followUps"
import mongoose from "mongoose";






export async function getDashBoard(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
    if (!req.user) {
        req.apiStatus = {
            isSuccess: false,
            error:ErrorCodes[1002],
            message:"Doctor not found",
            toastMessage: "Doctor not found",
          };
          next();
             return;
    }
    // const id = (req.user as { id: string }).id;
    const id = new mongoose.Types.ObjectId((req.user as { id: string }).id);
    console.log(id);



    // Aggregate to count unique patient IDs for this doctor
    const patients = await AppointmentModel.aggregate([
      {
        $match: {
          doctorId: id,
          isDeleted: false
        }
      },
      {
        $group: {
          _id: null,
          totalPatients:  { $addToSet: "$patientId" } // Collect unique patient IDs
        }
        
      },
      {
        $project: {
          _id: 0,
          totalPatients: { $size: "$totalPatients" } // Get count of unique patient IDs
        }
      }
    ]);

    const totalPatients = patients.length > 0 ? patients[0].totalPatients : 0;


    const followUps = await FollowUp.aggregate([
        {
          $match: {
            doctorId: id,
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            totalFollowUps: { $sum: 1 } // Count the number of follow-ups
          }
        },
        {
          $project: {
            _id: 0,
            totalFollowUps: 1
          }
        }
      ]);
  
      const totalFollowUps = followUps.length > 0 ? followUps[0].totalFollowUps : 0;
  




      const appointments = await AppointmentModel.aggregate([
        {
          $match: {
            doctorId: id,
            isDeleted: false
          }
        },
        {
          $group: {
            _id: null,
            totalAppointments: { $sum: 1 } // Count the number of Appointments
          }
        },
        {
          $project: {
            _id: 0,
            totalAppointments: 1
          }
        }
      ]);
  
      const totalAppointments = appointments.length > 0 ? appointments[0].totalAppointments : 0;
  

      console.log(totalPatients); 
    console.log(totalFollowUps);
    console.log(totalAppointments); 

    

    req.apiStatus = {
        isSuccess: true,
        message: "Success",
        data:{"totalPatients":totalPatients,
            "totalFollowUps":totalFollowUps,
            "totalAppointments":totalAppointments
        },
        
        };
      next();
      return;

  } catch (error) {
    console.error("The error is:", error);
    next(error);
  }
}

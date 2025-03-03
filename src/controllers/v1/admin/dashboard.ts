    import { Request, Response, NextFunction } from "express";
import {ErrorCodes} from "../../../models/models"
import {AppointmentModel} from "../../../models/appointments"
import {FollowUp} from "../../../models/followUps"
import UserModel from "../../../models/users"







export async function getDashBoard(req: Request, res: Response, next: NextFunction):Promise<void> {
  try {
        if (!req.user) {
            req.apiStatus = {
                isSuccess: false,
                error:ErrorCodes[1002],
                message:"Admin not found",
                toastMessage: "Admin not found",
              };
              next();
                 return;
        }
        const id = (req.user as { id: string }).id;
        console.log(id);

        const roleCounts = await UserModel.aggregate([
            {
              $match: { isDeleted: false }, // Exclude deleted users
            },
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                role: "$_id",
                count: 1,
              },
            },
          ]);

          console.log("Role Counts:", roleCounts);




  }catch(error){

  }}
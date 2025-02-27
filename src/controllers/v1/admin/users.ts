import { Request, Response, NextFunction } from 'express';
import UserModel from '../../../models/users'; // Adjust path as needed
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from '../../../config/config';
import { aggregateData } from "../../../utils/aggregation";
import { ErrorCodes } from '../../../models/models';

//const SALT_ROUNDS = 15; // Define salt rounds as 15

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { name, email, password, role } = req.body;

      // Validate required fields
      if (!name || !email || !password || !role) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1001],
              message: "All fields are required.",
              toastMessage: "Please provide all required fields.",
          };
          return next();
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1013],
              message: "User with this email already exists.",
              toastMessage: "Email is already registered.",
          };
          return next();
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, config.ROUNDS);

      // Create new user
      const newUser = new UserModel({
          name,
          email,
          password: hashedPassword,
          role,
      });

      await newUser.save();

      req.apiStatus = {
          isSuccess: true,
          message: "Success",
          data: "User created successfully",
          toastMessage: "User successfully created",
      };
      next();
  } catch (error) {
      console.error("Error creating user:", error);
      req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1010],
          message: "Internal server error",
          toastMessage: "Something went wrong. Please try again.",
      };
      next();
  }
};

// Adjust the import path based on your project structure
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { id: userId } = req.params; // Get userId from URL params
      
      // Extract only allowed fields to update (excluding sensitive fields like password and role)
      const { name, email } = req.body;
      
      // Step 1: Prepare update fields with only allowed properties
      const updateFields: any = {};
      if (name !== undefined) updateFields.name = name;
      if (email !== undefined) updateFields.email = email;
      
      // Validate if there are any fields to update
      if (Object.keys(updateFields).length === 0) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1001],
              message: "No valid fields provided for update.",
              toastMessage: "No changes detected.",
          };
          return next();
      }
      
      // Step 2: Check if user exists
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1002],
              message: "User not found.",
              toastMessage: "User does not exist.",
          };
          return next();
      }
      
      // Step 3: Update the user document
      const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          updateFields,
          { new: true, runValidators: true }
      ).select("-password -isDeleted"); // Exclude password from response
      
      if (!updatedUser) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1003],
              message: "User update failed.",
              toastMessage: "Could not update user.",
          };
          return next();
      }
      
      // Step 4: Send success response
      req.apiStatus = {
          isSuccess: true,
          message: "Success",
          data: updatedUser,
          toastMessage: "User successfully updated",
      };
      next();
  } catch (error) {
      console.error("Error updating user:", error);
      req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1010],
          message: "Error updating user",
          toastMessage: "Something went wrong. Please try again.",
      };
      next();
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const { id } = req.query;

      // Validate ObjectId
      if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1001],
              message: "Invalid or missing user ID",
              toastMessage: "Invalid request",
          };
          return next();
      }

      // Check if user exists AND is not already soft deleted
      const user = await UserModel.findById(id);

      if (!user) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1001],
              toastMessage: "Invalid user ID",
          };
          return next();
      }

      if (user.isDeleted) {
          req.apiStatus = {
              isSuccess: false,
              error: ErrorCodes[1004],
              message: "User already deleted",
              toastMessage: "User does not exist",
          };
          return next();
      }

      // Perform soft delete by setting isDeleted to true
      user.isDeleted = true;
      await user.save();

      req.apiStatus = {
          isSuccess: true,
          message: "Success",
          data: "User marked as deleted",
          toastMessage: "Item successfully deleted",
      };
      next();
  } catch (error) {
      console.error("Error soft deleting user:", error);
      req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1010],
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
    UserModel,
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
/**
 * Controller to fetch a single user by ID
 */
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
    }

    const result = await aggregateData(UserModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

    if (!result.tableData.length) {
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1004],
        toastMessage: "Record not found or deleted",
      };
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

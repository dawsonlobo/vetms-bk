import { Request, Response, NextFunction } from 'express';
import UserModel from '../../../models/users'; // Adjust path as needed
import bcrypt from 'bcryptjs';
import mongoose, { SortOrder } from 'mongoose';
import { config } from '../../../config/config';
import { aggregateData } from "../../../utils/aggregation";

//const SALT_ROUNDS = 15; // Define salt rounds as 15

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      res.status(400).json({
        status: 400,
        message: 'All fields are required.',
        toastMessage: 'Please provide all required fields.',
      });
      return;
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        status: 409,
        message: 'User with this email already exists.',
        toastMessage: 'Email is already registered.',
      });
      return;
    }

    // Hash password before saving (Using 15 salt rounds)
    const hashedPassword = await bcrypt.hash(password, config.ROUNDS);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      message: 'Success',
      data: 'User created successfully',
      toastMessage: 'User successfully created',
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error,
    });
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
      res.status(400).json({ message: 'No valid fields provided for update.' });
      return;
    }
    
    // Step 2: Check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      console.log('User not found with ID:', userId);
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    
    // Log the updateFields to verify the data being sent for update
    
    // Step 3: Update the user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password -isDeleted'); // Exclude password from response
    
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    
    // Step 4: Send success response
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: updatedUser,
      toastMessage: 'User successfully updated',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};



export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.query;

        // Validate ObjectId
        if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
            res.status(400).json({
                status: 400,
                message: 'Invalid or missing user ID',
                toastMessage: 'Invalid request',
            });
            return;
        }

        // Check if user exists AND is not already soft deleted
        const user = await UserModel.findById(id);

        if (!user) {
            res.status(404).json({
                status: 404,
                message: 'User not found',
                toastMessage: 'User does not exist',
            });
            return;
        }

        if (user.isDeleted) {
            res.status(404).json({
                status: 404,
                message: 'User already deleted',
                toastMessage: 'User does not exist',
            });
            return;
        }

        // Perform soft delete by setting isDeleted to true
        user.isDeleted = true;
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: 'User deleted successfully',
            toastMessage: 'User successfully deleted',
        });
    } catch (error) {
        console.error('Error soft deleting user:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error,
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
    UserModel,
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
/**
 * Controller to fetch a single user by ID
 */
export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { projection } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       res.status(400).json({ status: 400, message: "Invalid ID" });
    }

    const result = await aggregateData(UserModel, { _id: new mongoose.Types.ObjectId(id) }, projection);

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

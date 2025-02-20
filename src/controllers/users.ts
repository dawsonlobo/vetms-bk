import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/users'; // Adjust path as needed
import bcrypt from 'bcryptjs';
import mongoose, { SortOrder } from 'mongoose';

const SALT_ROUNDS = 15; // Define salt rounds as 15

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
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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
    const { isDeleted, ...updateData } = req.body;

    // Log request parameters for debugging
    console.log('User ID from URL:', userId);
    console.log('isDeleted:', isDeleted);

    // Step 1: Validate input
    if (!updateData && isDeleted === undefined) {
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

    // Step 3: Prepare the update fields
    let updateFields: any = {};

    if (Object.keys(updateData).length > 0) {
      updateFields = { ...updateData };
    }

    // If isDeleted is passed, update it
    if (isDeleted !== undefined) {
      updateFields.isDeleted = isDeleted;
    }

    // Log the updateFields to verify the data being sent for update
    console.log('Update Fields:', updateFields);

    // Step 4: Update the user document
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    // Step 5: Send success response
    res.status(200).json({
      status: 200,
      message: 'Success',
      data: 'User updated successfully',
      toastMessage: 'User successfully updated',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user', error });
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

    // Find user and delete
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({
        status: 404,
        message: 'User not found',
        toastMessage: 'User does not exist',
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: 'Success',
      data: 'User deleted successfully',
      toastMessage: 'User successfully deleted',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      error: error,
    });
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.body) {
            res.status(400).json({ error: 'Request body is missing' });
            return;
        }

        const {
            filter = {},
            projection = '',
            options,
            pagination = {},
            search,
            date,
            fromDate,
            toDate,
        } = req.body;

        let query: any = { ...filter, isDeleted: false }; // Ensure only non-deleted records

        if (date) {
            query.createdAt = { $eq: new Date(date * 1000) };
        } else if (fromDate && toDate) {
            query.createdAt = { $gte: new Date(fromDate * 1000), $lte: new Date(toDate * 1000) };
        }

        if (search && Array.isArray(search)) {
            query.$or = search.flatMap(({ term, fields, startsWith }) =>
                fields.map((field: string) => ({
                    [field]: { $regex: startsWith ? `^${term}` : term, $options: 'i' },
                }))
            );
        }

        const page = Math.max(1, pagination.page || 1);
        const itemsPerPage = Math.max(1, pagination.itemsPerPage || 10);
        const skip = (page - 1) * itemsPerPage;

        const sortOptions: { [key: string]: SortOrder } = options?.sortBy
            ? { [String(options.sortBy)]: options.sortDesc ? -1 : 1 }
            : {};

        // Ensure projection is always a string before splitting
        let projectionString = typeof projection === 'string' ? projection : '';
        let projectionArray = projectionString.split(' ').filter((field: string) => field.trim() !== '');

        if (projectionArray.length > 0) {
            // Remove excluded fields
            projectionArray = projectionArray.filter((field: string) => field !== 'isDeleted' && field !== 'password');
        } else {
            // If empty, exclude `isDeleted` and `password`
            projectionArray = ['-isDeleted', '-password'];
        }

        const [totalCount, usersList] = await Promise.all([
            UserModel.countDocuments(query).exec(),
            UserModel.find(query)
                .select(projectionArray.join(' ')) // Apply the corrected projection
                .skip(skip)
                .limit(itemsPerPage)
                .sort(sortOptions)
                .exec(),
        ]);

        res.status(200).json({
            status: 200,
            message: 'Success',
            data: { totalCount, tableData: usersList },
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        next(error);
    }
};

/**
 * Controller to fetch a single user by ID
 */
export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { project = {} } = req.body;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          status: 400,
          message: 'Invalid user ID',
        });
        return;
      }
  
      // Ensure projection is valid
      let projectionFields = typeof project === 'string' ? project.split(' ') : project;
  
      // Fetch user while ensuring isDeleted is false
      const user = await UserModel.findOne({ _id: id, isDeleted: false }, projectionFields);
  
      if (!user) {
        res.status(404).json({
          status: 404,
          message: 'User not found or deleted',
        });
        return;
      }
  
      res.status(200).json({
        status: 200,
        message: 'Success',
        data: user,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal Server Error',
        error: error,
      });
    }
  };
  
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import logger from "../config/logger";

/** Controller function to create a new user */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, viewed, description, status } = req.body;

    // Creating a new user object using the User model
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      viewed,
      description,
      status,
    });

    // Saving the user object to the database
    const savedUser = await user.save();
    return res.status(201).json({ user: savedUser });
  } catch (error) {
    logger.info(`[createUser] error: ${error}`);
    return res.status(500).json({ error });
  }
};

/** Controller function to read all users */
const readAllUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Finding all users from the database
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    logger.info(`[readAllUser] error: ${error}`);
    return res.status(500).json({ error });
  }
};

/** Controller function to read a specific user */
const readUser = async (req: Request, res: Response, next: NextFunction) => {
  const userName = req.params.userName;

  try {
    // Finding a user by name from the database
    const user = await User.findOne({ name: userName });

    // Returning the user if found, otherwise returning a not found response
    return user
      ? res.status(200).json( user )
      : res.status(404).json({ message: "user not found" });
  } catch (error) {
    logger.info(`[readUser] error: ${error}`);
    return res.status(500).json({ error });
  }
};

/** Controller function to update a user */
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userName = req.params.userName;

  try {
    // Finding a user by name from the database
    const user = await User.findOne({ name: userName });

    if (user) {
      // Updating the user with the request body
      user.set(req.body);

      // Saving the updated user to the database
      const updatedUser = await user.save();
      return res.status(201).json({ user: updatedUser });
    } else {
      // Returning a not found response
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    logger.info(`[updateUser] error: ${error}`);
    return res.status(500).json({ error });
  }
};

/** Controller function to delete a user */
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userName = req.params.userName;

  try {
    // Finding a user by name from the database
    const user = await User.findOne({ name: userName });

    if (user) {
      // Deleting the user from the database
      const deletedUser = await User.findOneAndDelete({ name: userName });
      return res.status(201).json({ deletedUser, message: "Deleted" });
    } else {
      // Returning a not found response
      return res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    logger.info(`[deleteUser] error: ${error}`);
    return res.status(500).json({ error });
  }
};

export default { createUser, readUser, readAllUser, updateUser, deleteUser };

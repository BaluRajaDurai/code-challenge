import Joi, { ObjectSchema } from "joi";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model";
import logger from "../config/logger";

/** Middleware function to validate request body using a Joi schema */
export const ValidateJoi = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);

      next();
    } catch (error) {
      logger.error(error);

      return res.status(422).json({ error });
    }
  };
};

/** Schemas for user creation and update */
export const Schemas = {
  user: {
    // Schema for user creation
    create: Joi.object<IUser>({
      name: Joi.string().required().max(32),
      viewed: Joi.boolean().optional(),
      description: Joi.string().allow('').optional().max(100),
      status: Joi.string().valid("new", "complete", "in_progress").required(),
    }),
    // Schema for user update
    update: Joi.object<IUser>({
      name: Joi.string().required().max(32),
      viewed: Joi.boolean().optional(),
      description: Joi.string().allow('').optional().max(100),
      status: Joi.string().valid("new", "complete", "in_progress").required(),
    }),
  },
};

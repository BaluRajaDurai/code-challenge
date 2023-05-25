import express from 'express';
import controller from '../controllers/user.controller';
import { Schemas, ValidateJoi } from '../middleware/joi';

const router = express.Router();

// Route for creating a new user with validation middleware
router.post('/create',ValidateJoi(Schemas.user.create), controller.createUser);

// Route for retrieving all users
router.get('/get', controller.readAllUser);

// Route for retrieving a specific user by username
router.get('/get/:userName', controller.readUser);

// Route for updating a user by username with validation middleware
router.put('/update/:userName',ValidateJoi(Schemas.user.update), controller.updateUser);

// Route for deleting a user by username
router.delete('/delete/:userName', controller.deleteUser);

export = router;
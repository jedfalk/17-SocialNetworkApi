//src/routes/api/userRoutes.ts
import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, removeFriend } from '../../controllers/userController.js';
const router = Router();
// User Routes
router.route('/')
    .get(getAllUsers) // Get all users
    .post(createUser); // Create a new user
router.route('/:userId')
    .get(getUserById) // Get a single user by ID
    .put(updateUser) // Update a user
    .delete(deleteUser); // Delete a user
// Friend Routes
router.route('/:userId/friends/:friendId')
    .post(addFriend) // Add a friend
    .delete(removeFriend); // Remove a friend
export default router;

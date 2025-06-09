import mongoose from 'mongoose';
import { User } from '../models/index.js';
export const getAllUsers = async (_req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (error) {
        console.error('Error getting all users:', error);
        res.status(500).json({ message: error.message });
    }
};
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Requested userId:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.warn('Invalid user ID format:', userId);
            res.status(400).json({ message: 'Invalid user ID format' });
            return;
        }
        const user = await User.findById(userId)
            .populate('thoughts')
            .populate('friends');
        if (!user) {
            console.warn(`User not found with ID: ${userId}`);
            res.status(404).json({ message: 'Couldn’t find user' });
            return;
        }
        console.log('User found:', user);
        res.json(user);
    }
    catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).json({ message: 'Server error', error: err });
    }
};
export const createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        console.log('User created:', newUser);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ message: error.message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
        if (!user) {
            console.warn('No user found with ID:', req.params.userId);
            res.status(404).json({ message: 'No user with this id!' });
            return;
        }
        console.log('User updated:', user);
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            console.warn('No user exists with ID:', req.params.userId);
            res.status(404).json({ message: 'No user exists' });
            return;
        }
        console.log('User deleted:', user);
        res.json({ message: 'User successfully deleted' });
    }
    catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: err.message });
    }
};
export const addFriend = async (req, res) => {
    try {
        console.log(`Adding friend: ${req.params.friendId} to user: ${req.params.userId}`);
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { runValidators: true, new: true });
        if (!user) {
            console.warn('No user found with ID for adding friend:', req.params.userId);
            res.status(404).json({ message: 'No user with this id!' });
            return;
        }
        console.log('Friend added. Updated user:', user);
        res.json(user);
    }
    catch (error) {
        console.error('Error adding friend:', error);
        res.status(400).json({ message: error.message });
    }
};
export const removeFriend = async (req, res) => {
    try {
        console.log(`Removing friend: ${req.params.friendId} from user: ${req.params.userId}`);
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
        if (!user) {
            console.warn('No user found with ID for removing friend:', req.params.userId);
            res.status(404).json({ message: 'No user with this ID' });
            return;
        }
        console.log('Friend removed. Updated user:', user);
        res.json(user);
    }
    catch (err) {
        console.error('Error removing friend:', err);
        res.status(500).json({ message: err.message });
    }
};

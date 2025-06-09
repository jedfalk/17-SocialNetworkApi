import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js';

export const createThought = async (req: Request, res: Response): Promise<void> => {
  try {
    const { thoughtText, username, userId } = req.body;

    if (!thoughtText || !username || !userId) {
      res.status(400).json({ message: 'Missing fields' });
      return;
    }

    const newThought = await Thought.create({ thoughtText, username });

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );

    if (!user) {
      await Thought.findByIdAndDelete(newThought._id);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(201).json(newThought);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateThought = async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'No thought with this id!' });
      return;
    }

    res.json(thought);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllThoughts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (err: any) {
    res.status(500).json({ message: 'Could not get all thoughts' });
  }
};

export const getThoughtById = async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.json(thought);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteThought = async (req: Request, res: Response): Promise<void> => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

    if (!thought) {
      res.status(404).json({ message: 'No thought matches the ID' });
      return;
    }

    res.json({ message: 'Thought deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addReaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const modThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      {
        $push: {
          reactions: {
            reactionBody: req.body.reactionBody,
            username: req.body.username,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!modThought) {
      res.status(404).json({ message: 'Could not find thought' });
      return;
    }

    res.json(modThought);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const modThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );

    if (!modThought) {
      res.status(404).json({ message: 'Could not find thought' });
      return;
    }

    res.json(modThought);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

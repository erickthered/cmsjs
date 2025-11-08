import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get single user by ID (Admin only)
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user (Admin only)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { fullName, nickName, profile, group } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.nickName = nickName || user.nickName;
    user.profile = profile || user.profile;
    user.group = group || user.group;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

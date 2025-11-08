import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import config from '../config';

// Register a new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, fullName, nickName, profile, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const isFirstUser = (await User.countDocuments({})) === 0;
    const group = isFirstUser ? 'admin' : 'editor';

    user = new User({
      email,
      fullName,
      nickName,
      profile,
      password,
      group,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, group: user.group }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during user registration:', error);
    next(error);
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, group: user.group }, config.jwtSecret, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

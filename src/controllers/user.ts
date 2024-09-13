import { RequestHandler } from 'express';
import Users from '../models/user';
import createHttpError from 'http-errors';
import argon from 'argon2';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    const user = await Users.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export const signup: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      throw createHttpError(400, 'Parameters missing');
    }
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, 'User already exists');
    }
    const hashedPassword = await argon.hash(password);
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });
    req.session.userId = user._id;

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  email: string;
  password: string;
}

export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Parameters missing');
    }
    const user = await Users.findOne({ email }).select('password');
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw createHttpError(401, 'Invalid credentials');
    }

    req.session.userId = user._id;
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else res.sendStatus(200);
  });
};

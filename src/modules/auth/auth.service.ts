import bcrypt from "bcrypt";
import db from "../../prisma/db.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";
import { createToken } from "../../utils/jwt.js";
import config from "../../config/index.js";
import ApiError from "../../errors/ApiError.js";

const register = async (payload: RegisterInput) => {
  const existingUser = await db.orm.public.User
    .where({ email: payload.email })
    .first();

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await db.orm.public.User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    phone: payload.phone,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

const login = async (payload: LoginInput) => {
  const user = await db.orm.public.User.first({
    email: payload.email,
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = createToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.accessSecret,
    "1d",
  );

  const refreshToken = createToken(
    {
      userId: user.id,
      role: user.role,
    },
    config.jwt.refreshSecret,
    "7d",
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};

const getMe = async (userId: number) => {
  const user = await db.orm.public.User.first({
    id: userId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

export const authService = {
  register,
  login,
  getMe,
};
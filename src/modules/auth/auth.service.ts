import bcrypt from "bcrypt";
import db from "../../prisma/db.js";
import type { RegisterInput } from "./auth.validation.js";

const register = async (payload: RegisterInput) => {
  const existingUser = await db.orm.public.User
    .where({ email: payload.email })
    .first();

  if (existingUser) {
    throw new Error("User with this email already exists");
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

export const authService = {
  register,
};
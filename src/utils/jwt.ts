import jwt, { type SignOptions } from "jsonwebtoken";

import type { AuthUser } from "../types/auth.js";

export const createToken = (
  payload: AuthUser,
  secret: string,
  expiresIn: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string,
): AuthUser => {
  const decoded = jwt.verify(token, secret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "number" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as AuthUser;
};
import jwt, { type SignOptions } from "jsonwebtoken";

export const createToken = (
  payload: object,
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
) => {
  return jwt.verify(token, secret);
};
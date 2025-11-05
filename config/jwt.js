import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
export const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

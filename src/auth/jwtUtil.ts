import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const validateToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

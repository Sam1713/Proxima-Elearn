import { Request, Response, NextFunction } from 'express';

export const userNameValidator = (username:string): boolean => {
  const userNameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  return userNameRegex.test(username);
};

export const emailValidator = (email:string): boolean => {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
};

export const passwordValidator = (password:string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password)
};
export const validateConfirmPassword = (confirmPassword: string, password: string): boolean => {
  return confirmPassword === password;
};



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

export const titleValidator = (title: string): boolean => {
  return title.length >= 5;
};

/// Validators for feed data

export const validateTitle = (title: string): string | null => {
  if (!title || title.length < 5) {
      return 'Title must be at least 5 characters long.';
  }
  return null;
};

export const validateContent = (content: string): string | null => {
  if (!content || content.length < 20) {
      return 'Content must be at least 20 characters long.';
  }
  return null;
};

export const validateFiles = (files: Express.Multer.File[] | undefined): string | null => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/mp4'];
  
  if (files) {
      for (const file of files) {
          if (!allowedMimeTypes.includes(file.mimetype)) {
              return 'Only image and video files are allowed.';
          }
      }
  }
  return null;
};


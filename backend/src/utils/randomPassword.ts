import { NextFunction } from "express";

export const OTP=(len:number):string=>{
    const digits = '0123456789';
    let otp = '';
  
    for (let i = 0; i < len; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
  
    return otp;
  };
 

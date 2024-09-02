import { Request } from 'express';

export interface feedPostTypes{
    title:string;
    content:string;
    files:[]
}


export interface AuthenticatedRequest extends Request {
  userId?: string; // or any other properties you need
}
  
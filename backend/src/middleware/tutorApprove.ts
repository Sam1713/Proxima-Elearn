import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
import TutorModel from "../models/tutorModal";

 const tutorApprove=async(req: Request, res: Response, next: NextFunction)=>{
    const id=req.userId
    console.log('req',id)
    const tutorDetails=await TutorModel.findById(id)
    console.log('tut',tutorDetails)
    if(!tutorDetails?.isApproved){
        console.log(tutorDetails?.isApproved)
        const tutorApproval=tutorDetails?.isApproved
        return res.json(tutorApproval)
    }
    next()
}
export default tutorApprove
 
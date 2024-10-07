import { NextFunction, Request, Response } from 'express';
import cloudinary from '../../utils/cloudinaryConfig'; 
import CourseModel from '../../models/courseModel'; 
import mongoose from 'mongoose';
import Enrollment from '../../models/enrollementModel';
import CategoryeModel from '../../models/categoryModel';
import Payment from '../../models/paymentModel';
export const uploadCourse = async (req: Request, res: Response) => {
  try {
    const tutorId = req.userId;
    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
    }

    // Extract category ID from the request body
    const categoryId = req.body.category; // Assuming this is the category ID coming from the frontend
    console.log('Category ID:', categoryId);

    // Check if the category exists and is not deleted
    const existingCategory = await CategoryeModel.findOne({ 
      _id: categoryId,
      isDelete: false, // Ensure the category is not deleted
    });
    console.log('Existing Category:', existingCategory);

    // If the category does not exist, return an error
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log('Tutor ID:', tutorId);

    const coverImage = req.files && (req.files as any)['coverImage'] ? (req.files as any)['coverImage'][0] : null;
    const coverVideo = req.files && (req.files as any)['coverVideo'] ? (req.files as any)['coverVideo'][0] : null;

    const videos = req.files && (req.files as any)['videos'] ? (req.files as any)['videos'] : [];
    const videoDescriptions = Array.isArray(req.body.videoDescriptions)
      ? req.body.videoDescriptions
      : [req.body.videoDescriptions];

    let coverImageUrl = '';
    if (coverImage) {
      try {
        const coverImageUpload = await cloudinary.uploader.upload(coverImage.path);
        coverImageUrl = coverImageUpload.secure_url;
      } catch (error) {
        console.error('Error uploading cover image:', error);
        return res.status(500).json({ message: 'Failed to upload cover image' });
      }
    }
    console.log('Cover Image URL:', coverImageUrl);

    let coverVideoUrl = '';
    if (coverVideo) {
      try {
        const coverVideoUpload = await cloudinary.uploader.upload(coverVideo.path, { resource_type: 'video', type: 'authenticated' });
        coverVideoUrl = coverVideoUpload.secure_url;
      } catch (error) {
        console.error('Error uploading cover video:', error);
        return res.status(500).json({ message: 'Failed to upload cover video' });
      }
    }
    console.log('Cover Video URL:', coverVideoUrl);

    const videoUploads = [];
    try {
      for (const video of videos) {
        const uploadResult = await cloudinary.uploader.upload(video.path, { resource_type: 'video' });
        videoUploads.push(uploadResult.secure_url);
      }
    } catch (error) {
      console.error('Error uploading videos:', error);
      return res.status(500).json({ message: 'Failed to upload videos' });
    }
    console.log('Video Uploads:', videoUploads);

    const videosWithDescriptions = videoUploads.map((url, index) => ({
      fileUrl: url,
      description: videoDescriptions[index] || ''
    }));
    console.log('Video Descriptions:', videoDescriptions);

    const course = new CourseModel({
      title: req.body.title,
      category: existingCategory.categoryName, // Use the found category's ID
      description: req.body.description,
      AboutCourse: req.body.AboutCourse,
      lessons: req.body.lessons,
      price: req.body.price,
      coverImageUrl: coverImageUrl,
      coverVideoUrl: coverVideoUrl,
      videos: videosWithDescriptions,
      tutorId: tutorId
    });

    await course.save();
    console.log('Course saved:', course);

    res.status(200).json({ message: 'Course uploaded and saved successfully' });
  } catch (error) {
    console.error('Error uploading course:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const getTutorCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const TutorId = req.userId;
    if (!TutorId) {
      res.status(404).json({ message: "Tutor not found" });
      return;
    }

    const tutorId = new mongoose.Types.ObjectId(TutorId);

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 3; 
    const skip = (page - 1) * limit;
    console.log('sjop',skip)
   const course=await CourseModel.find({isDelete:true})
  //  console.log('cor',course)
    const tutorCourses = await CourseModel.aggregate([
      { $match: { tutorId:tutorId,isDelete:false } }, 
      { $project: {
          _id: 1,
          // courseId: '$_id',
          title: 1,
          category: 1,
          coverImageUrl: 1,
          description: 1,
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalCourses = await CourseModel.countDocuments({ tutorId: tutorId });
    const totalPages = Math.ceil(totalCourses / limit);
   console.log('rt',tutorCourses)
    if(tutorCourses.map(tutor=>tutor?.isDelete==true)){
      res.json({
        courses: tutorCourses,
        totalPages: totalPages,
      });
    }
  } catch (error) {
    console.error('Error fetching tutor courses:', error);
    res.status(500).json({ message: 'An error occurred while fetching the courses.' });
  }
};
// export const getTutorCourseDetail=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
//   const id=req.params.id
//   console.log('id',id)
  
//   const course=await CourseModel.findById(id)
//   const category=await CategoryeModel.find()
//   console.log('ca',category)
//   if(!course){
//     res.status(404).json("Course not Found")
//   }
//   console.log('courses',course)
//   res.json(course)
// }

export const getTutorCourseDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    console.log('id', id);
    
    const course = await CourseModel.findById(id);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    
    const category = await CategoryeModel.find();
    console.log('categories', category);
    console.log('course', course);
    
    res.json({
      course,
      category
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateCourseNonFileDetail=async(req:Request,res:Response):Promise<void>=>{
  const Id=req.params.id
  const {title,category,price,description,AboutCourse}=req.body
  console.log('id',Id)
  const id=new mongoose.Types.ObjectId(Id)
  try {
    const courseUpdate = await CourseModel.findByIdAndUpdate(
      id,
      {
        id,
        title,
        category,
        price,
        description,
        AboutCourse,
        
      },
      { new: true } 
    );

    if (courseUpdate) {
      res.status(200).json(courseUpdate);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};  


export const updateCoverImage = async (req: Request, res: Response): Promise<unknown> => {
  const courseId = req.params.id;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newCoverImageUrl = result.secure_url;
     console.log('new',newCoverImageUrl)
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.coverImageUrl) {
      const oldCoverImagePublicId = getPublicIdFromUrl(course.coverImageUrl);
      await cloudinary.uploader.destroy(oldCoverImagePublicId);
    }
   
    await CourseModel.findByIdAndUpdate(courseId, { coverImageUrl: newCoverImageUrl }, { new: true });

    const updatedCourse = await CourseModel.findById(courseId);
    console.log('up',updatedCourse)
    res.status(200).json({
      message: 'Cover image updated successfully',
      updatedCourse,
    });

  } catch (error) {
    console.error('Error updating cover image:', error);
    res.status(500).json({ message: 'Failed to update cover image' });
  }
};

const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart.split('.')[0];
};

export const updateSubVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('params', req.params.id);
    const courseId = req.params.id;
    console.log('req.file', req.file);
    console.log('des', req.body);

    const file = req.file;
    const { description, videoId } = req.body;

    // Find the course
    const course = await CourseModel.findById(courseId).lean();
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const video = course.videos.find((v: { _id: mongoose.Types.ObjectId }) => v._id.equals(videoObjectId));

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    if (file) {
      const existingPublicId = getPublicIdFromUrl(video.fileUrl);
      await cloudinary.uploader.destroy(existingPublicId);

      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        resource_type: 'video'
      });

      await CourseModel.findOneAndUpdate(
        { _id: courseId, 'videos._id': videoObjectId },
        {
          $set: {
            'videos.$.description': description,
            'videos.$.fileUrl': uploadResponse.secure_url
          }
        },
        { new: true }
      );
    } else {
      await CourseModel.findOneAndUpdate(
        { _id: courseId, 'videos._id': videoObjectId },
        { $set: { 'videos.$.description': description } },
        { new: true }
      );
    }

    const updatedCourse = await CourseModel.findById(courseId).exec();
    if (!updatedCourse) {
      res.status(404).json({ error: 'Course not found after update' });
      return;
    }

    res.status(200).json({ message: 'Video updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating sub-video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllPurchasedStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('gail');
    const TutorId=req.userId
    const page=parseInt(req.query.page as string)||1
    const limit=parseInt(req.query.limit as string)||10
    const totalDoc=await Enrollment.countDocuments()
    const skip=(page-1)*limit
    const tutorId=new mongoose.Types.ObjectId(TutorId)
    const studentDetails = await Enrollment.aggregate([
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'Courses'
        }
      },
      {
        $unwind: { path: '$Courses' }
      },
      {
        $match: {
          'Courses.tutorId': tutorId 
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'Student'
        }
      },
      {
        $unwind: { path: '$Student' }
      },
      
      {
        $project: {
          "_id": 0,
          "title": "$Courses.title",         
          "category": "$Courses.category",   
          "username": "$Student.username",   
          "email": "$Student.email",        
          "profilePic": "$Student.profilePic" 
        }
      },
      {
        $sort:{
          createdAt:-1
        }
      },
      {
        $skip:skip
      },
      {
        $limit:limit
      }
    ]);

    const totalPages=Math.ceil(totalDoc/limit)
    console.log('tot',totalPages)

    console.log('cour', studentDetails);

    res.status(200).json({studentDetails,totalPages});

  } catch (error) {
    console.error('Error fetching purchased students:', error);
    res.status(500).json({ error: 'An error occurred while fetching purchased students' });
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
  const id = req.params.id;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await CourseModel.findByIdAndUpdate(
      id,
      { $set: { isDelete: true } }, 
      { new: true } 
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course successfully deleted', course });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWalletDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const TutorId = req.userId; 
    const tutorId = new mongoose.Types.ObjectId(TutorId);
    console.log('Tutor ID:', tutorId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    
    const totalAmount = await Payment.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'EnrolledCourses'
        }
      },
      {
        $unwind: '$EnrolledCourses'
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'EnrolledCourses.courseId',
          foreignField: '_id',
          as: 'CourseDetails'
        }
      },
      {
        $unwind: '$CourseDetails'
      },
      {
        $lookup:{
          from: 'students',
          localField: 'EnrolledCourses.studentId',
          foreignField: '_id',
          as: 'StudentDetails'
        }
      },
      {
        $unwind: { path: '$StudentDetails' }
      },
      {
        $match: {
          'CourseDetails.tutorId': tutorId
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    console.log('totalAmont',totalAmount)

    const totalAmountValue = totalAmount[0]?.totalAmount || 0;

    const deductedAmount = totalAmountValue * 0.7;
    const balanceAmount = totalAmountValue - deductedAmount;

    const walletDetails = await Payment.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'EnrolledCourses'
        }
      },
      {
        $unwind: '$EnrolledCourses'
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'EnrolledCourses.courseId',
          foreignField: '_id',
          as: 'CourseDetails'
        }
      },
      {
        $unwind: '$CourseDetails'
      },
      {
        $lookup: {
          from: 'students',
          localField: 'EnrolledCourses.studentId',
          foreignField: '_id',
          as: 'StudentDetails'
        }
      },
      {
        $unwind: { path: '$StudentDetails' }
      },
      {
        $match: {
          'CourseDetails.tutorId': tutorId
        }
      },
      {
        $project: {
          _id: 1,
          studentName: '$StudentDetails.username',
          courseId: '$CourseDetails._id',
          courseTitle: '$CourseDetails.title',
          amountPaid: '$amount',
          paymentDate: '$created_at'
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    const totalDocResult = await Payment.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: 'enrollmentId',
          foreignField: '_id',
          as: 'EnrolledCourses'
        }
      },
      {
        $unwind: '$EnrolledCourses'
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'EnrolledCourses.courseId',
          foreignField: '_id',
          as: 'CourseDetails'
        }
      },
      {
        $unwind: '$CourseDetails'
      },
     
      {
        $match: {
          'CourseDetails.tutorId': tutorId
        }
      },
      {
        $count: 'totalDocs'
      }
    ]);
console.log('s',walletDetails)
    const totalDoc = totalDocResult[0]?.totalDocs || 0;
    console.log('totalDoc:', totalDoc);
    const totalPages = Math.ceil(totalDoc / limit);

    res.status(200).json({ walletDetails,totalAmount, deductedAmount, balanceAmount, totalPages });
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllCategoryTutor=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('gai')
  try{
   const categories=await CategoryeModel.find({isDelete:false})
   if(!categories){
    res.json('No categories found')
   }
   res.json(categories)
   console.log('ca',categories)
  }catch(error){
    console.log('er',error)
  }

}

export const getSearchResultsCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const searchValue = req.query.q as string;

    // Check if a search term is provided
    if (!searchValue) {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    console.log('Search Term:', searchValue);

    const searchResults = await CourseModel.find({
      title: { $regex: searchValue, $options: 'i' }, 
      isDelete:false
    });
    console.log('searchResults',searchResults)

    // Send the search results back to the client
    res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPriceBasedCourse=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  console.log('reached..khk')
  const minPrice = parseFloat(req.query.minPrice as string) || 0; 
  const maxPrice = parseFloat(req.query.maxPrice as string) || Infinity; 

  console.log('min',minPrice)
  console.log('max',maxPrice)

  const courses=await CourseModel.find({
      price: { $gte: minPrice, $lte: maxPrice },
      isDelete:false    
  })
  console.log('cor',courses)
  if(!courses){
    res.json('No Courses found')
  }
  res.json(courses)
  console.log('cour',courses)

}


export const getCategorySort=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try{
  const catValue=req.query.category as string
  console.log('ca',catValue)
  const cat=await CourseModel.find({
    isDelete:false,
    category:{ $regex: catValue, $options: 'i' }
  })
  if(!cat){
    res.json('No course Found')
  }
  console.log('ca',cat)
  res.json(cat)
  }catch(error){
    console.log('er',error)
  }
}
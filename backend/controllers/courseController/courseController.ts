import { Request, Response } from 'express';
import cloudinary from '../../utils/cloudinaryConfig'; 
import CourseModel from '../../models/courseModel'; 

export const uploadCourse = async (req: Request, res: Response) => {
  try {
    console.log('sdfsdf')
    const tutorId = req.userId;
    if (!tutorId) {
      return res.status(400).json({ message: 'Tutor ID is required' });
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
console.log('imageurl',coverImageUrl)
    let coverVideoUrl = '';
    if (coverVideo) {
      try {
        const coverVideoUpload = await cloudinary.uploader.upload(coverVideo.path, { resource_type: 'video' });
        coverVideoUrl = coverVideoUpload.secure_url;
      } catch (error) {
        console.error('Error uploading cover video:', error);
        return res.status(500).json({ message: 'Failed to upload cover video' });
      }
    }
console.log('urlVideo',coverVideoUrl)
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
  console.log('videoUp',videoUploads)
    const videosWithDescriptions = videoUploads.map((url, index) => ({
      fileUrl: url,
      description: videoDescriptions[index] || '' 
    }));
 console.log('fefe',videoDescriptions)
    const course = new CourseModel({
      title: req.body.title,
      category: req.body.category,
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

import { Request, Response, NextFunction } from 'express';
import { feedPostTypes } from '../../types/feedTypes';
import cloudinary from '../../utils/cloudinaryConfig';
import Feed from '../../models/FeedModel';
import { validateTitle, validateContent, validateFiles } from '../../utils/validator';
import { AuthenticatedRequest } from '../../types/feedTypes'; // Ensure this is correctly defined
import { formatDistanceToNow } from 'date-fns';
import { formatTimestamp } from '../../utils/date';

interface FeedFile {
    url: string;
    fileType: string;
}

const determineFileType = (mimetype: string): string => {
    if (mimetype.startsWith('image/')) {
        return 'image';
    } else if (mimetype.startsWith('video/')) {
        return 'video';
    }
    return 'unknown';
};

export const feedPost = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const { title, content } = req.body as { title: string; content: string };
        const files = req.files as Express.Multer.File[] | undefined;
      
        console.log('auth', req.userId);
        console.log('Received title:', title);
        console.log('Received content:', content);
        console.log('Received files:', files);
        console.log('userid', req.userId);

        // Validate title
        const titleError = validateTitle(title);
        if (titleError) {
            console.log('Title validation error:', titleError);
            return res.status(400).json({ message: titleError });
        }

        // Validate content
        const contentError = validateContent(content);
        if (contentError) {
            console.log('Content validation error:', contentError);
            return res.status(400).json({ message: contentError });
        }

        // Validate files
        const filesError = validateFiles(files);
        if (filesError) {
            console.log('Files validation error:', filesError);
            return res.status(400).json({ message: filesError });
        }

        let fileArray: FeedFile[] = [];
        console.log('Starting file uploads...');

        if (files) {
            const fileUploads = files.map(async (file) => {
                try { 
                    const uploader = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto' // Handle both images and videos
                    });
                    const fileType = determineFileType(file.mimetype);
                    return { url: uploader.url, fileType };
                } catch (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw uploadError; // Rethrow to handle it in the catch block
                }
            });

            fileArray = await Promise.all(fileUploads);
        }

        console.log('Uploaded file array:', fileArray);

        const newFeed = new Feed({
            student: req.userId,
            title,
            content,
            files: fileArray
        });
    //   console.log('feed',newFeed)
        await newFeed.save();
        const formattedTimestamp = formatTimestamp(newFeed.createdAt!);

        return res.status(200).json({
            message: 'Data received and saved successfully',
            data: {
                student: req.userId,
                title,
                content,
                files: fileArray,
                timestamp: formattedTimestamp
            }
        });
    } catch (error) {
        console.error('Error occurred:', error);
        next(error);
    }
};

export const getFeedPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log('dsfsdfsd')
     
        const feeds = await Feed.aggregate([
            {
                $lookup: {
                    from: 'students', 
                    localField: 'student', 
                    foreignField: '_id',
                    as: 'userDetails' 
                }
            },
            {
                $unwind: '$userDetails' 
            },
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    title: 1,
                    content: 1, 
                    files: 1,
                    'userDetails.username': 1,
                    'userDetails.email': 1,
                    'userDetails.profilePic':1
                }
            },{
                $sort: { createdAt: -1 }
            }
        ]);
        console.log('feed',feeds)

        res.json(feeds);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}; 
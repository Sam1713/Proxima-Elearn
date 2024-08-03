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
      console.log('feed',newFeed)
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

export const getFeedPage = async (req: Request, res: Response, next: NextFunction): Promise<unknown> => {
    try {
        console.log('sdfdsfsdf')
        // Extract the studentId from the request (assumed to be part of the request object)
        const studentId = req.userId; // Adjust as needed, depending on how the studentId is passed
        console.log('st',studentId)
        if (!studentId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Query MongoDB for feeds by studentId
        const feeds = await Feed.find({ student: studentId }).exec();
        console.log('feeds',feeds)

        // Log the fetched feeds for debugging

        // Send the feeds as a JSON array of objects
        res.json(feeds);
    } catch (error) {
        // Handle errors
        console.error('Error fetching feeds:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


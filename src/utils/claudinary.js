import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (filePath) => {
  try {
    if(!filePath){
      return null; 
    }
    const result = await cloudinary.uploader.upload(filePath, {
      // folder: 'your_folder_name', // Optional: specify a folder in Cloudinary
      resource_type: 'auto',
      overwrite: true,
      unique_filename: false,
      use_filename: true
    });
    await fs.unlink(filePath); // Remove the file from local storage after upload
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    await fs.unlink(filePath); // Ensure the file is removed even if upload fails
    return null;
  }
}
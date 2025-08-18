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
    fs.unlink(filePath); // Remove the file from local storage after upload
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error.message);
    fs.unlink(filePath); // Ensure the file is removed even if upload fails
    return null;
  }
}

export const deleteImage = async (fileUrl) => {
  try {
    if(!fileUrl) {
      return null; 
    }
    const publicId = fileUrl.split('/').pop().split('.')[0]; // Extract public ID from URL
    // If the url has transformation parameters etc then the better approach would be to have a public Id stored in the database like the url and then use that to delete the image.

    await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
    console.log(`Image with public ID ${publicId} deleted successfully.`);
    return true; // Return true if deletion was successful
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    return false; // Return false if deletion failed
  }
} 
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME_FILES,
  api_key: process.env.CLOUDINARY_API_KEY_FILES,
  api_secret: process.env.CLOUDINARY_API_SECRET_FILES,
});

const cloudinaryFile = require('../utils/cloudinaryFile');

const uploadCSV = async (filePath) => {
  const result = await cloudinaryFile.uploader.upload(filePath, {
    resource_type: 'raw',
    folder: 'csv_reports'
  });
  return result.secure_url;
};


module.exports = cloudinary;

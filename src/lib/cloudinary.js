import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper function to upload files to Cloudinary
 * @param {string} file - The file to upload (base64 string, URL, or file path)
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFile = async (file, folder = 'uploads') => {
  try {
    // If file is a Buffer or ArrayBuffer, use upload_stream
    if (file instanceof Buffer || file instanceof ArrayBuffer) {
      // Convert ArrayBuffer to Buffer if needed
      const buffer = file instanceof Buffer ? file : Buffer.from(file);
      return await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              resolve({ success: false, error: error.message });
            } else {
              resolve({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          }
        );
        stream.end(buffer);
      });
    }
    // Otherwise, treat as string/URL
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto',
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

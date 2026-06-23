import { v2 as cloudinary } from 'cloudinary'

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary environment variables')
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  })
}

export async function uploadImageBuffer(buffer, filename) {
  // cloudinary.uploader.upload_stream expects a stream-like input
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jewelry',
        public_id: filename ? filename.replace(/\s+/g, '_') : undefined,
        resource_type: 'image',
        overwrite: true,
      },
      (err, result) => {
        if (err) return reject(err)
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      },
    )

    // Write buffer into the stream
    uploadStream.end(buffer)
  })
}


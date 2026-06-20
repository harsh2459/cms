const multer  = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store in memory, then upload to Cloudinary
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpeg|jpg|png|gif|pdf|docx|xlsx)$/i;
    if (allowed.test(file.originalname)) cb(null, true);
    else cb(new Error('File type not supported. Allowed: jpeg, jpg, png, gif, pdf, docx, xlsx'));
  },
});

const uploadToCloudinary = (buffer, folder = 'cms', resourceType = 'auto', originalName = null) =>
  new Promise((resolve, reject) => {
    const options = { folder, resource_type: resourceType };
    if (originalName) {
      const ext = originalName.split('.').pop();
      const base = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
      options.public_id = `${base}_${Date.now()}`;
      if (resourceType === 'raw') options.format = ext;
    }
    const stream = cloudinary.uploader.upload_stream(options,
      (err, result) => err ? reject(err) : resolve(result)
    );
    Readable.from(buffer).pipe(stream);
  });

module.exports = { upload, uploadToCloudinary, cloudinary };

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Path to save
const uploadDir = path.join(__dirname, '/commodityUploads');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

// Configuring storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initializing multer with the storage configuration
const upload = multer({ storage: storage });

// Middleware to handle image uploads
const uploadImages = upload.array('images', 10);

module.exports = uploadImages;

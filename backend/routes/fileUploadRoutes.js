const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer destination function called."); // Log the call to destination
    cb(null, 'backend/uploads'); // Set the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    console.log("Multer filename function called."); // Log when filename is being set
    const ext = file.originalname.split('.').pop();
    const filename = `${file.fieldname}-${Date.now()}.${ext}`;
    console.log(`Filename set to: ${filename}`); // Log the final filename
    cb(null, filename); // Set unique filename with timestamp
  }
});

const upload = multer({ storage: storage });

// Route to handle file upload
router.post('/upload', upload.single('file'), (req, res) => {
  console.log("Handling POST /upload"); // Log the request handling
  if (req.file) {
    console.log(`File uploaded successfully: ${req.file.filename}`); // Log success with filename
    res.status(200).json({
      message: 'File uploaded successfully',
      filename: req.file.filename // Include filename in response for confirmation
    });
  } else {
    console.log("No file was uploaded."); // Log if no file was received
    res.status(400).json({
      message: 'No file uploaded'
    });
  }
});

module.exports = router;

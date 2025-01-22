const express = require('express');
const {
    getEmailLayout,
    uploadImage,
    uploadEmailConfig,
    renderAndDownloadTemplate,
    upload, // Import multer instance
} = require('../controller/templateController');

const router = express.Router();

// Routes
router.get('/getEmailLayout', getEmailLayout);
router.post('/uploadImage', upload.single('image'), uploadImage); // Use multer middleware here
router.post('/emailConfig', uploadEmailConfig);
router.post('/download', renderAndDownloadTemplate);

module.exports = router;

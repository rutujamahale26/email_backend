const Template = require('../model/templateModel.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage }); // Use this in routes for file uploads

// Get Email Layout
const getEmailLayout = async (req, res) => {
    try {
        const layoutPath = path.resolve(__dirname, '../public/layout.html');
        fs.readFile(layoutPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading layout file:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error reading layout file',
                });
            }
            res.status(200).send(data);
        });
    } catch (error) {
        console.error('Error in fetching layout:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// Upload Image
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: imageUrl,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
        });
    }
};

// Upload Email Config
const uploadEmailConfig = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const template = new Template({ title, content, imageUrl });
        await template.save();
        res.status(201).json(template);
    } catch (error) {
        console.error('Error in saving email template:', error);
        res.status(500).json({
            success: false,
            message: 'Error in saving email template',
        });
    }
};


const renderAndDownloadTemplate = async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;

        // Ensure all necessary data is provided
        if (!title || !content || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and image URL are required.',
            });
        }

        // Ensure the file path is correct
        const layoutPath = path.join(__dirname, '..', 'public', 'layout.html');  // Adjust path if needed
        console.log('Layout path:', layoutPath);  // Log the path for debugging

        fs.readFile(layoutPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading layout file:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error reading layout file',
                });
            }

            // Replace placeholders in the layout with the actual content
            const renderedHtml = data
                .replace('{{title}}', title)
                .replace('{{content}}', content)
                .replace('{{imageUrl}}', imageUrl);

            // Set headers for downloading the file
            res.setHeader('Content-disposition', 'attachment; filename=email-template.html');
            res.setHeader('Content-type', 'text/html');
            
            // Send the rendered HTML content as a file
            res.send(renderedHtml);  // Ensure this is the rendered HTML, not JSON
        });
    } catch (error) {
        console.error('Error in rendering email template:', error);
        res.status(500).json({
            success: false,
            message: 'Error in rendering email template',
        });
    }
};


module.exports = {
    getEmailLayout,
    uploadImage,
    uploadEmailConfig,
    renderAndDownloadTemplate,
    upload, // Export multer instance for use in routes
};

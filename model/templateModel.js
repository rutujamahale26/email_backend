// templateModel.js

const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Template', templateSchema);

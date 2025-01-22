// server.js
const express = require('express');
require('dotenv').config();
const connectDB = require('./database/db.js');
const templateRoutes = require('./router/templateRoutes.js');
const cors = require('cors');
const path = require('path')

const app = express();

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to DB
connectDB();

// Routes
app.use('/api/email', templateRoutes);

app.get('/', (req, res)=>{
    res.send('Hello from server')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

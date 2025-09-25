// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ServerlessHttp = require('serverless-http');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

dotenv.config();


const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}


const server = express();

// middleware setup
server.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5137',
    credentials: true, // This allows the session cookie to be sent
}));
server.use(express.json());

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose.connect(uri)
    .then(() => {console.log('Connected to mongoDB!')})
    .catch(err => {console.error('Could not connect to mongoDB:', err)});





const taskSchema = new mongoose.Schema({
    id: Number,
    text: String,
    completed: Boolean
});

const listSchema = new mongoose.Schema({
    id: Number,
    name: String,
    completed: Boolean,
    current: Boolean,
    tasks: [taskSchema],
    pinned: Boolean
});

const userSchema = new mongoose.Schema({
    username : { type: String, required: true, unique: true},
    password : { type: String, required: true},
    lists : [listSchema]
});


const User = mongoose.model('User', userSchema);


// Hash pasword before saving user
const hashPassword = async (password) =>{
    try{
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}


const authenticateToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send('No token provided. Unauthorized');
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token. Forbidden');
        }
        // Attach the user ID from the token payload to the request object
        req.userId = user.id;
        next();
    });
};


// Middleware to protect routes
server.use('/users/:userId/lists', authenticateToken);

// Create a new user
server.post('/users', async (req, res) =>{
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password : hashedPassword, lists: [] });
    try {
        await newUser.save();

        // Generate JWT tokens
        const accessToken = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: '7d' });

        res.status(201).json({ message: 'User created', id: newUser._id, user: newUser, accessToken: accessToken, refreshToken: refreshToken });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});


// Update user's todo lists
server.put('/users/:userId/lists', async (req, res) => {
    try {
        const newLists = req.body.lists; // The full array of new lists

        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { lists: newLists } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.json(updatedUser.todoLists);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


// Get user's todo lists
server.get('/users/:userId/lists', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user.lists);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// User login
server.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find the user in the database
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch === false) {
            return res.status(401).send('Invalid username or password');
        }


        // Generate JWT tokens
        const accessToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });


        res.status(200).send({message: 'Login successful', id: user._id, accessToken: accessToken, refreshToken: refreshToken });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

server.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (refreshToken == null) {
        return res.status(401).send('Refresh Token Required');
    }

    jwt.verify(refreshToken, jwtSecret, (err, user) => {
        if (err) {
            // The refresh token is invalid or expired
            return res.status(403).send('Invalid Refresh Token');
        }
        
        // If valid, issue a new access token
        const newAccessToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1d' });
        
        res.status(200).send({ accessToken: newAccessToken });
    });
});


server.get('/status', authenticateToken, (req, res) => {
    res.status(200).json({ isLoggedIn: true, userId: req.userId });
});


const connectAndServe = async (event, context) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
    return ServerlessHttp(server)(event, context);
};

module.exports.handler = connectAndServe;

// For local testing

// server.listen(3001, () => {
//     console.log('Server is running on port 3001');
// });
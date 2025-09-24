import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import ServerlessHttp from 'serverless-http';
import bycrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();


const port = 3001;
const server = express();

server.use(cors());
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
        const salt = await bycrypt.genSalt(10);
        return bycrypt.hash(password, salt);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}



// Create a new user
server.post('/users', async (req, res) =>{
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, password : hashedPassword, lists: [] });
    try {
        await newUser.save();
        res.status(201).json({ message: 'User created', id: newUser._id, user: newUser });
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

        const passwordMatch = await bycrypt.compare(password, user.password);
        if (passwordMatch === false) {
            return res.status(401).send('Invalid username or password');
        }

        res.status(200).send({message: 'Login successful', id: user._id});
    } catch (err) {
        res.status(500).send(err.message);
    }
});


const connectAndServe = async (event, context) => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
    }
    return ServerlessHttp(server)(event, context);
};

export const handler = connectAndServe;
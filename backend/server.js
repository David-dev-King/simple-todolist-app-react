import express from 'express';
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import ServerlessHttp from 'serverless-http';
import http from 'http';




mongoose.connect('mongodb://127.0.0.1:27017/todolistDB')
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


const port = 3001;
const server = express();

server.use(cors());
server.use(express.json());



// Create a new user
server.post('/users', async (req, res) =>{
    const { username, password } = req.body;
    const newUser = new User({ username, password, lists: [] });
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

        // In a real application, you would compare the provided password
        // with the hashed password stored in the database.
        if (password !== user.password) {
            return res.status(401).send('Invalid username or password');
        }

        res.status(200).send({message: 'Login successful', id: user._id});
    } catch (err) {
        res.status(500).send(err.message);
    }
});



server.listen(port, () => {
    console.log("running on port 3001");
});


export const handler = ServerlessHttp(server);
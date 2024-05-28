const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

import userRouter from './routes/user';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/tradeTix-DB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

app.get('/api/ping', (req, res) => {
    res.send('Pong');
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use('/api/users', userRouter);

app.post('/api/signup', async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        const alreadyUser = await User.findOne({ username });

        if (alreadyUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = new User({ username, name, email, password });
        await newUser.save();

        return res.status(201).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
        console.error('Error signing up:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        return res.status(200).json({ message: 'Sign in successful', user });
    } catch (error) {
        console.error('Error signing in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

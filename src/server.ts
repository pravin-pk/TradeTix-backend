import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { setupSwagger } from './configs/swagger.config';
import cors from 'cors';

// Routes
import userRouter from './routers/user.router';
import ticketRouter from './routers/ticket.router';

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://tradetix-mongodb-service:27017/tradeTix-DB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Swagger
setupSwagger(app);

app.get('/api/ping', (req, res) => {
    res.send({ response: 'pong'});
});

app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

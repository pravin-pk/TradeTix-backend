import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { setupSwagger } from './configs/swagger.config';
import cors from 'cors';

// Routes
import userRouter from './routers/user.router';
import ticketRouter from './routers/ticket.router';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));

// Swagger
setupSwagger(app);

app.get('/api/ping', (req, res) => {
    res.send({ response: 'pong'});
});

app.get('/api/health', (req, res) => {
    res.send({ 
        status: 'UP', 
        uptime: process.uptime(),
        timestamp: new Date().toISOString() 
    });
});

app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

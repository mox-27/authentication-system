import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();
const port = process.env.PORT || 3000;

// Custom Routes
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_BASE_URL
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send("Server is running"));

app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
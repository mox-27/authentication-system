import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

// Custom Routes
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send("Server is running"));

app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server is running on port: ${port}`));
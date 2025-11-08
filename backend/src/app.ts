import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import config from './config';
import connectDB from './database';
import authRoutes from './routes/authRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); // Enable JSON body parser

app.use('/api/auth', authRoutes);

const port = config.port;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




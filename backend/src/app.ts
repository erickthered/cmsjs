import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import config from './config';
import connectDB from './database';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json()); // Enable JSON body parser

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const startServer = async () => {
  await connectDB();
  const port = config.port;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;




import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import config from './config';
import connectDB from './database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import articleRoutes from './routes/articleRoutes';
import settingsRoutes from './routes/settingsRoutes';

dotenv.config();

const app = express();

app.use(express.json()); // Enable JSON body parser

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/settings', settingsRoutes);

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




import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import config from './config';

dotenv.config();

const app = express();
const port = config.port;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { router } from './routes';
import cors from 'cors';
import 'dotenv/config';
import { AppError } from './shared/errors/AppError';

const app = express();

app.use(express.json())
app.use(cors());
app.use(router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

app.listen(3333, () => console.log('Servidor Oline!'))

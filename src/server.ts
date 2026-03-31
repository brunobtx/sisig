import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { router } from './routes';
import cors from 'cors';
import 'dotenv/config';
import { AppError } from './shared/errors/AppError';
import { attachRequestMetadata } from './shared/infra/middlewares/request-metadata';

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '');
}

function getAllowedCorsOrigins(): string[] {
  const configuredOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'];

  return configuredOrigins
    .map(normalizeOrigin)
    .filter((origin) => origin.length > 0);
}

const app = express();
const port = Number(process.env.PORT ?? process.env.APP_PORT ?? 3333);
const allowedCorsOrigins = getAllowedCorsOrigins();

app.use(attachRequestMetadata);
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowed = allowedCorsOrigins.includes(normalizedOrigin);

      return callback(null, isAllowed);
    },
  }),
);
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

app.listen(port, () => console.log(`Servidor online na porta ${port}!`));

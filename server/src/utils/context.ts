import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

export interface User {
  id: string;
  role: string;
  email: string;
}

export interface Context {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  redis: ReturnType<typeof createClient>;
  user?: User;
}

export const createContext = ({ req, res, prisma, redis }: {
  req: Request;
  res: Response;
  prisma: PrismaClient;
  redis: ReturnType<typeof createClient>;
}): Context => {
  return {
    req,
    res,
    prisma,
    redis
  };
};
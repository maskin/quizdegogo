import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from 'redis';

import { UserResolver } from './graphql/resolvers/UserResolver';
import { QuizResolver } from './graphql/resolvers/QuizResolver';
import { AuthResolver } from './graphql/resolvers/AuthResolver';
import { AnalyticsResolver } from './graphql/resolvers/AnalyticsResolver';
import { authChecker } from './middleware/authChecker';
import { createContext } from './utils/context';
import { logger } from './utils/logger';
import { PrismaClient } from '@prisma/client';

dotenv.config();

async function startServer() {
  try {
    // Initialize database
    const prisma = new PrismaClient();
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Initialize Redis
    const redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redis.connect();
    logger.info('Redis connected successfully');

    // Build GraphQL schema
    const schema = await buildSchema({
      resolvers: [UserResolver, QuizResolver, AuthResolver, AnalyticsResolver],
      authChecker,
      validate: false,
    });

    // Create Apollo Server
    const server = new ApolloServer({
      schema,
      context: ({ req, res }) => createContext({ req, res, prisma, redis }),
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
    });

    await server.start();

    // Create Express app
    const app = express();

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));

    // CORS configuration
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    }));

    app.use(express.json({ limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // Apply GraphQL middleware
    server.applyMiddleware({ 
      app, 
      path: '/graphql',
      cors: false // We handle CORS above
    });

    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT, () => {
      logger.info(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer().catch((error) => {
  logger.error('Unhandled error during startup:', error);
  process.exit(1);
});
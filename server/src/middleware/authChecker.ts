import { AuthChecker } from 'type-graphql';
import { Context } from '../utils/context';
import { verify } from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const authChecker: AuthChecker<Context> = (
  { context },
  roles
) => {
  try {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return false;
    }

    const decoded = verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    if (!decoded || !decoded.userId) {
      return false;
    }

    // Check if user role matches required roles
    if (roles.length > 0) {
      if (!decoded.role || !roles.includes(decoded.role)) {
        logger.warn(`Insufficient permissions: user role ${decoded.role}, required: ${roles.join(', ')}`);
        return false;
      }
    }

    // Attach user to context
    context.user = {
      id: decoded.userId,
      role: decoded.role,
      email: decoded.email
    };

    return true;
  } catch (error) {
    logger.error('Authentication error:', error);
    return false;
  }
};
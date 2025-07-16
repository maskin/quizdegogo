import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '../types/User';
import { LoginInput, RegisterInput } from '../types/AuthInput';
import { AuthResponse } from '../types/AuthResponse';
import { Context } from '../../utils/context';
import { AuthService } from '../../services/AuthService';
import { logger } from '../../utils/logger';

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => AuthResponse)
  async register(
    @Arg('input') input: RegisterInput,
    @Ctx() ctx: Context
  ): Promise<AuthResponse> {
    try {
      const result = await this.authService.register(input, ctx.prisma);
      logger.info(`New user registered: ${result.user.email}`);
      return result;
    } catch (error) {
      logger.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  }

  @Mutation(() => AuthResponse)
  async login(
    @Arg('input') input: LoginInput,
    @Ctx() ctx: Context
  ): Promise<AuthResponse> {
    try {
      const result = await this.authService.login(input, ctx.prisma);
      logger.info(`User logged in: ${input.email}`);
      return result;
    } catch (error) {
      logger.error('Login error:', error);
      throw new Error('Invalid credentials');
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: Context): Promise<boolean> {
    try {
      if (ctx.user) {
        // Invalidate session in Redis if needed
        logger.info(`User logged out: ${ctx.user.id}`);
      }
      return true;
    } catch (error) {
      logger.error('Logout error:', error);
      return false;
    }
  }
}
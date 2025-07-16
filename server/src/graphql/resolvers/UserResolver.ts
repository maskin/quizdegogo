import { Resolver, Query, Mutation, Arg, Ctx, Authorized } from 'type-graphql';
import { User } from '../types/User';
import { CreateUserInput, UpdateUserInput } from '../types/UserInput';
import { Context } from '../../utils/context';
import { logger } from '../../utils/logger';

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() ctx: Context): Promise<User | null> {
    try {
      if (!ctx.user) return null;
      
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          analytics: {
            orderBy: { date: 'desc' },
            take: 30
          },
          achievements: {
            orderBy: { unlockedAt: 'desc' }
          },
          subscriptions: {
            where: { status: 'ACTIVE' }
          }
        }
      });

      return user;
    } catch (error) {
      logger.error('Error fetching current user:', error);
      throw new Error('Failed to fetch user information');
    }
  }

  @Query(() => [User])
  @Authorized(['ADMIN', 'MODERATOR'])
  async users(
    @Arg('limit', { defaultValue: 20 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: Context
  ): Promise<User[]> {
    try {
      const users = await ctx.prisma.user.findMany({
        skip: offset,
        take: Math.min(limit, 100), // Limit to prevent abuse
        orderBy: { createdAt: 'desc' },
        include: {
          analytics: {
            orderBy: { date: 'desc' },
            take: 1
          }
        }
      });

      return users;
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  @Mutation(() => User)
  @Authorized()
  async updateProfile(
    @Arg('input') input: UpdateUserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          ...input,
          updatedAt: new Date()
        },
        include: {
          analytics: {
            orderBy: { date: 'desc' },
            take: 7
          }
        }
      });

      logger.info(`User profile updated: ${updatedUser.id}`);
      return updatedUser;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  @Mutation(() => Boolean)
  @Authorized()
  async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: { isActive: false }
      });

      logger.info(`User account deactivated: ${ctx.user.id}`);
      return true;
    } catch (error) {
      logger.error('Error deactivating account:', error);
      throw new Error('Failed to deactivate account');
    }
  }
}
import { Resolver, Query, Arg, Ctx, Authorized } from 'type-graphql';
import { UserAnalytics, QuizAnalytics } from '../types/Analytics';
import { Context } from '../../utils/context';
import { logger } from '../../utils/logger';

@Resolver()
export class AnalyticsResolver {
  @Query(() => UserAnalytics, { nullable: true })
  @Authorized()
  async userAnalytics(
    @Arg('userId', { nullable: true }) userId: string,
    @Arg('days', { defaultValue: 30 }) days: number,
    @Ctx() ctx: Context
  ): Promise<UserAnalytics | null> {
    try {
      const targetUserId = userId || ctx.user?.id;
      if (!targetUserId) throw new Error('User ID required');

      // Check permissions
      if (userId && userId !== ctx.user?.id && !['ADMIN', 'MODERATOR'].includes(ctx.user?.role)) {
        throw new Error('Insufficient permissions');
      }

      const analytics = await ctx.prisma.userAnalytics.findMany({
        where: {
          userId: targetUserId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { date: 'desc' }
      });

      // Aggregate analytics data
      const aggregated = analytics.reduce((acc, curr) => {
        acc.questionsAnswered += curr.questionsAnswered;
        acc.correctAnswers += curr.correctAnswers;
        acc.timeSpent += curr.timeSpent;
        acc.quizzesCompleted += curr.quizzesCompleted;
        acc.knowledgeGain += curr.knowledgeGain;
        acc.retentionRate += curr.retentionRate;
        acc.learningVelocity += curr.learningVelocity;
        acc.engagementScore += curr.engagementScore;
        return acc;
      }, {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        quizzesCompleted: 0,
        knowledgeGain: 0,
        retentionRate: 0,
        learningVelocity: 0,
        engagementScore: 0
      });

      // Calculate averages
      const count = analytics.length || 1;
      return {
        ...aggregated,
        knowledgeGain: aggregated.knowledgeGain / count,
        retentionRate: aggregated.retentionRate / count,
        learningVelocity: aggregated.learningVelocity / count,
        engagementScore: aggregated.engagementScore / count,
        date: new Date()
      } as UserAnalytics;

    } catch (error) {
      logger.error('Error fetching user analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }

  @Query(() => [QuizAnalytics])
  @Authorized(['ADMIN', 'EDUCATOR'])
  async quizAnalytics(
    @Arg('quizId') quizId: string,
    @Arg('days', { defaultValue: 30 }) days: number,
    @Ctx() ctx: Context
  ): Promise<QuizAnalytics[]> {
    try {
      const analytics = await ctx.prisma.quizAnalytics.findMany({
        where: {
          quizId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { date: 'desc' }
      });

      return analytics;
    } catch (error) {
      logger.error('Error fetching quiz analytics:', error);
      throw new Error('Failed to fetch quiz analytics');
    }
  }

  @Query(() => UserAnalytics)
  @Authorized(['ADMIN'])
  async globalAnalytics(
    @Arg('days', { defaultValue: 30 }) days: number,
    @Ctx() ctx: Context
  ): Promise<UserAnalytics> {
    try {
      const analytics = await ctx.prisma.userAnalytics.findMany({
        where: {
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        }
      });

      // Aggregate global analytics
      const aggregated = analytics.reduce((acc, curr) => {
        acc.questionsAnswered += curr.questionsAnswered;
        acc.correctAnswers += curr.correctAnswers;
        acc.timeSpent += curr.timeSpent;
        acc.quizzesCompleted += curr.quizzesCompleted;
        acc.knowledgeGain += curr.knowledgeGain;
        acc.retentionRate += curr.retentionRate;
        acc.learningVelocity += curr.learningVelocity;
        acc.engagementScore += curr.engagementScore;
        return acc;
      }, {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
        quizzesCompleted: 0,
        knowledgeGain: 0,
        retentionRate: 0,
        learningVelocity: 0,
        engagementScore: 0
      });

      // Calculate averages
      const count = analytics.length || 1;
      return {
        ...aggregated,
        knowledgeGain: aggregated.knowledgeGain / count,
        retentionRate: aggregated.retentionRate / count,
        learningVelocity: aggregated.learningVelocity / count,
        engagementScore: aggregated.engagementScore / count,
        date: new Date()
      } as UserAnalytics;

    } catch (error) {
      logger.error('Error fetching global analytics:', error);
      throw new Error('Failed to fetch global analytics');
    }
  }
}
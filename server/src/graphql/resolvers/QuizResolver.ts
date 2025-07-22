import { Resolver, Query, Mutation, Arg, Ctx, Authorized, Int } from 'type-graphql';
import { Quiz } from '../types/Quiz';
import { CreateQuizInput, QuizFilterInput } from '../types/QuizInput';
import { QuizAttempt } from '../types/QuizAttempt';
import { Context } from '../../utils/context';
import { logger } from '../../utils/logger';
import { LearningEffectivenessService } from '../../services/LearningEffectivenessService';

@Resolver(Quiz)
export class QuizResolver {
  private learningService = new LearningEffectivenessService();

  @Query(() => [Quiz])
  async quizzes(
    @Arg('filter', { nullable: true }) filter: QuizFilterInput,
    @Arg('limit', { defaultValue: 20 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Ctx() ctx: Context
  ): Promise<Quiz[]> {
    try {
      const where: any = {
        isActive: true,
        isPublic: true
      };

      if (filter?.category) {
        where.category = filter.category;
      }

      if (filter?.difficulty) {
        where.difficulty = {
          gte: filter.difficulty.min || 1,
          lte: filter.difficulty.max || 10
        };
      }

      if (filter?.language) {
        where.language = filter.language;
      }

      if (filter?.tags && filter.tags.length > 0) {
        where.tags = {
          hasSome: filter.tags
        };
      }

      const quizzes = await ctx.prisma.quiz.findMany({
        where,
        skip: offset,
        take: Math.min(limit, 50),
        orderBy: filter?.sortBy === 'popularity' 
          ? { attempts: { _count: 'desc' } }
          : filter?.sortBy === 'newest'
          ? { createdAt: 'desc' }
          : { effectiveness: 'desc' },
        include: {
          questions: {
            select: {
              id: true,
              type: true,
              difficulty: true
            }
          },
          _count: {
            select: {
              attempts: true
            }
          }
        }
      });

      return quizzes;
    } catch (error) {
      logger.error('Error fetching quizzes:', error);
      throw new Error('Failed to fetch quizzes');
    }
  }

  @Query(() => Quiz, { nullable: true })
  async quiz(
    @Arg('id') id: string,
    @Ctx() ctx: Context
  ): Promise<Quiz | null> {
    try {
      const quiz = await ctx.prisma.quiz.findFirst({
        where: {
          id,
          isActive: true,
          OR: [
            { isPublic: true },
            { createdBy: ctx.user?.id }
          ]
        },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            where: { quiz: { isActive: true } }
          },
          analytics: {
            orderBy: { date: 'desc' },
            take: 30
          }
        }
      });

      return quiz;
    } catch (error) {
      logger.error('Error fetching quiz:', error);
      throw new Error('Failed to fetch quiz');
    }
  }

  @Query(() => [Quiz])
  @Authorized()
  async recommendedQuizzes(
    @Arg('limit', { defaultValue: 10 }) limit: number,
    @Ctx() ctx: Context
  ): Promise<Quiz[]> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      // Get user's learning profile and analytics
      const userProfile = await ctx.prisma.user.findUnique({
        where: { id: ctx.user.id },
        include: {
          analytics: {
            orderBy: { date: 'desc' },
            take: 30
          },
          quizAttempts: {
            orderBy: { startedAt: 'desc' },
            take: 20,
            include: {
              quiz: {
                select: {
                  category: true,
                  difficulty: true,
                  tags: true
                }
              }
            }
          }
        }
      });

      if (!userProfile) throw new Error('User profile not found');

      // AI-based recommendation logic
      const recommendations = await this.learningService.generateRecommendations(
        userProfile,
        limit
      );

      return recommendations;
    } catch (error) {
      logger.error('Error generating quiz recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  @Mutation(() => Quiz)
  @Authorized(['ADMIN', 'EDUCATOR'])
  async createQuiz(
    @Arg('input') input: CreateQuizInput,
    @Ctx() ctx: Context
  ): Promise<Quiz> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      const quiz = await ctx.prisma.quiz.create({
        data: {
          ...input,
          createdBy: ctx.user.id,
          questions: {
            create: input.questions.map((q, index) => ({
              ...q,
              order: index
            }))
          }
        },
        include: {
          questions: {
            orderBy: { order: 'asc' }
          }
        }
      });

      logger.info(`Quiz created: ${quiz.id} by user: ${ctx.user.id}`);
      return quiz;
    } catch (error) {
      logger.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz');
    }
  }

  @Mutation(() => QuizAttempt)
  @Authorized()
  async startQuizAttempt(
    @Arg('quizId') quizId: string,
    @Ctx() ctx: Context
  ): Promise<QuizAttempt> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      // Verify quiz exists and is accessible
      const quiz = await ctx.prisma.quiz.findFirst({
        where: {
          id: quizId,
          isActive: true,
          OR: [
            { isPublic: true },
            { createdBy: ctx.user.id }
          ]
        },
        include: {
          questions: true
        }
      });

      if (!quiz) throw new Error('Quiz not found or not accessible');

      const attempt = await ctx.prisma.quizAttempt.create({
        data: {
          userId: ctx.user.id,
          quizId: quiz.id,
          totalQuestions: quiz.questions.length
        },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      logger.info(`Quiz attempt started: ${attempt.id} for quiz: ${quizId}`);
      return attempt;
    } catch (error) {
      logger.error('Error starting quiz attempt:', error);
      throw new Error('Failed to start quiz attempt');
    }
  }

  @Mutation(() => QuizAttempt)
  @Authorized()
  async submitQuizAttempt(
    @Arg('attemptId') attemptId: string,
    @Arg('answers', () => [String]) answers: string[],
    @Ctx() ctx: Context
  ): Promise<QuizAttempt> {
    try {
      if (!ctx.user) throw new Error('Not authenticated');

      const attempt = await ctx.prisma.quizAttempt.findFirst({
        where: {
          id: attemptId,
          userId: ctx.user.id,
          completedAt: null
        },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      if (!attempt) throw new Error('Quiz attempt not found');

      // Calculate score and learning effectiveness
      const { score, learningMetrics, questionAttempts } = await this.learningService
        .calculateLearningEffectiveness(attempt, answers);

      // Update attempt with results
      const completedAttempt = await ctx.prisma.quizAttempt.update({
        where: { id: attemptId },
        data: {
          completedAt: new Date(),
          score,
          correctAnswers: learningMetrics.correctAnswers,
          timeSpent: Math.floor((Date.now() - attempt.startedAt.getTime()) / 1000),
          learningGain: learningMetrics.learningGain,
          retentionScore: learningMetrics.retentionScore,
          engagementScore: learningMetrics.engagementScore,
          questionAttempts: {
            create: questionAttempts
          }
        },
        include: {
          quiz: true,
          questionAttempts: {
            include: {
              question: true
            }
          }
        }
      });

      // Update user analytics
      await this.learningService.updateUserAnalytics(ctx.user.id, completedAttempt);

      logger.info(`Quiz attempt completed: ${attemptId} with score: ${score}`);
      return completedAttempt;
    } catch (error) {
      logger.error('Error submitting quiz attempt:', error);
      throw new Error('Failed to submit quiz attempt');
    }
  }
}
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

export interface LearningMetrics {
  correctAnswers: number;
  learningGain: number;
  retentionScore: number;
  engagementScore: number;
}

export interface QuestionAttemptData {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence?: number;
  hintsUsed: number;
  attempts: number;
}

export interface RecommendationFactors {
  difficultyPreference: number;
  categoryInterests: string[];
  learningVelocity: number;
  retentionPattern: number;
  engagementLevel: number;
}

export class LearningEffectivenessService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Generates AI-powered quiz recommendations based on user learning profile
   */
  async generateRecommendations(userProfile: any, limit: number = 10): Promise<any[]> {
    try {
      logger.info(`Generating recommendations for user: ${userProfile.id}`);

      // Analyze user's learning patterns
      const factors = await this.analyzeLearningFactors(userProfile);
      
      // Get candidate quizzes
      const candidateQuizzes = await this.getCandidateQuizzes(userProfile, factors);
      
      // Score and rank recommendations
      const scoredQuizzes = await this.scoreQuizRecommendations(candidateQuizzes, factors, userProfile);
      
      // Return top recommendations
      return scoredQuizzes.slice(0, limit);
    } catch (error) {
      logger.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Calculates comprehensive learning effectiveness metrics
   */
  async calculateLearningEffectiveness(attempt: any, answers: string[]): Promise<{
    score: number;
    learningMetrics: LearningMetrics;
    questionAttempts: QuestionAttemptData[];
  }> {
    try {
      const startTime = attempt.startedAt.getTime();
      const endTime = Date.now();
      const totalTime = Math.floor((endTime - startTime) / 1000);

      const questions = attempt.quiz.questions;
      let correctAnswers = 0;
      const questionAttempts: QuestionAttemptData[] = [];

      // Process each question attempt
      for (let i = 0; i < questions.length && i < answers.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];
        const isCorrect = this.evaluateAnswer(question, userAnswer);
        
        if (isCorrect) correctAnswers++;

        // Calculate time spent per question (simplified)
        const questionTime = Math.floor(totalTime / questions.length);
        
        // Calculate confidence based on answer time and correctness
        const confidence = this.calculateConfidence(questionTime, question.timeLimit || 60, isCorrect);

        questionAttempts.push({
          questionId: question.id,
          userAnswer,
          isCorrect,
          timeSpent: questionTime,
          confidence,
          hintsUsed: 0, // Would be tracked in a more advanced implementation
          attempts: 1
        });
      }

      // Calculate overall score
      const rawScore = (correctAnswers / questions.length) * 100;
      
      // Apply time-based adjustments
      const timeEfficiency = this.calculateTimeEfficiency(totalTime, attempt.quiz.estimatedTime);
      const adjustedScore = rawScore * (0.8 + 0.2 * timeEfficiency);

      // Calculate learning metrics
      const learningMetrics = await this.calculateLearningMetrics(
        attempt, 
        questionAttempts, 
        correctAnswers,
        timeEfficiency
      );

      return {
        score: Math.min(100, Math.max(0, adjustedScore)),
        learningMetrics,
        questionAttempts
      };
    } catch (error) {
      logger.error('Error calculating learning effectiveness:', error);
      throw new Error('Failed to calculate learning effectiveness');
    }
  }

  /**
   * Updates user analytics with learning data
   */
  async updateUserAnalytics(userId: string, completedAttempt: any): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get or create today's analytics record
      const existingAnalytics = await this.prisma.userAnalytics.findUnique({
        where: {
          userId_date: {
            userId,
            date: today
          }
        }
      });

      const updateData = {
        questionsAnswered: (existingAnalytics?.questionsAnswered || 0) + completedAttempt.totalQuestions,
        correctAnswers: (existingAnalytics?.correctAnswers || 0) + completedAttempt.correctAnswers,
        timeSpent: (existingAnalytics?.timeSpent || 0) + completedAttempt.timeSpent,
        quizzesCompleted: (existingAnalytics?.quizzesCompleted || 0) + 1,
        knowledgeGain: this.calculateKnowledgeGain(completedAttempt),
        retentionRate: completedAttempt.retentionScore,
        learningVelocity: this.calculateLearningVelocity(completedAttempt),
        engagementScore: completedAttempt.engagementScore,
        optimalDifficulty: await this.calculateOptimalDifficulty(userId),
        preferredTopics: await this.updatePreferredTopics(userId, completedAttempt.quiz.category),
      };

      await this.prisma.userAnalytics.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        update: updateData,
        create: {
          userId,
          date: today,
          ...updateData
        }
      });

      logger.info(`Updated analytics for user: ${userId}`);
    } catch (error) {
      logger.error('Error updating user analytics:', error);
      throw new Error('Failed to update user analytics');
    }
  }

  // Private helper methods

  private async analyzeLearningFactors(userProfile: any): Promise<RecommendationFactors> {
    const recentAttempts = userProfile.quizAttempts.slice(0, 10);
    const analytics = userProfile.analytics.slice(0, 7); // Last 7 days

    // Calculate difficulty preference
    const avgDifficulty = recentAttempts.reduce((sum: number, attempt: any) => 
      sum + attempt.quiz.difficulty, 0) / Math.max(recentAttempts.length, 1);

    // Extract category interests
    const categoryFreq = recentAttempts.reduce((freq: any, attempt: any) => {
      freq[attempt.quiz.category] = (freq[attempt.quiz.category] || 0) + 1;
      return freq;
    }, {});
    const categoryInterests = Object.keys(categoryFreq)
      .sort((a, b) => categoryFreq[b] - categoryFreq[a])
      .slice(0, 3);

    // Calculate learning velocity
    const learningVelocity = analytics.reduce((sum: number, day: any) => 
      sum + day.learningVelocity, 0) / Math.max(analytics.length, 1);

    // Calculate retention pattern
    const retentionPattern = analytics.reduce((sum: number, day: any) => 
      sum + day.retentionRate, 0) / Math.max(analytics.length, 1);

    // Calculate engagement level
    const engagementLevel = analytics.reduce((sum: number, day: any) => 
      sum + day.engagementScore, 0) / Math.max(analytics.length, 1);

    return {
      difficultyPreference: avgDifficulty,
      categoryInterests,
      learningVelocity,
      retentionPattern,
      engagementLevel
    };
  }

  private async getCandidateQuizzes(userProfile: any, factors: RecommendationFactors): Promise<any[]> {
    // Get completed quiz IDs to avoid repetition
    const completedQuizIds = userProfile.quizAttempts
      .filter((attempt: any) => attempt.completedAt)
      .map((attempt: any) => attempt.quizId);

    return await this.prisma.quiz.findMany({
      where: {
        isActive: true,
        isPublic: true,
        id: { notIn: completedQuizIds },
        OR: [
          { category: { in: factors.categoryInterests } },
          { 
            difficulty: {
              gte: Math.max(1, factors.difficultyPreference - 1),
              lte: Math.min(10, factors.difficultyPreference + 1)
            }
          }
        ]
      },
      include: {
        questions: {
          select: { id: true, difficulty: true, type: true }
        },
        analytics: {
          orderBy: { date: 'desc' },
          take: 7
        }
      },
      take: 50
    });
  }

  private async scoreQuizRecommendations(
    quizzes: any[], 
    factors: RecommendationFactors, 
    userProfile: any
  ): Promise<any[]> {
    return quizzes.map(quiz => {
      let score = 0;

      // Difficulty match (30% weight)
      const difficultyDiff = Math.abs(quiz.difficulty - factors.difficultyPreference);
      score += (1 - difficultyDiff / 10) * 0.3;

      // Category interest (25% weight)
      if (factors.categoryInterests.includes(quiz.category)) {
        const index = factors.categoryInterests.indexOf(quiz.category);
        score += (1 - index * 0.2) * 0.25;
      }

      // Quiz quality and effectiveness (25% weight)
      score += (quiz.effectiveness || 0) * 0.25;

      // Engagement potential (20% weight)
      const avgEngagement = quiz.analytics.reduce((sum: number, a: any) => 
        sum + a.engagement, 0) / Math.max(quiz.analytics.length, 1);
      score += avgEngagement * 0.2;

      return { ...quiz, recommendationScore: score };
    }).sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  private evaluateAnswer(question: any, userAnswer: string): boolean {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      case 'TRUE_FALSE':
        return userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
      case 'FILL_IN_BLANK':
        // Normalize and compare
        const normalizedAnswer = userAnswer.toLowerCase().trim().replace(/\s+/g, ' ');
        const normalizedCorrect = question.correctAnswer.toLowerCase().trim().replace(/\s+/g, ' ');
        return normalizedAnswer === normalizedCorrect;
      default:
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    }
  }

  private calculateConfidence(timeSpent: number, timeLimit: number, isCorrect: boolean): number {
    // Base confidence on answer speed and correctness
    const timeRatio = Math.min(timeSpent / timeLimit, 1);
    const speedConfidence = 1 - (timeRatio * 0.5); // Faster = more confident
    const correctnessBonus = isCorrect ? 0.3 : -0.2;
    
    return Math.max(0, Math.min(1, speedConfidence + correctnessBonus));
  }

  private calculateTimeEfficiency(actualTime: number, estimatedTime: number): number {
    if (actualTime <= estimatedTime) return 1.0;
    const ratio = estimatedTime / actualTime;
    return Math.max(0.3, ratio); // Minimum 30% efficiency
  }

  private async calculateLearningMetrics(
    attempt: any, 
    questionAttempts: QuestionAttemptData[], 
    correctAnswers: number,
    timeEfficiency: number
  ): Promise<LearningMetrics> {
    // Learning gain based on difficulty progression and accuracy
    const avgQuestionDifficulty = attempt.quiz.questions.reduce((sum: number, q: any) => 
      sum + q.difficulty, 0) / attempt.quiz.questions.length;
    const learningGain = (correctAnswers / attempt.quiz.questions.length) * 
                        (avgQuestionDifficulty / 10) * timeEfficiency;

    // Retention score based on answer confidence and time spent
    const avgConfidence = questionAttempts.reduce((sum, qa) => 
      sum + (qa.confidence || 0), 0) / questionAttempts.length;
    const retentionScore = avgConfidence * 0.7 + timeEfficiency * 0.3;

    // Engagement score based on completion and interaction quality
    const completionRate = questionAttempts.length / attempt.quiz.questions.length;
    const avgTimePerQuestion = questionAttempts.reduce((sum, qa) => 
      sum + qa.timeSpent, 0) / questionAttempts.length;
    const expectedTimePerQuestion = attempt.quiz.estimatedTime / attempt.quiz.questions.length;
    const engagementFromTime = Math.min(1, avgTimePerQuestion / (expectedTimePerQuestion * 0.5));
    const engagementScore = completionRate * 0.5 + engagementFromTime * 0.3 + avgConfidence * 0.2;

    return {
      correctAnswers,
      learningGain: Math.max(0, Math.min(1, learningGain)),
      retentionScore: Math.max(0, Math.min(1, retentionScore)),
      engagementScore: Math.max(0, Math.min(1, engagementScore))
    };
  }

  private calculateKnowledgeGain(attempt: any): number {
    // Simple knowledge gain calculation based on score and difficulty
    return (attempt.score / 100) * (attempt.quiz.difficulty / 10) * attempt.learningGain;
  }

  private calculateLearningVelocity(attempt: any): number {
    // Questions per minute with quality adjustment
    const questionsPerMinute = attempt.totalQuestions / (attempt.timeSpent / 60);
    const accuracyRatio = attempt.correctAnswers / attempt.totalQuestions;
    return questionsPerMinute * accuracyRatio;
  }

  private async calculateOptimalDifficulty(userId: string): Promise<number> {
    const recentAttempts = await this.prisma.quizAttempt.findMany({
      where: { userId, completedAt: { not: null } },
      include: { quiz: { select: { difficulty: true } } },
      orderBy: { completedAt: 'desc' },
      take: 10
    });

    if (recentAttempts.length === 0) return 5; // Default middle difficulty

    // Find difficulty level with best learning outcomes
    const difficultyPerformance = recentAttempts.reduce((acc: any, attempt: any) => {
      const diff = attempt.quiz.difficulty;
      if (!acc[diff]) acc[diff] = { scores: [], count: 0 };
      acc[diff].scores.push(attempt.score);
      acc[diff].count++;
      return acc;
    }, {});

    let bestDifficulty = 5;
    let bestScore = 0;

    Object.keys(difficultyPerformance).forEach(diff => {
      const data = difficultyPerformance[diff];
      const avgScore = data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.count;
      if (avgScore > bestScore && avgScore > 70) { // Only if performance is good
        bestScore = avgScore;
        bestDifficulty = parseInt(diff);
      }
    });

    return bestDifficulty;
  }

  private async updatePreferredTopics(userId: string, newCategory: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferredTopics: true }
    });

    const currentTopics = user?.preferredTopics || [];
    if (!currentTopics.includes(newCategory)) {
      currentTopics.push(newCategory);
      // Keep only top 5 most recent topics
      return currentTopics.slice(-5);
    }

    return currentTopics;
  }
}
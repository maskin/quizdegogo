import { logger } from '../utils/logger';

// Simple in-memory data structures for testing
interface Quiz {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: number;
  language: string;
  tags: string[];
  estimatedTime: number;
  effectiveness: number;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
  order: number;
  timeLimit?: number;
  points: number;
}

interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  quiz: Quiz;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  learningGain: number;
  retentionScore: number;
  engagementScore: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  learningStyle: string;
  difficultyLevel: number;
  preferredTopics: string[];
}

/**
 * Core Quiz Engine - MVP Implementation
 * This demonstrates the foundational quiz logic independent of database/GraphQL
 */
export class CoreQuizEngine {
  private quizzes: Map<string, Quiz> = new Map();
  private users: Map<string, User> = new Map();
  private attempts: Map<string, QuizAttempt> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  /**
   * Initialize with sample quiz data
   */
  private initializeSampleData() {
    // Sample users
    const user1: User = {
      id: 'user-1',
      email: 'test@example.com',
      username: 'testuser',
      learningStyle: 'VISUAL',
      difficultyLevel: 3,
      preferredTopics: ['Programming', 'Mathematics']
    };
    this.users.set(user1.id, user1);

    // Sample quizzes
    const mathQuiz: Quiz = {
      id: 'math-001',
      title: 'Basic Mathematics',
      description: 'Test your fundamental math skills',
      category: 'Mathematics',
      difficulty: 3,
      language: 'en',
      tags: ['math', 'basic', 'arithmetic'],
      estimatedTime: 300,
      effectiveness: 0.75,
      questions: [
        {
          id: 'q1',
          type: 'MULTIPLE_CHOICE',
          question: 'What is 15 + 27?',
          options: ['40', '42', '43', '45'],
          correctAnswer: '42',
          explanation: '15 + 27 = 42',
          difficulty: 2,
          order: 0,
          points: 1,
          timeLimit: 30
        },
        {
          id: 'q2',
          type: 'MULTIPLE_CHOICE',
          question: 'What is 8 × 7?',
          options: ['54', '56', '58', '64'],
          correctAnswer: '56',
          explanation: '8 × 7 = 56',
          difficulty: 3,
          order: 1,
          points: 1,
          timeLimit: 30
        },
        {
          id: 'q3',
          type: 'TRUE_FALSE',
          question: 'Is 144 a perfect square?',
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: '144 = 12²',
          difficulty: 4,
          order: 2,
          points: 1,
          timeLimit: 20
        }
      ]
    };

    const jsQuiz: Quiz = {
      id: 'js-001',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      category: 'Programming',
      difficulty: 4,
      language: 'en',
      tags: ['javascript', 'programming', 'web'],
      estimatedTime: 480,
      effectiveness: 0.85,
      questions: [
        {
          id: 'q4',
          type: 'MULTIPLE_CHOICE',
          question: 'Which of the following is NOT a JavaScript data type?',
          options: ['string', 'boolean', 'float', 'undefined'],
          correctAnswer: 'float',
          explanation: 'JavaScript uses "number" for all numeric values, not "float"',
          difficulty: 3,
          order: 0,
          points: 1,
          timeLimit: 45
        },
        {
          id: 'q5',
          type: 'FILL_IN_BLANK',
          question: 'Complete the code: let arr = [1, 2, 3]; console.log(arr.____);',
          correctAnswer: 'length',
          explanation: 'The length property returns the number of elements in an array',
          difficulty: 2,
          order: 1,
          points: 1,
          timeLimit: 30
        },
        {
          id: 'q6',
          type: 'TRUE_FALSE',
          question: 'JavaScript is a statically typed language.',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'JavaScript is dynamically typed - variables can hold different types',
          difficulty: 3,
          order: 2,
          points: 1,
          timeLimit: 20
        }
      ]
    };

    this.quizzes.set(mathQuiz.id, mathQuiz);
    this.quizzes.set(jsQuiz.id, jsQuiz);
  }

  /**
   * Get all available quizzes with optional filtering
   */
  getAvailableQuizzes(filter?: {
    category?: string;
    difficulty?: { min?: number; max?: number };
    language?: string;
  }): Quiz[] {
    let quizzes = Array.from(this.quizzes.values());

    if (filter?.category) {
      quizzes = quizzes.filter(q => q.category === filter.category);
    }

    if (filter?.difficulty) {
      const { min = 1, max = 10 } = filter.difficulty;
      quizzes = quizzes.filter(q => q.difficulty >= min && q.difficulty <= max);
    }

    if (filter?.language) {
      quizzes = quizzes.filter(q => q.language === filter.language);
    }

    return quizzes.sort((a, b) => b.effectiveness - a.effectiveness);
  }

  /**
   * Get quiz by ID
   */
  getQuiz(quizId: string): Quiz | null {
    return this.quizzes.get(quizId) || null;
  }

  /**
   * Start a new quiz attempt
   */
  startQuizAttempt(userId: string, quizId: string): QuizAttempt | null {
    const quiz = this.quizzes.get(quizId);
    const user = this.users.get(userId);

    if (!quiz || !user) {
      return null;
    }

    const attemptId = `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const attempt: QuizAttempt = {
      id: attemptId,
      userId,
      quizId,
      quiz,
      startedAt: new Date(),
      score: 0,
      totalQuestions: quiz.questions.length,
      correctAnswers: 0,
      timeSpent: 0,
      learningGain: 0,
      retentionScore: 0,
      engagementScore: 0
    };

    this.attempts.set(attemptId, attempt);
    return attempt;
  }

  /**
   * Submit answers and calculate results
   */
  submitQuizAttempt(attemptId: string, answers: string[]): QuizAttempt | null {
    const attempt = this.attempts.get(attemptId);
    if (!attempt || attempt.completedAt) {
      return null;
    }

    const results = this.calculateResults(attempt, answers);
    
    // Update attempt with results
    attempt.completedAt = new Date();
    attempt.score = results.score;
    attempt.correctAnswers = results.correctAnswers;
    attempt.timeSpent = Math.floor((attempt.completedAt.getTime() - attempt.startedAt.getTime()) / 1000);
    attempt.learningGain = results.learningGain;
    attempt.retentionScore = results.retentionScore;
    attempt.engagementScore = results.engagementScore;

    this.attempts.set(attemptId, attempt);
    return attempt;
  }

  /**
   * Core algorithm for calculating quiz results
   */
  private calculateResults(attempt: QuizAttempt, answers: string[]): {
    score: number;
    correctAnswers: number;
    learningGain: number;
    retentionScore: number;
    engagementScore: number;
  } {
    const questions = attempt.quiz.questions;
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    let confidenceSum = 0;

    // Evaluate each answer
    for (let i = 0; i < questions.length && i < answers.length; i++) {
      const question = questions[i];
      const userAnswer = answers[i];
      const isCorrect = this.evaluateAnswer(question, userAnswer);
      
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      
      totalPoints += question.points;
      
      // Calculate confidence based on answer accuracy and question difficulty
      const confidence = isCorrect ? (1.0 - question.difficulty * 0.1) : 0.2;
      confidenceSum += confidence;
    }

    // Calculate base score
    const rawScore = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
    
    // Apply difficulty adjustment
    const avgDifficulty = questions.reduce((sum, q) => sum + q.difficulty, 0) / questions.length;
    const difficultyBonus = (avgDifficulty / 10) * 0.1; // Up to 10% bonus for harder quizzes
    const adjustedScore = Math.min(100, rawScore + (rawScore * difficultyBonus));

    // Calculate learning metrics
    const avgConfidence = confidenceSum / questions.length;
    const completionRate = answers.length / questions.length;
    
    const learningGain = (correctAnswers / questions.length) * (avgDifficulty / 10) * completionRate;
    const retentionScore = avgConfidence * 0.7 + (correctAnswers / questions.length) * 0.3;
    const engagementScore = completionRate * 0.6 + avgConfidence * 0.4;

    return {
      score: Math.max(0, adjustedScore),
      correctAnswers,
      learningGain: Math.max(0, Math.min(1, learningGain)),
      retentionScore: Math.max(0, Math.min(1, retentionScore)),
      engagementScore: Math.max(0, Math.min(1, engagementScore))
    };
  }

  /**
   * Evaluate a single answer
   */
  private evaluateAnswer(question: Question, userAnswer: string): boolean {
    const correct = question.correctAnswer.toLowerCase().trim();
    const user = userAnswer.toLowerCase().trim();

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
        return user === correct;
      case 'FILL_IN_BLANK':
        // Allow for minor variations in fill-in-the-blank
        return user === correct || user.replace(/\s+/g, '') === correct.replace(/\s+/g, '');
      default:
        return user === correct;
    }
  }

  /**
   * Generate quiz recommendations based on user preferences
   */
  generateRecommendations(userId: string, limit: number = 5): Quiz[] {
    const user = this.users.get(userId);
    if (!user) return [];

    // Get user's completed attempts
    const userAttempts = Array.from(this.attempts.values())
      .filter(a => a.userId === userId && a.completedAt);

    // Get completed quiz IDs to avoid repetition
    const completedQuizIds = new Set(userAttempts.map(a => a.quizId));

    // Score remaining quizzes
    const availableQuizzes = Array.from(this.quizzes.values())
      .filter(q => !completedQuizIds.has(q.id));

    const scoredQuizzes = availableQuizzes.map(quiz => {
      let score = 0;

      // Category preference (40% weight)
      if (user.preferredTopics.includes(quiz.category)) {
        const index = user.preferredTopics.indexOf(quiz.category);
        score += (1 - index * 0.2) * 0.4;
      }

      // Difficulty match (30% weight)
      const difficultyDiff = Math.abs(quiz.difficulty - user.difficultyLevel);
      score += (1 - difficultyDiff / 10) * 0.3;

      // Quiz quality (30% weight)
      score += quiz.effectiveness * 0.3;

      return { ...quiz, recommendationScore: score };
    });

    return scoredQuizzes
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);
  }

  /**
   * Get user statistics
   */
  getUserStats(userId: string): {
    totalAttempts: number;
    completedQuizzes: number;
    averageScore: number;
    totalTimeSpent: number;
    preferredCategories: string[];
    strongestAreas: string[];
    improvementAreas: string[];
  } {
    const userAttempts = Array.from(this.attempts.values())
      .filter(a => a.userId === userId && a.completedAt);

    if (userAttempts.length === 0) {
      return {
        totalAttempts: 0,
        completedQuizzes: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        preferredCategories: [],
        strongestAreas: [],
        improvementAreas: []
      };
    }

    const totalScore = userAttempts.reduce((sum, a) => sum + a.score, 0);
    const totalTime = userAttempts.reduce((sum, a) => sum + a.timeSpent, 0);

    // Category performance analysis
    const categoryStats = userAttempts.reduce((stats: any, attempt) => {
      const category = attempt.quiz.category;
      if (!stats[category]) {
        stats[category] = { scores: [], count: 0 };
      }
      stats[category].scores.push(attempt.score);
      stats[category].count++;
      return stats;
    }, {});

    const categoryPerformance = Object.entries(categoryStats).map(([category, data]: [string, any]) => ({
      category,
      averageScore: data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.count,
      count: data.count
    }));

    const strongestAreas = categoryPerformance
      .filter(c => c.averageScore >= 70)
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3)
      .map(c => c.category);

    const improvementAreas = categoryPerformance
      .filter(c => c.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3)
      .map(c => c.category);

    return {
      totalAttempts: userAttempts.length,
      completedQuizzes: userAttempts.length,
      averageScore: totalScore / userAttempts.length,
      totalTimeSpent: totalTime,
      preferredCategories: categoryPerformance
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(c => c.category),
      strongestAreas,
      improvementAreas
    };
  }

  /**
   * Get all users (for testing)
   */
  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Get all attempts (for testing)
   */
  getAttempts(): QuizAttempt[] {
    return Array.from(this.attempts.values());
  }
}
import { CoreQuizEngine } from '../core/QuizEngine';

describe('Core Quiz Engine', () => {
  let engine: CoreQuizEngine;

  beforeEach(() => {
    engine = new CoreQuizEngine();
  });

  describe('Quiz Management', () => {
    test('should list available quizzes', () => {
      const quizzes = engine.getAvailableQuizzes();
      expect(quizzes).toHaveLength(2);
      expect(quizzes[0].title).toContain('JavaScript');
      expect(quizzes[1].title).toContain('Mathematics');
    });

    test('should filter quizzes by category', () => {
      const programmingQuizzes = engine.getAvailableQuizzes({ category: 'Programming' });
      expect(programmingQuizzes).toHaveLength(1);
      expect(programmingQuizzes[0].category).toBe('Programming');
    });

    test('should filter quizzes by difficulty', () => {
      const intermediateQuizzes = engine.getAvailableQuizzes({ 
        difficulty: { min: 3, max: 4 } 
      });
      expect(intermediateQuizzes).toHaveLength(2);
    });

    test('should get quiz by ID', () => {
      const quiz = engine.getQuiz('math-001');
      expect(quiz).toBeTruthy();
      expect(quiz?.title).toBe('Basic Mathematics');
      expect(quiz?.questions).toHaveLength(3);
    });
  });

  describe('Quiz Attempts', () => {
    test('should start a quiz attempt', () => {
      const attempt = engine.startQuizAttempt('user-1', 'math-001');
      expect(attempt).toBeTruthy();
      expect(attempt?.userId).toBe('user-1');
      expect(attempt?.quizId).toBe('math-001');
      expect(attempt?.totalQuestions).toBe(3);
    });

    test('should fail to start attempt with invalid user or quiz', () => {
      const invalidUserAttempt = engine.startQuizAttempt('invalid-user', 'math-001');
      const invalidQuizAttempt = engine.startQuizAttempt('user-1', 'invalid-quiz');
      
      expect(invalidUserAttempt).toBeNull();
      expect(invalidQuizAttempt).toBeNull();
    });

    test('should submit quiz answers and calculate score', () => {
      const attempt = engine.startQuizAttempt('user-1', 'math-001');
      expect(attempt).toBeTruthy();

      const answers = ['42', '56', 'True']; // All correct answers
      const completed = engine.submitQuizAttempt(attempt!.id, answers);

      expect(completed).toBeTruthy();
      expect(completed?.score).toBeGreaterThan(90); // Should be close to 100% for all correct
      expect(completed?.correctAnswers).toBe(3);
      expect(completed?.completedAt).toBeTruthy();
    });

    test('should handle mixed correct/incorrect answers', () => {
      const attempt = engine.startQuizAttempt('user-1', 'math-001');
      expect(attempt).toBeTruthy();

      const answers = ['42', 'wrong', 'True']; // 2/3 correct
      const completed = engine.submitQuizAttempt(attempt!.id, answers);

      expect(completed).toBeTruthy();
      expect(completed?.correctAnswers).toBe(2);
      expect(completed?.score).toBeGreaterThan(50);
      expect(completed?.score).toBeLessThan(80);
    });
  });

  describe('Learning Analytics', () => {
    test('should calculate learning metrics', () => {
      const attempt = engine.startQuizAttempt('user-1', 'math-001');
      const answers = ['42', '56', 'True'];
      const completed = engine.submitQuizAttempt(attempt!.id, answers);

      expect(completed?.learningGain).toBeGreaterThan(0);
      expect(completed?.retentionScore).toBeGreaterThan(0);
      expect(completed?.engagementScore).toBeGreaterThan(0);
      expect(completed?.learningGain).toBeLessThanOrEqual(1);
      expect(completed?.retentionScore).toBeLessThanOrEqual(1);
      expect(completed?.engagementScore).toBeLessThanOrEqual(1);
    });

    test('should generate user statistics', () => {
      // Take two quizzes
      const mathAttempt = engine.startQuizAttempt('user-1', 'math-001');
      engine.submitQuizAttempt(mathAttempt!.id, ['42', '56', 'True']);

      const jsAttempt = engine.startQuizAttempt('user-1', 'js-001');
      engine.submitQuizAttempt(jsAttempt!.id, ['float', 'length', 'False']);

      const stats = engine.getUserStats('user-1');
      expect(stats.totalAttempts).toBe(2);
      expect(stats.completedQuizzes).toBe(2);
      expect(stats.averageScore).toBeGreaterThan(0);
      expect(stats.preferredCategories).toContain('Mathematics');
      expect(stats.preferredCategories).toContain('Programming');
    });
  });

  describe('Recommendation Engine', () => {
    test('should generate recommendations for new user', () => {
      const recommendations = engine.generateRecommendations('user-1', 3);
      expect(recommendations).toHaveLength(2); // Both available quizzes
      expect(recommendations[0]).toHaveProperty('recommendationScore');
    });

    test('should avoid recommending completed quizzes', () => {
      // Complete both quizzes
      const mathAttempt = engine.startQuizAttempt('user-1', 'math-001');
      engine.submitQuizAttempt(mathAttempt!.id, ['42', '56', 'True']);

      const jsAttempt = engine.startQuizAttempt('user-1', 'js-001');
      engine.submitQuizAttempt(jsAttempt!.id, ['float', 'length', 'False']);

      const recommendations = engine.generateRecommendations('user-1', 3);
      expect(recommendations).toHaveLength(0); // No new quizzes to recommend
    });

    test('should prioritize quizzes matching user preferences', () => {
      const recommendations = engine.generateRecommendations('user-1', 3);
      // User prefers Programming and Mathematics, so both should get good scores
      expect(recommendations.every(quiz => (quiz as any).recommendationScore > 0)).toBe(true);
    });
  });

  describe('Answer Evaluation', () => {
    test('should evaluate multiple choice answers correctly', () => {
      const attempt = engine.startQuizAttempt('user-1', 'math-001');
      
      // Test correct answer
      const correctAnswers = ['42', '56', 'True'];
      const completed1 = engine.submitQuizAttempt(attempt!.id, correctAnswers);
      expect(completed1?.correctAnswers).toBe(3);

      // Test incorrect answers
      const attempt2 = engine.startQuizAttempt('user-1', 'math-001');
      const incorrectAnswers = ['40', '54', 'False'];
      const completed2 = engine.submitQuizAttempt(attempt2!.id, incorrectAnswers);
      expect(completed2?.correctAnswers).toBe(0);
    });

    test('should handle fill-in-the-blank questions', () => {
      const attempt = engine.startQuizAttempt('user-1', 'js-001');
      
      // Test exact match
      const exactAnswers = ['float', 'length', 'False'];
      const completed1 = engine.submitQuizAttempt(attempt!.id, exactAnswers);
      expect(completed1?.correctAnswers).toBe(3);

      // Test case insensitive
      const attempt2 = engine.startQuizAttempt('user-1', 'js-001');
      const caseInsensitiveAnswers = ['FLOAT', 'LENGTH', 'false'];
      const completed2 = engine.submitQuizAttempt(attempt2!.id, caseInsensitiveAnswers);
      expect(completed2?.correctAnswers).toBe(3);
    });
  });

  describe('Data Management', () => {
    test('should maintain user data', () => {
      const users = engine.getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe('test@example.com');
    });

    test('should track quiz attempts', () => {
      const initialAttempts = engine.getAttempts();
      expect(initialAttempts).toHaveLength(0);

      engine.startQuizAttempt('user-1', 'math-001');
      const afterStart = engine.getAttempts();
      expect(afterStart).toHaveLength(1);
    });
  });
});
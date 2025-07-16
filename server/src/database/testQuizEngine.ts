import { PrismaClient } from '@prisma/client';
import { LearningEffectivenessService } from '../services/LearningEffectivenessService';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function testQuizEngine() {
  console.log('🧪 Testing Quiz Engine...\n');

  try {
    // Test 1: Get available quizzes
    console.log('1️⃣ Testing quiz retrieval...');
    const quizzes = await prisma.quiz.findMany({
      where: { isActive: true },
      include: {
        questions: true,
        _count: { select: { attempts: true } }
      },
      take: 5
    });
    console.log(`   Found ${quizzes.length} quizzes`);
    quizzes.forEach(quiz => {
      console.log(`   📚 ${quiz.title} (${quiz.category}, difficulty: ${quiz.difficulty})`);
    });

    if (quizzes.length === 0) {
      console.log('   ⚠️  No quizzes found. Run seed first.');
      return;
    }

    // Test 2: Create a quiz attempt
    console.log('\n2️⃣ Testing quiz attempt creation...');
    const testUser = await prisma.user.findFirst({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('   ⚠️  No test user found. Run seed first.');
      return;
    }

    const selectedQuiz = quizzes[0];
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: testUser.id,
        quizId: selectedQuiz.id,
        totalQuestions: selectedQuiz.questions.length
      },
      include: {
        quiz: {
          include: { questions: { orderBy: { order: 'asc' } } }
        }
      }
    });
    console.log(`   ✅ Quiz attempt created: ${attempt.id}`);
    console.log(`   📖 Quiz: ${attempt.quiz.title}`);
    console.log(`   ❓ Questions: ${attempt.quiz.questions.length}`);

    // Test 3: Simulate quiz completion
    console.log('\n3️⃣ Testing quiz scoring and analytics...');
    
    // Simulate answers (mix of correct and incorrect)
    const simulatedAnswers = attempt.quiz.questions.map((question, index) => {
      // Make first answer correct, second incorrect, third correct, etc.
      return index % 2 === 0 ? question.correctAnswer : 'wrong_answer';
    });

    console.log(`   📝 Simulated answers: ${simulatedAnswers.length}`);
    
    const learningService = new LearningEffectivenessService(prisma);
    const { score, learningMetrics, questionAttempts } = await learningService
      .calculateLearningEffectiveness(attempt, simulatedAnswers);

    console.log(`   📊 Results:`);
    console.log(`      Score: ${score.toFixed(1)}%`);
    console.log(`      Correct: ${learningMetrics.correctAnswers}/${attempt.totalQuestions}`);
    console.log(`      Learning Gain: ${(learningMetrics.learningGain * 100).toFixed(1)}%`);
    console.log(`      Retention: ${(learningMetrics.retentionScore * 100).toFixed(1)}%`);
    console.log(`      Engagement: ${(learningMetrics.engagementScore * 100).toFixed(1)}%`);

    // Test 4: Complete the attempt
    console.log('\n4️⃣ Testing attempt completion...');
    const completedAttempt = await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        completedAt: new Date(),
        score,
        correctAnswers: learningMetrics.correctAnswers,
        timeSpent: 180, // 3 minutes
        learningGain: learningMetrics.learningGain,
        retentionScore: learningMetrics.retentionScore,
        engagementScore: learningMetrics.engagementScore,
        questionAttempts: {
          create: questionAttempts
        }
      },
      include: {
        questionAttempts: { include: { question: true } }
      }
    });

    console.log(`   ✅ Attempt completed at: ${completedAttempt.completedAt}`);
    console.log(`   📈 Question attempts recorded: ${completedAttempt.questionAttempts?.length}`);

    // Test 5: Update user analytics
    console.log('\n5️⃣ Testing analytics update...');
    await learningService.updateUserAnalytics(testUser.id, completedAttempt);
    
    const updatedAnalytics = await prisma.userAnalytics.findMany({
      where: { userId: testUser.id },
      orderBy: { date: 'desc' },
      take: 1
    });

    if (updatedAnalytics.length > 0) {
      const analytics = updatedAnalytics[0];
      console.log(`   📊 Analytics updated:`);
      console.log(`      Questions answered: ${analytics.questionsAnswered}`);
      console.log(`      Correct answers: ${analytics.correctAnswers}`);
      console.log(`      Time spent: ${analytics.timeSpent}s`);
      console.log(`      Quizzes completed: ${analytics.quizzesCompleted}`);
    }

    // Test 6: Generate recommendations
    console.log('\n6️⃣ Testing recommendation engine...');
    const userProfile = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        analytics: { orderBy: { date: 'desc' }, take: 7 },
        quizAttempts: {
          orderBy: { startedAt: 'desc' },
          take: 10,
          include: { quiz: { select: { category: true, difficulty: true, tags: true } } }
        }
      }
    });

    if (userProfile) {
      const recommendations = await learningService.generateRecommendations(userProfile, 3);
      console.log(`   🎯 Generated ${recommendations.length} recommendations:`);
      recommendations.slice(0, 3).forEach((quiz, index) => {
        console.log(`      ${index + 1}. ${quiz.title} (score: ${(quiz.recommendationScore * 100).toFixed(1)}%)`);
      });
    }

    console.log('\n✅ Quiz Engine Test Complete! All systems working properly.');

  } catch (error) {
    console.error('❌ Quiz Engine Test Failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testQuizEngine().catch(console.error);
}

export { testQuizEngine };
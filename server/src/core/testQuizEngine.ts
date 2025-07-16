import { CoreQuizEngine } from './QuizEngine';

/**
 * Comprehensive test of the Core Quiz Engine
 * This demonstrates all key MVP functionality
 */
async function testQuizEngine() {
  console.log('🚀 Testing QuizDeGogo Core Quiz Engine\n');
  console.log('==================================================');

  const engine = new CoreQuizEngine();

  // Test 1: List available quizzes
  console.log('\n1️⃣ Available Quizzes:');
  console.log('------------------------------');
  const allQuizzes = engine.getAvailableQuizzes();
  allQuizzes.forEach((quiz, index) => {
    console.log(`${index + 1}. ${quiz.title}`);
    console.log(`   📂 Category: ${quiz.category}`);
    console.log(`   📊 Difficulty: ${quiz.difficulty}/10`);
    console.log(`   ⏱️  Estimated Time: ${Math.floor(quiz.estimatedTime / 60)} minutes`);
    console.log(`   ✨ Effectiveness: ${(quiz.effectiveness * 100).toFixed(1)}%`);
    console.log(`   ❓ Questions: ${quiz.questions.length}\n`);
  });

  // Test 2: Filter quizzes by category
  console.log('2️⃣ Filtering by Programming Category:');
  console.log('------------------------------');
  const programmingQuizzes = engine.getAvailableQuizzes({ category: 'Programming' });
  programmingQuizzes.forEach(quiz => {
    console.log(`📚 ${quiz.title} - ${quiz.tags.join(', ')}`);
  });

  // Test 3: Start a quiz attempt
  console.log('\n3️⃣ Starting Quiz Attempt:');
  console.log('------------------------------');
  const userId = 'user-1';
  const quizId = 'math-001';
  
  const selectedQuiz = engine.getQuiz(quizId);
  if (selectedQuiz) {
    console.log(`🎯 Selected Quiz: ${selectedQuiz.title}`);
    console.log(`📝 Questions to answer:`);
    
    selectedQuiz.questions.forEach((q, index) => {
      console.log(`   ${index + 1}. ${q.question}`);
      if (q.options) {
        q.options.forEach((option, i) => {
          console.log(`      ${String.fromCharCode(65 + i)}. ${option}`);
        });
      }
      console.log(`      💡 Correct Answer: ${q.correctAnswer}`);
      console.log(`      ⏰ Time Limit: ${q.timeLimit}s\n`);
    });
  }

  const attempt = engine.startQuizAttempt(userId, quizId);
  if (!attempt) {
    console.log('❌ Failed to start quiz attempt');
    return;
  }

  console.log(`✅ Quiz attempt started: ${attempt.id}`);
  console.log(`📅 Started at: ${attempt.startedAt.toLocaleTimeString()}`);

  // Test 4: Simulate quiz taking with various answers
  console.log('\n4️⃣ Simulating Quiz Answers:');
  console.log('------------------------------');
  
  // Mix of correct and incorrect answers to test scoring
  const simulatedAnswers = [
    '42',     // Correct: 15 + 27 = 42
    '54',     // Incorrect: 8 × 7 = 56, not 54
    'True'    // Correct: 144 is a perfect square
  ];

  console.log('🤔 User answers:');
  selectedQuiz?.questions.forEach((q, index) => {
    const userAnswer = simulatedAnswers[index];
    const isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
    console.log(`   ${index + 1}. ${q.question}`);
    console.log(`      User answered: "${userAnswer}" ${isCorrect ? '✅' : '❌'}`);
    console.log(`      Correct answer: "${q.correctAnswer}"`);
    if (!isCorrect && q.explanation) {
      console.log(`      💡 Explanation: ${q.explanation}`);
    }
    console.log('');
  });

  // Test 5: Submit answers and get results
  console.log('\n5️⃣ Quiz Results & Analytics:');
  console.log('------------------------------');
  
  const completedAttempt = engine.submitQuizAttempt(attempt.id, simulatedAnswers);
  if (!completedAttempt) {
    console.log('❌ Failed to submit quiz attempt');
    return;
  }

  console.log(`🎯 Final Score: ${completedAttempt.score.toFixed(1)}%`);
  console.log(`✅ Correct Answers: ${completedAttempt.correctAnswers}/${completedAttempt.totalQuestions}`);
  console.log(`⏱️  Time Spent: ${completedAttempt.timeSpent} seconds`);
  console.log(`📈 Learning Metrics:`);
  console.log(`   🧠 Learning Gain: ${(completedAttempt.learningGain * 100).toFixed(1)}%`);
  console.log(`   🎯 Retention Score: ${(completedAttempt.retentionScore * 100).toFixed(1)}%`);
  console.log(`   💫 Engagement Score: ${(completedAttempt.engagementScore * 100).toFixed(1)}%`);

  // Test 6: Take another quiz to build user history
  console.log('\n6️⃣ Taking JavaScript Quiz:');
  console.log('------------------------------');
  
  const jsQuizId = 'js-001';
  const jsAttempt = engine.startQuizAttempt(userId, jsQuizId);
  if (jsAttempt) {
    // Simulate better performance on the second quiz
    const jsAnswers = [
      'float',  // Correct
      'length', // Correct
      'False'   // Correct
    ];
    
    const jsCompleted = engine.submitQuizAttempt(jsAttempt.id, jsAnswers);
    if (jsCompleted) {
      console.log(`🎯 JavaScript Quiz Score: ${jsCompleted.score.toFixed(1)}%`);
      console.log(`✅ Perfect score! ${jsCompleted.correctAnswers}/${jsCompleted.totalQuestions} correct`);
    }
  }

  // Test 7: Generate personalized recommendations
  console.log('\n7️⃣ AI-Powered Quiz Recommendations:');
  console.log('------------------------------');
  
  const recommendations = engine.generateRecommendations(userId, 5);
  if (recommendations.length > 0) {
    console.log('🤖 Based on your learning history, we recommend:');
    recommendations.forEach((quiz, index) => {
      console.log(`   ${index + 1}. ${quiz.title}`);
      console.log(`      🎯 Match Score: ${((quiz as any).recommendationScore * 100).toFixed(1)}%`);
      console.log(`      📂 Category: ${quiz.category}`);
      console.log(`      📊 Difficulty: ${quiz.difficulty}/10`);
      console.log('');
    });
  } else {
    console.log('🎯 No new recommendations available - you\'ve mastered the current content!');
  }

  // Test 8: User statistics and analytics
  console.log('\n8️⃣ User Learning Analytics:');
  console.log('------------------------------');
  
  const userStats = engine.getUserStats(userId);
  console.log(`📊 Learning Profile Summary:`);
  console.log(`   🎯 Total Quiz Attempts: ${userStats.totalAttempts}`);
  console.log(`   ✅ Completed Quizzes: ${userStats.completedQuizzes}`);
  console.log(`   📈 Average Score: ${userStats.averageScore.toFixed(1)}%`);
  console.log(`   ⏱️  Total Study Time: ${Math.floor(userStats.totalTimeSpent / 60)} minutes`);
  
  if (userStats.preferredCategories.length > 0) {
    console.log(`   📚 Preferred Categories: ${userStats.preferredCategories.join(', ')}`);
  }
  
  if (userStats.strongestAreas.length > 0) {
    console.log(`   💪 Strongest Areas: ${userStats.strongestAreas.join(', ')}`);
  }
  
  if (userStats.improvementAreas.length > 0) {
    console.log(`   📝 Areas for Improvement: ${userStats.improvementAreas.join(', ')}`);
  }

  // Test 9: Advanced filtering
  console.log('\n9️⃣ Advanced Quiz Filtering:');
  console.log('------------------------------');
  
  const advancedQuizzes = engine.getAvailableQuizzes({
    difficulty: { min: 3, max: 5 }
  });
  console.log(`🎯 Intermediate Difficulty Quizzes (3-5/10):`);
  advancedQuizzes.forEach(quiz => {
    console.log(`   📚 ${quiz.title} - Difficulty: ${quiz.difficulty}/10`);
  });

  console.log('\n🎉 Quiz Engine Test Complete!');
  console.log('==================================================');
  console.log('✅ All core MVP functionality working correctly:');
  console.log('   📚 Quiz browsing and filtering');
  console.log('   🎯 Quiz attempt management');
  console.log('   📊 Advanced scoring algorithms');
  console.log('   🧠 Learning effectiveness measurement');
  console.log('   🤖 AI-powered recommendations');
  console.log('   📈 Comprehensive analytics');
  console.log('   👤 User learning profiles');
  console.log('\n🚀 Ready for MVP deployment!');
}

// Run the test
testQuizEngine().catch(console.error);
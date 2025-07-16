import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding quiz data...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: '$2a$10$dummy.hashed.password.here',
      firstName: 'Test',
      lastName: 'User',
      language: 'en',
      learningStyle: 'VISUAL',
      difficultyLevel: 3,
      preferredTopics: ['Programming', 'Mathematics']
    }
  });

  // Create sample quizzes
  const mathQuiz = await prisma.quiz.upsert({
    where: { id: 'math-basic-001' },
    update: {},
    create: {
      id: 'math-basic-001',
      title: 'Basic Mathematics',
      description: 'Test your fundamental math skills',
      category: 'Mathematics',
      difficulty: 3,
      language: 'en',
      tags: ['math', 'basic', 'arithmetic'],
      estimatedTime: 300,
      effectiveness: 0.75,
      qualityScore: 0.8,
      engagement: 0.7,
      createdBy: user1.id,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'What is 15 + 27?',
            options: JSON.stringify(['40', '42', '43', '45']),
            correctAnswer: '42',
            explanation: '15 + 27 = 42',
            difficulty: 2,
            order: 0,
            points: 1,
            timeLimit: 30
          },
          {
            type: 'MULTIPLE_CHOICE',
            question: 'What is 8 × 7?',
            options: JSON.stringify(['54', '56', '58', '64']),
            correctAnswer: '56',
            explanation: '8 × 7 = 56',
            difficulty: 3,
            order: 1,
            points: 1,
            timeLimit: 30
          },
          {
            type: 'TRUE_FALSE',
            question: 'Is 144 a perfect square?',
            options: JSON.stringify(['True', 'False']),
            correctAnswer: 'True',
            explanation: '144 = 12²',
            difficulty: 4,
            order: 2,
            points: 1,
            timeLimit: 20
          }
        ]
      }
    }
  });

  const programmingQuiz = await prisma.quiz.upsert({
    where: { id: 'prog-js-001' },
    update: {},
    create: {
      id: 'prog-js-001',
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript programming',
      category: 'Programming',
      difficulty: 4,
      language: 'en',
      tags: ['javascript', 'programming', 'web'],
      estimatedTime: 480,
      effectiveness: 0.85,
      qualityScore: 0.9,
      engagement: 0.8,
      createdBy: user1.id,
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'Which of the following is NOT a JavaScript data type?',
            options: JSON.stringify(['string', 'boolean', 'float', 'undefined']),
            correctAnswer: 'float',
            explanation: 'JavaScript uses "number" for all numeric values, not "float"',
            difficulty: 3,
            order: 0,
            points: 1,
            timeLimit: 45
          },
          {
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
            type: 'TRUE_FALSE',
            question: 'JavaScript is a statically typed language.',
            options: JSON.stringify(['True', 'False']),
            correctAnswer: 'False',
            explanation: 'JavaScript is dynamically typed - variables can hold different types',
            difficulty: 3,
            order: 2,
            points: 1,
            timeLimit: 20
          }
        ]
      }
    }
  });

  console.log('✅ Sample quizzes created:');
  console.log(`   📚 ${mathQuiz.title} (${mathQuiz.id})`);
  console.log(`   💻 ${programmingQuiz.title} (${programmingQuiz.id})`);
  console.log(`   👤 Test user: ${user1.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
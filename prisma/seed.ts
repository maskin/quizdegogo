import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrator',
      password: hashedAdminPassword,
      role: 'admin'
    }
  })

  // Create test user
  const hashedUserPassword = await bcrypt.hash('user123', 10)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: hashedUserPassword,
      role: 'user'
    }
  })

  // Create categories
  const categories = [
    { name: 'JavaScript', description: 'JavaScript programming language' },
    { name: 'React', description: 'React library and ecosystem' },
    { name: 'Next.js', description: 'Next.js framework' },
    { name: '一般知識', description: '一般的な知識問題' },
    { name: 'プログラミング基礎', description: 'Programming fundamentals' }
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    })
    createdCategories.push(created)
  }

  // Create sample questions with timer functionality
  const questions = [
    {
      categoryId: createdCategories[0].id, // JavaScript
      title: 'JavaScriptの変数宣言で、再代入可能で再宣言不可なのはどれ？',
      description: '変数宣言の特徴について',
      difficulty: 2,
      timeLimit: 30, // 30 seconds
      explanation: 'letは再代入可能で再宣言不可、constは再代入・再宣言共に不可、varは両方可能です。',
      choices: [
        { text: 'var', isCorrect: false, orderIndex: 1 },
        { text: 'let', isCorrect: true, orderIndex: 2 },
        { text: 'const', isCorrect: false, orderIndex: 3 },
        { text: 'function', isCorrect: false, orderIndex: 4 }
      ]
    },
    {
      categoryId: createdCategories[1].id, // React
      title: 'React Hooksの規則として正しいのはどれ？',
      description: 'React Hooksの使用規則について',
      difficulty: 3,
      timeLimit: 45, // 45 seconds
      explanation: 'React HooksはReactの関数コンポーネントまたはカスタムHookの中でのみ使用できます。',
      choices: [
        { text: 'クラスコンポーネントでも使用可能', isCorrect: false, orderIndex: 1 },
        { text: '関数コンポーネントでのみ使用可能', isCorrect: true, orderIndex: 2 },
        { text: 'どこでも自由に使用可能', isCorrect: false, orderIndex: 3 },
        { text: '外部ライブラリでのみ使用可能', isCorrect: false, orderIndex: 4 }
      ]
    },
    {
      categoryId: createdCategories[2].id, // Next.js
      title: 'Next.js 15の新機能はどれ？',
      description: 'Next.js 15の新機能について',
      difficulty: 4,
      timeLimit: 60, // 1 minute
      explanation: 'Next.js 15ではTurbopackが安定版になり、React 19のサポートが追加されました。',
      choices: [
        { text: 'App Routerの導入', isCorrect: false, orderIndex: 1 },
        { text: 'Turbopackの安定版', isCorrect: true, orderIndex: 2 },
        { text: 'Edge Runtimeの追加', isCorrect: false, orderIndex: 3 },
        { text: 'Middleware機能', isCorrect: false, orderIndex: 4 }
      ]
    },
    {
      categoryId: createdCategories[3].id, // 一般知識
      title: '日本の首都はどこ？',
      description: '基本的な地理の問題',
      difficulty: 1,
      timeLimit: 15, // 15 seconds - easy question
      explanation: '日本の首都は東京です。',
      choices: [
        { text: '大阪', isCorrect: false, orderIndex: 1 },
        { text: '京都', isCorrect: false, orderIndex: 2 },
        { text: '東京', isCorrect: true, orderIndex: 3 },
        { text: '横浜', isCorrect: false, orderIndex: 4 }
      ]
    },
    {
      categoryId: createdCategories[4].id, // プログラミング基礎
      title: 'アルゴリズムの計算量O記法で、最も効率的なのはどれ？',
      description: 'Big O記法について',
      difficulty: 3,
      timeLimit: null, // No time limit
      explanation: 'O(1)は定数時間で最も効率的、O(log n)は対数時間、O(n)は線形時間、O(n²)は二次時間です。',
      choices: [
        { text: 'O(n²)', isCorrect: false, orderIndex: 1 },
        { text: 'O(n)', isCorrect: false, orderIndex: 2 },
        { text: 'O(log n)', isCorrect: false, orderIndex: 3 },
        { text: 'O(1)', isCorrect: true, orderIndex: 4 }
      ]
    }
  ]

  for (const questionData of questions) {
    const { choices, ...questionInfo } = questionData
    
    const question = await prisma.question.create({
      data: {
        ...questionInfo,
        choices: {
          create: choices
        }
      }
    })
    
    console.log(`✅ Created question: ${question.title}`)
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@example.com / admin123`)
  console.log(`👤 Test user: user@example.com / user123`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
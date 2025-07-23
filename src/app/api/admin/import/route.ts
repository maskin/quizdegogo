import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { z } from 'zod'

const choiceSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean()
})

const questionSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.number().min(1).max(5),
  timeLimit: z.number().positive().optional(),
  explanation: z.string().optional(),
  choices: z.array(choiceSchema).min(2).max(8)
})

const importSchema = z.object({
  questions: z.array(questionSchema)
})

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // 管理者権限チェック
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // リクエストボディの検証
    const body = await request.json()
    const validatedData = importSchema.parse(body)

    let importedCount = 0
    const errors: string[] = []

    // トランザクションでデータを処理
    await prisma.$transaction(async (tx) => {
      for (const questionData of validatedData.questions) {
        try {
          // カテゴリを検索または作成
          let category = await tx.category.findFirst({
            where: { name: questionData.category }
          })

          if (!category) {
            category = await tx.category.create({
              data: {
                name: questionData.category,
                description: `${questionData.category}に関する問題`
              }
            })
          }

          // 問題を作成
          const question = await tx.question.create({
            data: {
              categoryId: category.id,
              title: questionData.title,
              description: questionData.description,
              difficulty: questionData.difficulty,
              timeLimit: questionData.timeLimit,
              explanation: questionData.explanation
            }
          })

          // 選択肢を作成
          for (let i = 0; i < questionData.choices.length; i++) {
            const choice = questionData.choices[i]
            await tx.choice.create({
              data: {
                questionId: question.id,
                text: choice.text,
                isCorrect: choice.isCorrect,
                orderIndex: i + 1
              }
            })
          }

          importedCount++
        } catch (error) {
          console.error('Question import error:', error)
          errors.push(`問題「${questionData.title}」のインポートに失敗: ${error}`)
        }
      }
    })

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: validatedData.questions.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Import error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'データ形式が正しくありません',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'インポート処理中にエラーが発生しました' },
      { status: 500 }
    )
  }
}
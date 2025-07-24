import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    // カテゴリ内のすべての問題IDを取得
    const questionIds = await prisma.question.findMany({
      where: categoryId ? {
        categoryId: categoryId
      } : undefined,
      select: {
        id: true
      }
    })

    // IDをシャッフルし、指定された数だけ選択
    const shuffledIds = questionIds
      .map(q => q.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, limit)

    // 選択されたIDに基づいて問題データを取得
    const questions = await prisma.question.findMany({
      where: {
        id: {
          in: shuffledIds
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        choices: {
          select: {
            id: true,
            text: true,
            orderIndex: true
          },
          orderBy: {
            orderIndex: 'asc'
          }
        }
      },
      orderBy: {
        // 取得順序をシャッフルされたIDの順に合わせる（オプション）
        // ただし、PrismaのorderByは配列の順序を保証しないため、
        // クライアント側で再度ソートが必要になる場合がある
        // ここではシンプルにIDでソートしておく
        id: 'asc'
      }
    })

    // クライアント側でシャッフルされた順序に並べ替える
    const orderedQuestions = shuffledIds.map(id => questions.find(q => q.id === id)).filter(Boolean) as typeof questions;

    return NextResponse.json({ questions: orderedQuestions })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
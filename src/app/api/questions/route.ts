import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    const questions = await prisma.question.findMany({
      where: category ? {
        categoryId: category
      } : undefined,
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
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Failed to fetch questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
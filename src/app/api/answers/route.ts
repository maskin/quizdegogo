import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const answerSchema = z.object({
  questionId: z.string(),
  choiceId: z.string().nullable(),
  responseTimeMs: z.number(),
  isTimeUp: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { questionId, choiceId, responseTimeMs, isTimeUp = false } = answerSchema.parse(body)

    // Check if user already answered this question
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: session.user.id,
          questionId: questionId
        }
      }
    })

    if (existingAnswer) {
      // Return existing answer instead of error for better UX
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        include: {
          choices: {
            where: { isCorrect: true },
            select: { id: true }
          }
        }
      })

      const correctChoiceId = question?.choices[0]?.id || ''

      return NextResponse.json({
        isCorrect: existingAnswer.isCorrect,
        correctChoiceId,
        explanation: question?.explanation || null,
        userAnswer: {
          id: existingAnswer.id,
          choiceId: existingAnswer.choiceId,
          isCorrect: existingAnswer.isCorrect,
          answeredAt: existingAnswer.answeredAt.toISOString()
        }
      })
    }

    // Get the correct answer
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        choices: true
      }
    })

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    const correctChoice = question.choices.find(choice => choice.isCorrect)
    if (!correctChoice) {
      return NextResponse.json(
        { error: 'No correct answer found' },
        { status: 400 }
      )
    }

    // Determine if answer is correct
    const isCorrect = !isTimeUp && choiceId === correctChoice.id

    // Save the answer
    const answer = await prisma.answer.create({
      data: {
        userId: session.user.id,
        questionId,
        choiceId,
        isCorrect,
        responseTimeMs
      }
    })

    return NextResponse.json({
      isCorrect,
      correctChoiceId: correctChoice.id,
      explanation: question.explanation,
      userAnswer: {
        id: answer.id,
        choiceId: answer.choiceId,
        isCorrect: answer.isCorrect,
        answeredAt: answer.answeredAt.toISOString()
      }
    })

  } catch (error) {
    console.error('Failed to submit answer:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    )
  }
}
"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react"

interface Choice {
  id: string
  text: string
  orderIndex: number
}

interface Question {
  id: string
  title: string
  description: string | null
  difficulty: number
  timeLimit: number | null
  choices: Choice[]
  category: {
    id: string
    name: string
  }
}

interface AnswerResult {
  isCorrect: boolean
  correctChoiceId: string
  explanation: string | null
  userAnswer: {
    id: string
    choiceId: string
    isCorrect: boolean
    answeredAt: string
  }
}

export default function CategoryQuizPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questionResults, setQuestionResults] = useState<boolean[]>([])

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchQuestions()
  }, [session, status, router, categoryId])

  // Timer effect
  useEffect(() => {
    if (!questions.length || isAnswered || !timeLeft || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [questions, isAnswered, timeLeft])

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp && !isAnswered) {
      handleTimeUp()
    }
  }, [isTimeUp, isAnswered, questions, currentQuestionIndex, startTime])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?category=${categoryId}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions)
        setStartTime(Date.now())
        // Set timer for first question
        if (data.questions.length > 0 && data.questions[0].timeLimit) {
          setTimeLeft(data.questions[0].timeLimit)
        }
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChoiceSelect = async (choiceId: string) => {
    if (isAnswered || isSubmitting) return
    setSelectedChoice(choiceId)
    
    // Auto-submit answer when choice is selected
    setTimeout(() => {
      submitAnswer(choiceId)
    }, 100) // Small delay to show selection visual feedback
  }

  const submitAnswer = async (choiceId: string) => {
    if (isAnswered || isSubmitting) return

    console.log("Submitting answer:", choiceId)
    setIsSubmitting(true)
    const responseTime = Date.now() - startTime

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          choiceId: choiceId,
          responseTimeMs: responseTime,
          isTimeUp: false,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Answer result:", JSON.stringify(result, null, 2))
        setAnswerResult(result)
        setIsAnswered(true)
        console.log("Setting isAnswered to true")
        
        // Record the result for this question
        setQuestionResults(prev => {
          const newResults = [...prev]
          newResults[currentQuestionIndex] = result.isCorrect
          return newResults
        })
        
        if (result.isCorrect) {
          setScore(score + 1)
        }
      } else {
        console.error("API error:", await response.text())
      }
    } catch (error) {
      console.error("Failed to submit answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!selectedChoice || isAnswered || isSubmitting) return
    await submitAnswer(selectedChoice)
  }

  const handleTimeUp = async () => {
    if (isAnswered || !questions.length || isSubmitting) return
    
    console.log("Time up - auto submitting...")
    setIsSubmitting(true)
    const responseTime = Date.now() - startTime

    try {
      const response = await fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          choiceId: null,
          responseTimeMs: responseTime,
          isTimeUp: true,
        }),
      })

      const result = await response.json()
      console.log("Time up result:", JSON.stringify(result, null, 2))
      setAnswerResult(result)
      setIsAnswered(true)
      console.log("Time up - Setting isAnswered to true")
      
      // Record the result for this question (time up = incorrect)
      setQuestionResults(prev => {
        const newResults = [...prev]
        newResults[currentQuestionIndex] = false
        return newResults
      })
      
    } catch (error) {
      console.error("Failed to submit answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1]
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedChoice(null)
      setIsAnswered(false)
      setAnswerResult(null)
      setIsTimeUp(false)
      setIsSubmitting(false)
      setStartTime(Date.now())
      // Set timer for next question
      if (nextQuestion.timeLimit) {
        setTimeLeft(nextQuestion.timeLimit)
      } else {
        setTimeLeft(null)
      }
    } else {
      setIsQuizComplete(true)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedChoice(null)
    setIsAnswered(false)
    setAnswerResult(null)
    setScore(0)
    setIsQuizComplete(false)
    setIsTimeUp(false)
    setIsSubmitting(false)
    setQuestionResults([])
    setStartTime(Date.now())
    fetchQuestions()
  }

  const shareOnTwitter = (percentage: number, totalQuestions: number, categoryName: string) => {
    const text = `QuizDeGogoで「${categoryName}」クイズに挑戦！${totalQuestions}問中${percentage}%正解しました！あなたの知識を試そう！ #QuizDeGogo #クイズ`
    const url = `${window.location.origin}/quiz/category/${questions[0]?.category.id}` // クイズカテゴリのURL
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnLine = (percentage: number, totalQuestions: number, categoryName: string) => {
    const text = `QuizDeGogoで「${categoryName}」クイズに挑戦！${totalQuestions}問中${percentage}%正解しました！あなたの知識を試そう！`
    const url = `${window.location.origin}/quiz/category/${questions[0]?.category.id}` // クイズカテゴリのURL
    window.open(`https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnTwitter = (percentage: number, totalQuestions: number, categoryName: string) => {
    const text = `QuizDeGogoで「${categoryName}」クイズに挑戦！${totalQuestions}問中${percentage}%正解しました！あなたの知識を試そう！ #QuizDeGogo #クイズ`
    const url = `${window.location.origin}/quiz/category/${questions[0]?.category.id}` // クイズカテゴリのURL
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  const shareOnLine = (percentage: number, totalQuestions: number, categoryName: string) => {
    const text = `QuizDeGogoで「${categoryName}」クイズに挑戦！${totalQuestions}問中${percentage}%正解しました！あなたの知識を試そう！`
    const url = `${window.location.origin}/quiz/category/${questions[0]?.category.id}` // クイズカテゴリのURL
    window.open(`https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">クイズが見つかりません</h2>
            <p className="text-gray-600 mb-4">このカテゴリにはまだクイズがありません</p>
            <Button onClick={() => router.push("/quiz")}>
              他のカテゴリを見る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl">クイズ完了！</CardTitle>
            <CardDescription>
              {questions[0]?.category.name} - 全{questions.length}問
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-4xl font-bold text-primary">
              {score} / {questions.length}
            </div>
            <div className="text-lg">
              正答率: {percentage}%
            </div>

            {/* 詳細な結果サマリー */}
            <div className="mt-8 text-left">
              <h3 className="text-xl font-semibold mb-4">詳細結果</h3>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">問{index + 1}: {q.title}</span>
                      {questionResults[index] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    {!questionResults[index] && (
                      <p className="text-sm text-gray-600">
                        正解: {q.choices.find(c => c.isCorrect)?.text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRestartQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                もう一度挑戦
              </Button>
              <Button onClick={() => router.push("/quiz")}>
                他のクイズに挑戦
              </Button>
              <Button onClick={() => router.push("/history")} variant="outline">
                履歴を見る
              </Button>
            </div>

            {/* ソーシャルシェアボタン */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">結果をシェアしよう！</h3>
              <div className="flex justify-center gap-4">
                <Button onClick={() => shareOnTwitter(percentage, questions.length, questions[0]?.category.name)} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.13l-6.51-8.82L5.75 21.75H2.44l7.501-8.574L2.25 2.25h3.308l5.979 6.839L12.25 2.25h6Z"></path></svg>
                  Twitterでシェア
                </Button>
                <Button onClick={() => shareOnLine(percentage, questions.length, questions[0]?.category.name)} className="bg-[#00B900] hover:bg-[#00B900]/90 text-white">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.72 13.28a.75.75 0 01-1.06 0L12 11.06l-3.66 3.66a.75.75 0 01-1.06-1.06L10.94 10 7.28 6.34a.75.75 0 011.06-1.06L12 8.94l3.66-3.66a.75.75 0 011.06 1.06L13.06 10l3.66 3.66a.75.75 0 010 1.06z"></path></svg>
                  LINEでシェア
                </Button>
              </div>
            </div>

            {/* ソーシャルシェアボタン */}
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">結果をシェアしよう！</h3>
              <div className="flex justify-center gap-4">
                <Button onClick={() => shareOnTwitter(percentage, questions.length, questions[0]?.category.name)} className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.13l-6.51-8.82L5.75 21.75H2.44l7.501-8.574L2.25 2.25h3.308l5.979 6.839L12.25 2.25h6Z"></path></svg>
                  Twitterでシェア
                </Button>
                <Button onClick={() => shareOnLine(percentage, questions.length, questions[0]?.category.name)} className="bg-[#00B900] hover:bg-[#00B900]/90 text-white">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.72 13.28a.75.75 0 01-1.06 0L12 11.06l-3.66 3.66a.75.75 0 01-1.06-1.06L10.94 10 7.28 6.34a.75.75 0 011.06-1.06L12 8.94l3.66-3.66a.75.75 0 011.06 1.06L13.06 10l3.66 3.66a.75.75 0 010 1.06z"></path></svg>
                  LINEでシェア
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">
              問題 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <div className="flex items-center gap-4">
              {timeLeft !== null && (
                <span className={`text-sm font-mono ${timeLeft <= 10 ? 'text-red-600 font-bold' : 'text-gray-600'}`}>
                  <Clock className="inline h-4 w-4 mr-1" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              )}
              <span className="text-sm text-gray-600">
                スコア: {score} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
              </span>
            </div>
          </div>
          
          {/* Progress Legend */}
          <div className="flex items-center gap-4 mb-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                <CheckCircle className="h-2 w-2 text-white" />
              </div>
              <span className="text-gray-600">正解</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-sm flex items-center justify-center">
                <XCircle className="h-2 w-2 text-white" />
              </div>
              <span className="text-gray-600">不正解</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-sm animate-pulse"></div>
              <span className="text-gray-600">現在</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-gray-300 rounded-sm bg-white"></div>
              <span className="text-gray-600">未回答</span>
            </div>
          </div>
          
          {/* Quiz Progress Tiles */}
          <div className="flex gap-2 mb-3">
            {Array.from({ length: questions.length }, (_, i) => {
              const isCompleted = i < currentQuestionIndex || (i === currentQuestionIndex && isAnswered)
              const isCurrent = i === currentQuestionIndex && !isAnswered
              const isCorrect = questionResults[i]
              
              let bgColor, borderColor, textColor, icon
              
              if (isCompleted) {
                if (isCorrect) {
                  bgColor = 'bg-green-500'
                  borderColor = 'border-green-600'
                  textColor = 'text-white'
                  icon = <CheckCircle className="h-4 w-4" />
                } else {
                  bgColor = 'bg-red-500'
                  borderColor = 'border-red-600'
                  textColor = 'text-white'
                  icon = <XCircle className="h-4 w-4" />
                }
              } else if (isCurrent) {
                bgColor = 'bg-blue-500'
                borderColor = 'border-blue-600'
                textColor = 'text-white'
                icon = <span>{i + 1}</span>
              } else {
                bgColor = 'bg-white'
                borderColor = 'border-gray-300'
                textColor = 'text-gray-500'
                icon = <span>{i + 1}</span>
              }
              
              return (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-md transition-all flex items-center justify-center text-sm font-bold border-2 ${bgColor} ${borderColor} ${textColor} ${
                    isCurrent ? 'animate-pulse shadow-md' : isCompleted ? 'shadow-sm' : ''
                  }`}
                >
                  {icon}
                </div>
              )
            })}
          </div>

          {/* Timer Progress Bar */}
          {timeLeft !== null && currentQuestion?.timeLimit && (
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">制限時間</span>
                <span className={`text-xs font-mono ${timeLeft <= 10 ? 'text-red-600 font-bold animate-pulse' : 'text-gray-500'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} / {Math.floor(currentQuestion.timeLimit / 60)}:{(currentQuestion.timeLimit % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-linear ${
                    timeLeft <= 10 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse' 
                      : timeLeft <= 30 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : 'bg-gradient-to-r from-green-400 to-blue-500'
                  }`}
                  style={{
                    width: `${(timeLeft / currentQuestion.timeLimit) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {currentQuestion.category.name}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">難易度</span>
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      i < currentQuestion.difficulty ? "bg-yellow-400" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
            {currentQuestion.description && (
              <CardDescription>{currentQuestion.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Choices */}
        <div className="space-y-3 mb-6">
          {currentQuestion.choices.map((choice) => {
            let variant: "default" | "outline" | "secondary" = "outline"
            let icon = null

            if (isAnswered && answerResult) {
              if (choice.id === answerResult.correctChoiceId) {
                variant = "default"
                icon = <CheckCircle className="h-4 w-4 text-green-600" />
              } else if (choice.id === selectedChoice && !answerResult.isCorrect) {
                variant = "secondary"
                icon = <XCircle className="h-4 w-4 text-red-600" />
              }
            } else if (choice.id === selectedChoice) {
              variant = "default"
            }

            return (
              <Button
                key={choice.id}
                variant={variant}
                className={`w-full p-4 h-auto text-left justify-start transition-all ${
                  isAnswered 
                    ? "cursor-default" 
                    : isSubmitting 
                      ? "cursor-wait opacity-75" 
                      : "cursor-pointer hover:shadow-md"
                }`}
                onClick={() => handleChoiceSelect(choice.id)}
                disabled={isAnswered || isSubmitting}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{choice.text}</span>
                  {icon}
                  {isSubmitting && choice.id === selectedChoice && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  )}
                </div>
              </Button>
            )
          })}
        </div>

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-2 rounded text-xs">
            isAnswered: {isAnswered.toString()} | 
            selectedChoice: {selectedChoice} | 
            isTimeUp: {isTimeUp.toString()} | 
            isSubmitting: {isSubmitting.toString()} | 
            timeLeft: {timeLeft}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/quiz")}>
            クイズ一覧に戻る
          </Button>
          
          {isAnswered && (
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  次の問題
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "結果を見る"
              )}
            </Button>
          )}
          
          {!isAnswered && isSubmitting && (
            <Button disabled>
              送信中...
            </Button>
          )}
        </div>

        {/* Explanation */}
        {isAnswered && answerResult?.explanation && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">解説</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{answerResult.explanation}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
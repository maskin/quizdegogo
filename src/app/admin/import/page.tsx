"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface ParsedQuestion {
  category: string
  title: string
  description?: string
  difficulty: number
  timeLimit?: number
  explanation?: string
  choices: Array<{
    text: string
    isCorrect: boolean
  }>
}

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedQuestion[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError("")
      setSuccess("")
      setParsedData([])
    }
  }

  const parseCSV = (csvText: string): ParsedQuestion[] => {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    // Expected headers: category,title,description,difficulty,timeLimit,explanation,choice1,choice2,choice3,choice4,correct
    const expectedHeaders = ['category', 'title', 'description', 'difficulty', 'timeLimit', 'explanation', 'choice1', 'choice2', 'choice3', 'choice4', 'correct']
    
    if (!expectedHeaders.every(header => headers.includes(header))) {
      throw new Error(`CSVヘッダーが正しくありません。必要なヘッダー: ${expectedHeaders.join(', ')}`)
    }

    const questions: ParsedQuestion[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const rowData: { [key: string]: string } = {}
      
      headers.forEach((header, index) => {
        rowData[header] = values[index] || ''
      })

      const choices = [
        { text: rowData.choice1, isCorrect: false },
        { text: rowData.choice2, isCorrect: false },
        { text: rowData.choice3, isCorrect: false },
        { text: rowData.choice4, isCorrect: false }
      ]

      const correctIndex = parseInt(rowData.correct) - 1
      if (correctIndex >= 0 && correctIndex < 4) {
        choices[correctIndex].isCorrect = true
      }

      questions.push({
        category: rowData.category,
        title: rowData.title,
        description: rowData.description || undefined,
        difficulty: parseInt(rowData.difficulty) || 3,
        timeLimit: rowData.timeLimit ? parseInt(rowData.timeLimit) : undefined,
        explanation: rowData.explanation || undefined,
        choices: choices.filter(choice => choice.text)
      })
    }

    return questions
  }

  const parseJSON = (jsonText: string): ParsedQuestion[] => {
    const data = JSON.parse(jsonText)
    if (!data.questions || !Array.isArray(data.questions)) {
      throw new Error('JSONフォーマットが正しくありません。"questions"配列が必要です。')
    }
    return data.questions
  }

  const handlePreview = async () => {
    if (!selectedFile) return

    try {
      setError("")
      const text = await selectedFile.text()
      let questions: ParsedQuestion[]

      if (selectedFile.name.endsWith('.csv')) {
        questions = parseCSV(text)
      } else if (selectedFile.name.endsWith('.json')) {
        questions = parseJSON(text)
      } else {
        throw new Error('サポートされていないファイル形式です。CSV または JSON ファイルを選択してください。')
      }

      setParsedData(questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ファイル解析エラー')
    }
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return

    setIsUploading(true)
    setError("")

    try {
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: parsedData })
      })

      if (!response.ok) {
        throw new Error('インポートに失敗しました')
      }

      const result = await response.json()
      setSuccess(`${result.imported}件の問題を正常にインポートしました`)
      setParsedData([])
      setSelectedFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'インポートエラー')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/admin">← 管理者ダッシュボード</Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">
          クイズデータインポート
        </h1>

        <div className="grid gap-6">
          {/* ファイル選択 */}
          <Card>
            <CardHeader>
              <CardTitle>ファイル選択</CardTitle>
              <CardDescription>
                CSV または JSON 形式のファイルを選択してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept=".csv,.json"
                onChange={handleFileSelect}
              />
              
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  選択ファイル: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={handlePreview}
                  disabled={!selectedFile}
                  variant="outline"
                >
                  プレビュー
                </Button>
                <Button 
                  onClick={handleImport}
                  disabled={parsedData.length === 0 || isUploading}
                >
                  {isUploading ? 'インポート中...' : `インポート (${parsedData.length}件)`}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* エラー・成功メッセージ */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-red-600">{error}</div>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-green-600">{success}</div>
              </CardContent>
            </Card>
          )}

          {/* プレビュー */}
          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>プレビュー ({parsedData.length}件)</CardTitle>
                <CardDescription>
                  インポート予定のデータを確認してください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {parsedData.slice(0, 5).map((question, index) => (
                    <div key={index} className="border rounded p-4">
                      <div className="font-medium">{question.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        カテゴリ: {question.category} | 
                        難易度: {question.difficulty} | 
                        制限時間: {question.timeLimit ? `${question.timeLimit}秒` : '無制限'}
                      </div>
                      <div className="text-sm mt-2">
                        選択肢: {question.choices.map((c, i) => 
                          `${i + 1}. ${c.text}${c.isCorrect ? ' ✓' : ''}`
                        ).join(' | ')}
                      </div>
                    </div>
                  ))}
                  {parsedData.length > 5 && (
                    <div className="text-sm text-gray-500 text-center">
                      ... 他 {parsedData.length - 5} 件
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* フォーマット説明 */}
          <Card>
            <CardHeader>
              <CardTitle>対応フォーマット</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">CSV形式</h4>
                <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                  category,title,description,difficulty,timeLimit,explanation,choice1,choice2,choice3,choice4,correct<br/>
                  JavaScript,変数宣言について,letとconstの違い,2,30,letは再代入可能,var,let,const,function,2
                </code>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">JSON形式</h4>
                <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                  {`{
  "questions": [
    {
      "category": "JavaScript",
      "title": "変数宣言について",
      "description": "letとconstの違い",
      "difficulty": 2,
      "timeLimit": 30,
      "explanation": "letは再代入可能",
      "choices": [
        {"text": "var", "isCorrect": false},
        {"text": "let", "isCorrect": true},
        {"text": "const", "isCorrect": false},
        {"text": "function", "isCorrect": false}
      ]
    }
  ]
}`}
                </code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
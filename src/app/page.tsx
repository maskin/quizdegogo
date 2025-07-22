import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          QuizDeGogo
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          全生命体の向学のための時間制限付きクイズシステム
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⏱️ タイマー機能</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                問題ごとに設定された時間制限でスリリングなクイズ体験
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🎨 視覚的進捗</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                タイル式進捗表示で一目で分かる回答状況
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">⚡ ワンクリック回答</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                選択肢をクリックするだけで自動的に回答を送信
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/quiz">クイズを始める</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signin">ログイン</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
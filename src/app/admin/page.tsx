import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          管理者ダッシュボード
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">📝 クイズ管理</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                クイズ問題の作成・編集・削除
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/questions">
                  クイズ管理
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">📂 データインポート</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                CSV/JSONファイルからクイズ問題を一括インポート
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/import">
                  データインポート
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">🏷️ カテゴリ管理</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                クイズカテゴリの作成・編集・削除
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/categories">
                  カテゴリ管理
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">👥 ユーザー管理</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                ユーザーアカウントの管理・権限設定
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/users">
                  ユーザー管理
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">📊 統計・分析</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                クイズ回答状況・学習分析データ
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/analytics">
                  統計・分析
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">⚙️ システム設定</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                システム全体の設定・メンテナンス
              </CardDescription>
              <Button asChild className="w-full">
                <Link href="/admin/settings">
                  システム設定
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/quiz">
              クイズページに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
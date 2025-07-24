# QuizDeGogo - 全生命体の向学のための時間制限付きクイズシステム

## プロジェクト概要

QuizDeGogoは、"全生命体"の学習を目的とした革新的な時間制限付きクイズプラットフォームです。このMVP（最小実用製品）では、タイマー機能を中心とした高度な学習体験を提供します。

## 実装済み機能

### 🎯 MVP完成済み機能
- ⏱️ **革新的タイマーシステム**: 問題ごとの時間制限設定と視覚的カウントダウン
- 🎨 **視覚的進捗表示**: タイル式進捗インジケーターで直感的な状況把握
- ⚡ **ワンクリック回答**: 選択肢クリックで即座に自動送信
- 🔄 **自動タイムアップ処理**: 時間切れ時の自動回答記録
- 🔐 **認証システム**: NextAuth.js v5による安全なユーザー管理
- 📊 **リアルタイム結果表示**: 即座に正誤判定と結果表示

### 🆕 DAY2新機能（2025年7月23日追加）
- 📂 **クイズデータインポート機能**: CSV/JSON形式での問題一括読み込み
- 👑 **管理者ダッシュボード**: 直感的な管理インターフェース
- 🔍 **データプレビュー機能**: インポート前の内容確認
- ✅ **データ検証システム**: Zodによる厳密な型チェック
- 🏷️ **カテゴリ自動作成**: 新規カテゴリの自動生成対応

### ✨ DAY3改善項目（2025年7月24日追加）
- ⬆️ **認証ライブラリ近代化**: NextAuth.js v5へのアップグレードとコードの追従
- 🛡️ **APIセキュリティ強化**: ミドルウェアによる管理者APIのアクセス制御
- 🧪 **テスト基盤導入**: JestとReact Testing Libraryによるテスト環境構築

### ✨ DAY4新機能（2025年7月24日追加）
- 🌐 **グローバルナビゲーションへのログイン状態表示**: アプリケーション全体でユーザーのログイン状態を視覚的に確認可能に

### 技術スタック

#### フロントエンド
- **フレームワーク**: Next.js 15 (App Router) + React 19 + TypeScript
- **UIライブラリ**: Tailwind CSS + Shadcn/ui
- **認証**: NextAuth.js v5
- **状態管理**: React Hooks + Context API
- **フォーム処理**: React Hook Form + Zod validation
- **テスト**: Jest + React Testing Library

#### バックエンド・データベース
- **データベース**: SQLite + Prisma ORM
- **認証プロバイダー**: Credentials Provider (本格認証対応)
- **パスワード暗号化**: bcryptjs
- **スキーマ管理**: Prisma with TypeScript

## 🚀 クイックスタート

### 前提条件
- Node.js 18+ および npm 8+
- Git

### インストール手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/maskin/quizdegogo.git
   cd quizdegogo-app
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **データベースをセットアップ**
   ```bash
   npm run db:push    # Prismaスキーマをデータベースに反映
   npm run db:seed    # サンプルデータを投入
   ```

4. **開発サーバーを起動**
   ```bash
   npm run dev
   # http://localhost:3000 でアクセス可能
   ```

5. **テストを実行**
   ```bash
   npm test
   ```

## 🎮 テストアカウント

開発・テスト用のアカウントが用意されています：

- **管理者**: admin@example.com / admin123
- **一般ユーザー**: user@example.com / user123

## 📂 クイズデータインポート機能

### 管理者機能アクセス
1. 管理者アカウントでログイン
2. `/admin` にアクセスして管理者ダッシュボードを開く
3. 「データインポート」をクリック

### 対応フォーマット

#### CSV形式
```csv
category,title,description,difficulty,timeLimit,explanation,choice1,choice2,choice3,choice4,correct
JavaScript,配列の要素数を取得するプロパティは？,配列オブジェクトのプロパティについて,1,20,配列の要素数はlengthプロパティで取得できます,size,length,count,elements,2
React,useState hookの戻り値は？,React Hooksの基本について,2,30,useStateは[state setState]の配列を返します,オブジェクト,配列,文字列,関数,2
```

#### JSON形式
```json
{
  "questions": [
    {
      "category": "JavaScript",
      "title": "ES6のアロー関数の特徴として正しいのは？",
      "description": "ES6アロー関数の特性について",
      "difficulty": 3,
      "timeLimit": 40,
      "explanation": "アロー関数は自身のthisを持たず、外側のスコープのthisを継承します。",
      "choices": [
        {"text": "独自のthisを持つ", "isCorrect": false},
        {"text": "外側のスコープのthisを継承", "isCorrect": true},
        {"text": "thisは常にundefined", "isCorrect": false},
        {"text": "thisは常にglobalオブジェクト", "isCorrect": false}
      ]
    }
  ]
}
```

### フィールド説明
- **category**: カテゴリ名（自動作成対応）
- **title**: 問題のタイトル（必須）
- **description**: 問題の説明（任意）
- **difficulty**: 難易度 1-5（必須）
- **timeLimit**: 制限時間（秒、null=無制限）
- **explanation**: 解説（任意）
- **choices**: 選択肢（JSON）または choice1-4（CSV）
- **correct**: 正解番号（CSV）または isCorrect（JSON）

### サンプルファイル
プロジェクトルートに用意された対応サンプル：
- `sample-quiz-data.csv`: プログラミング基礎8問
- `sample-quiz-data.json`: 高度な技術5問

## 📊 データベース構造

SQLite + Prisma ORMを使用したスキーマ構成：

### 主要テーブル
- **User**: ユーザー認証・プロフィール情報
- **Category**: クイズカテゴリー（数学、英語、歴史など）
- **Question**: 問題データ（**timeLimit**フィールド付き）
- **Choice**: 選択肢データ
- **Answer**: 回答記録（**choiceId nullable**対応）

### ⚡ タイマー機能の技術実装

#### データベースレベル
```prisma
model Question {
  id          String   @id @default(cuid())
  timeLimit   Int?     @map("time_limit")  // 秒単位、null=無制限
  // ... other fields
}

model Answer {
  choiceId       String?  @map("choice_id")  // 時間切れ時はnull
  responseTimeMs Int      @map("response_time_ms")
  isTimeUp       Boolean  @default(false) @map("is_time_up")
  // ... other fields
}
```

#### フロントエンド実装
```typescript
// リアルタイムタイマー
const [timeLeft, setTimeLeft] = useState<number | null>(null)
const [isTimeUp, setIsTimeUp] = useState(false)

useEffect(() => {
  if (timeLeft === null) return
  if (timeLeft <= 0) {
    handleTimeUp()
    return
  }
  
  const timer = setInterval(() => {
    setTimeLeft(prev => prev! - 1)
  }, 1000)
  
  return () => clearInterval(timer)
}, [timeLeft])
```

## 🏗️ システム構成

```
┌─────────────────────────┐    ┌─────────────────────────┐
│     Next.js 15 App      │    │      SQLite Database    │
│   React 19 Frontend     │◄──►│     Prisma ORM          │
│   Tailwind + Shadcn    │    │   Timer-aware Schema    │
└─────────────────────────┘    └─────────────────────────┘
            │
    ┌─────────────────────────┐
    │   NextAuth.js v5        │
    │   Authentication        │
    └─────────────────────────┘
```

## 🎯 主要実装ファイル

### コアコンポーネント
- `src/app/quiz/category/[id]/page.tsx` - メインクイズ画面（タイマー機能完全実装）
- `src/app/api/answers/route.ts` - 回答処理API（時間切れ対応）
- `src/app/api/admin/import/route.ts` - 管理者用データインポートAPI
- `prisma/schema.prisma` - タイマー対応データベーススキーマ
- `auth.ts` - NextAuth.js v5認証設定
- `src/middleware.ts` - API認可ミドルウェア
- `src/next-auth.d.ts` - NextAuth.js 型定義拡張

### 開発成果・学習内容

#### 技術的チャレンジと解決策
1. **Next.js 15 + React 19の最新技術採用**
   - App Routerでのファイルベースルーティング
   - Server ComponentsとClient Componentsの適切な使い分け
   
2. **リアルタイムタイマーシステム**
   - useEffectとsetIntervalを使った正確な時間計測
   - ブラウザタブ切り替え時の時間同期課題を解決
   
3. **ユーザビリティ重視の設計**
   - ワンクリック回答による操作性向上
   - 視覚的進捗表示での直感的な状況把握
   
4. **データベース設計の柔軟性**
   - nullable choiceIdで時間切れケースを適切に処理
   - 応答時間計測によるパフォーマンス分析基盤

## 📈 開発ログ・気づき

### DAY1完了項目（2025年7月）
✅ **基盤技術選定・実装**
- Next.js 15 + React 19 + TypeScript構成完了
- Prisma + SQLiteデータベース構築
- NextAuth.js v5認証システム実装
- Tailwind CSS + Shadcn/ui デザインシステム導入

✅ **タイマー機能実装**
- 問題別時間制限設定（データベースレベル）
- リアルタイムカウントダウン表示
- 時間切れ自動処理システム
- 視覚的進捗インジケーター（タイル表示）

✅ **ユーザビリティ向上**
- ワンクリック回答システム
- 即座の正誤判定表示
- 直感的な操作フロー設計

### 技術的学習ポイント
1. **Next.js 15の新機能活用**: App Routerの完全活用、Server/Client Components適切な分離
2. **React 19の新hook活用**: より効率的な状態管理とレンダリング最適化
3. **Prismaの高度な活用**: 型安全なデータベース操作、マイグレーション管理
4. **リアルタイム処理**: setIntervalとuseEffectの組み合わせによる正確な時間管理

### 次期開発予定
- 🔄 **カテゴリー管理機能強化**
- 📊 **詳細な学習分析機能**
- 🌍 **多言語対応（i18n）**
- 📱 **PWA対応・モバイル最適化**

```bash
# 開発・実行
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run start        # プロダクション実行
npm run lint         # コード品質チェック
npm run test         # Jestによるユニットテスト実行

# データベース管理
npm run db:generate  # Prismaクライアント生成
npm run db:push      # スキーマをデータベースに反映
npm run db:seed      # サンプルデータ投入
npm run db:reset     # データベースリセット
npm run db:studio    # Prisma Studio（GUI管理ツール）
```

## 📁 プロジェクト構造

```
quizdegogo-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # 認証関連ページ
│   │   ├── quiz/              # クイズ機能
│   │   │   └── category/[id]/ # 動的カテゴリクイズページ
│   │   └── api/               # API Routes
│   │       ├── admin/         # 管理者用API
│   │       └── answers/       # 回答処理API
│   ├── components/            # 再利用可能コンポーネント
│   │   └── ui/               # Shadcn/ui コンポーネント
│   ├── lib/                  # ユーティリティ・設定
│   ├── middleware.ts          # API認可ミドルウェア
│   └── next-auth.d.ts       # NextAuth.js 型定義
├── prisma/                   # データベース管理
│   ├── schema.prisma        # データベーススキーマ
│   └── seed.ts              # サンプルデータ
├── auth.ts                  # NextAuth.js設定
├── jest.config.js           # Jest設定
├── jest.setup.js            # Jestセットアップ
└── package.json            # 依存関係・スクリプト
```

## 🛠️ 開発ガイドライン

### コード品質
- **TypeScript**: 厳格モードで型安全性を確保
- **ESLint**: コード品質とベストプラクティスを強制
- **Jest & React Testing Library**: ユニットテストとコンポーネントテストによる品質保証
- **Prisma**: 型安全なデータベース操作
- **Zod**: API入力値の実行時型検証

### Git ワークフロー
```bash
git checkout -b feature/new-timer-feature  # 機能ブランチ作成
# 開発・テスト実行
npm test && npm run lint && npm run build  # 品質チェック
git commit -m "Add advanced timer display" # 意味のあるコミット
git push origin feature/new-timer-feature  # プッシュ
```

## 🚀 デプロイメント

### プロダクションビルド
```bash
npm run build    # 最適化ビルド
npm run start    # プロダクション実行
```

### 今後のロードマップ

#### Phase 2: 機能拡張（今後3-6ヶ月）
- 📊 クイズ結果シェア機能
- 🎮 問題別正答率・回答時間標準偏差の自動計算・保存
- 📱 パーソナライズされたクイズレコメンド
- 🌍 多言語対応（i18n）
- 👥 管理者画面の機能強化

#### Phase 3: 本格展開（6-12ヶ月）
- 🔗 外部API連携
- 📈 AI活用による個別最適化
- 📱 ネイティブモバイルアプリ
- 🌐 クラウドスケーリング対応

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 📞 サポート

- **Issue報告**: [GitHub Issues](https://github.com/maskin/quizdegogo/issues)
- **機能提案**: [GitHub Discussions](https://github.com/maskin/quizdegogo/discussions)

---

**QuizDeGogo MVP** - 全生命体の向学のための革新的タイマー付きクイズシステム ⚡
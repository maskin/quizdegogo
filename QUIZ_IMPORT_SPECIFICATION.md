# QuizDeGogo クイズデータインポート機能仕様書

## 概要

QuizDeGogoシステムにおけるクイズ問題の一括インポート機能の詳細仕様書です。管理者が外部ファイル（CSV/JSON）からクイズデータを効率的にシステムに取り込むことができます。

## 機能概要

### 対象ユーザー
- システム管理者（role: admin）

### 主要機能
1. **ファイルアップロード**: CSV/JSON形式のファイルを選択・アップロード
2. **データプレビュー**: インポート前のデータ内容確認
3. **データ検証**: フォーマット・内容の自動検証
4. **一括インポート**: 複数問題の効率的なバッチ処理
5. **カテゴリ自動作成**: 存在しないカテゴリの自動生成
6. **処理結果報告**: 成功・失敗の詳細フィードバック

## アクセス方法

### URL構成
```
/admin              # 管理者ダッシュボード
/admin/import       # データインポート画面
/api/admin/import   # インポートAPI（POST）
```

### 認証・権限
- NextAuth.js セッション認証必須
- 管理者権限（role: 'admin'）必須
- 非認証・非管理者は403エラー

## 対応データフォーマット

### 1. CSV形式

#### ヘッダー行（必須）
```csv
category,title,description,difficulty,timeLimit,explanation,choice1,choice2,choice3,choice4,correct
```

#### フィールド仕様
| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|---|------|------|---|
| category | string | ✅ | カテゴリ名 | "JavaScript" |
| title | string | ✅ | 問題タイトル | "配列の要素数を取得するプロパティは？" |
| description | string | - | 問題説明 | "配列オブジェクトのプロパティについて" |
| difficulty | number | ✅ | 難易度（1-5） | 2 |
| timeLimit | number | - | 制限時間（秒） | 30 |
| explanation | string | - | 解説 | "配列の要素数はlengthプロパティで取得" |
| choice1-4 | string | ✅ | 選択肢1-4 | "size", "length", "count", "elements" |
| correct | number | ✅ | 正解番号（1-4） | 2 |

#### CSV例
```csv
category,title,description,difficulty,timeLimit,explanation,choice1,choice2,choice3,choice4,correct
JavaScript,配列の要素数を取得するプロパティは？,配列オブジェクトのプロパティについて,1,20,配列の要素数はlengthプロパティで取得できます,size,length,count,elements,2
React,useState hookの戻り値は？,React Hooksの基本について,2,30,useStateは[state setState]の配列を返します,オブジェクト,配列,文字列,関数,2
```

### 2. JSON形式

#### データ構造
```json
{
  "questions": [
    {
      "category": "カテゴリ名",
      "title": "問題タイトル",
      "description": "問題説明（任意）",
      "difficulty": 1-5,
      "timeLimit": 制限時間秒（任意）,
      "explanation": "解説（任意）",
      "choices": [
        {
          "text": "選択肢テキスト",
          "isCorrect": true/false
        }
      ]
    }
  ]
}
```

#### フィールド詳細

**Question Object**
| フィールド | 型 | 必須 | 制約 | 説明 |
|-----------|---|------|------|------|
| category | string | ✅ | min: 1文字 | カテゴリ名 |
| title | string | ✅ | min: 1文字 | 問題タイトル |
| description | string | - | - | 問題の詳細説明 |
| difficulty | number | ✅ | 1-5 | 難易度レベル |
| timeLimit | number | - | 正の整数 | 制限時間（秒）、null=無制限 |
| explanation | string | - | - | 回答後の解説 |
| choices | array | ✅ | 2-8個 | 選択肢配列 |

**Choice Object**
| フィールド | 型 | 必須 | 説明 |
|-----------|---|------|------|
| text | string | ✅ | 選択肢のテキスト |
| isCorrect | boolean | ✅ | 正解かどうか |

#### JSON例
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

## API仕様

### エンドポイント
```
POST /api/admin/import
```

### リクエスト
```json
{
  "questions": [
    {
      "category": "string",
      "title": "string",
      "description": "string (optional)",
      "difficulty": number,
      "timeLimit": number (optional),
      "explanation": "string (optional)",
      "choices": [
        {
          "text": "string",
          "isCorrect": boolean
        }
      ]
    }
  ]
}
```

### レスポンス

#### 成功時（200）
```json
{
  "success": true,
  "imported": 5,
  "total": 5,
  "errors": undefined
}
```

#### 部分成功時（200）
```json
{
  "success": true,
  "imported": 3,
  "total": 5,
  "errors": [
    "問題「エラー問題」のインポートに失敗: バリデーションエラー"
  ]
}
```

#### エラー時
- **401**: 認証エラー
- **403**: 権限不足
- **400**: データ形式エラー
- **500**: サーバーエラー

```json
{
  "error": "エラーメッセージ",
  "details": "詳細情報（Zodエラー時）"
}
```

## データベース処理

### トランザクション処理
```typescript
await prisma.$transaction(async (tx) => {
  // 1. カテゴリ検索または作成
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

  // 2. 問題作成
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

  // 3. 選択肢作成
  for (let i = 0; i < questionData.choices.length; i++) {
    await tx.choice.create({
      data: {
        questionId: question.id,
        text: choice.text,
        isCorrect: choice.isCorrect,
        orderIndex: i + 1
      }
    })
  }
})
```

### カテゴリ自動作成
- 存在しないカテゴリ名が指定された場合、自動的に新規作成
- カテゴリ説明は「{カテゴリ名}に関する問題」で自動生成

## データ検証

### Zodスキーマ
```typescript
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
```

### 検証項目
1. **必須フィールド**: category, title, difficulty, choices
2. **データ型**: 文字列、数値、真偽値の型チェック
3. **値の範囲**: difficulty（1-5）、timeLimit（正数）
4. **配列長**: choices（2-8個）
5. **文字列長**: 空文字列禁止

## エラーハンドリング

### フロントエンド
- ファイル形式チェック（.csv, .json のみ）
- ファイルサイズ制限
- プレビュー時のパースエラー表示
- インポート失敗時の詳細エラー表示

### バックエンド
- 認証・権限エラー
- Zodバリデーションエラー
- データベースエラー
- トランザクション失敗時のロールバック

## 使用方法

### 1. 管理者ログイン
```
1. http://localhost:3000/auth/signin にアクセス
2. admin@example.com / admin123 でログイン
```

### 2. インポート画面アクセス
```
1. http://localhost:3000/admin でダッシュボード表示
2. 「データインポート」をクリック
```

### 3. ファイルインポート
```
1. 「ファイル選択」でCSV/JSONファイルを選択
2. 「プレビュー」でデータ内容を確認
3. 「インポート」で一括処理実行
4. 処理結果を確認
```

## サンプルファイル

### sample-quiz-data.csv
- プログラミング基礎問題8問
- JavaScript、React、TypeScript、Node.js、CSS、HTML、SQL、Python

### sample-quiz-data.json  
- 高度な技術問題5問
- JavaScript ES6、React Hooks、データベース、アルゴリズム、ネットワークセキュリティ

## 制限事項

### ファイルサイズ
- 推奨最大ファイルサイズ: 10MB
- 1回のインポートで推奨最大問題数: 1000問

### パフォーマンス
- 大量データ（100問以上）の場合、処理時間を考慮
- トランザクション処理によりデータ整合性は保証

### セキュリティ
- 管理者権限必須
- ファイル形式制限（CSV/JSONのみ）
- 入力値の厳密な検証

## 今後の拡張予定

### Phase 2 機能
- Excel形式対応
- 画像付き問題のインポート
- バルクエクスポート機能
- インポート履歴管理
- テンプレートダウンロード機能

### Phase 3 機能  
- Web API連携インポート
- 自動カテゴリ推定
- 重複問題検出
- インポートスケジューリング

---

**更新日**: 2025年7月23日  
**バージョン**: 1.0.0  
**担当**: QuizDeGogo開発チーム
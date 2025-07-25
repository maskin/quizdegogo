# テーマ機能導入提案

## 概要

現在、クイズは「カテゴリ」によって分類されていますが、ユーザーからの要望により、複数のカテゴリや問題ファイルを「テーマ」としてまとめる機能の導入を提案します。これにより、「2025年7月のトップニュースクイズ」や「栃木県民必須の重要問題」のように、特定の目的や期間でクイズを括ることが可能になります。

## 提案するデータモデルの変更

「テーマ」を導入するにあたり、最も柔軟で拡張性の高いアプローチとして、`Theme` モデルを新しく作成し、既存の `Category` モデルと多対多の関係を持たせることを提案します。

### 変更内容

1.  **`Theme` モデルの追加**:
    *   テーマの名称 (`name`) や説明 (`description`) を保持します。
    *   例: `name: "2025年7月のトップニュースクイズ"`, `description: "2025年7月に発生した主要なニュースに関するクイズ"`

2.  **`Category` と `Theme` の多対多リレーション**:
    *   `Category` モデルと `Theme` モデルの間に中間テーブル（Prismaでは自動生成される `_CategoryToTheme`）を介して多対多の関係を構築します。
    *   これにより、以下の柔軟な運用が可能になります。
        *   1つのカテゴリが複数のテーマに属する（例: 「国内ニュース」カテゴリが「2025年7月のトップニュースクイズ」と「日本の政治」の両方に属する）。
        *   1つのテーマが複数のカテゴリを含む（例: 「2025年7月のトップニュースクイズ」テーマが「国内ニュース」と「国際ニュース」カテゴリを含む）。

### `prisma/schema.prisma` の変更案

```prisma
// Theme モデルの追加
model Theme {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  categories  Category[] @relation("CategoryToTheme") // Categoryとの多対多リレーション

  createdAt DateTime @default(now()) @map("created_at")

  @@map("themes")
}

// Category モデルの変更 (Themeとのリレーション追加)
model Category {
  id          String     @id @default(cuid())
  name        String     @unique
  description String?
  questions   Question[]
  themes      Theme[]    @relation("CategoryToTheme") // Themeとの多対多リレーション

  createdAt DateTime @default(now()) @map("created_at")

  @@map("categories")
}
```

### 今後の開発ステップ（概要）

1.  **データモデルの更新**: `prisma/schema.prisma` を上記提案に基づいて変更し、マイグレーションを実行します。
2.  **問題アップロード機能の改修**: 問題ファイルをアップロードする際に、どのテーマに属するかを指定できる機能を追加します。
3.  **APIの追加/変更**: テーマの一覧取得、テーマに紐づくカテゴリや問題の取得など、テーマに関連するAPIエンドポイントを実装します。
4.  **UIの改修**:
    *   テーマ選択/表示UIの追加。
    *   テーマに紐づくクイズの表示。
    *   管理画面でのテーマ管理機能。

## 結論

この提案により、ユーザーはより柔軟にクイズを整理し、特定の目的やイベントに合わせたクイズセットを提供できるようになります。

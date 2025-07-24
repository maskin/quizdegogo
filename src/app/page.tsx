"use client"; // クライアントコンポーネントにする
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link"; // Linkコンポーネントのインポートを追加

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">QuizDeGogo へようこそ！</h1>

      {session ? (
        <div className="text-center">
          <p className="mb-4">ログイン中: {session.user?.email} (Role: {session.user?.role})</p>
          {session.user?.role === "admin" && (
            <p className="mb-4">
              <Link href="/admin" className="text-blue-500 hover:underline">管理者ダッシュボードへ</Link>
            </p>
          )}
          <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">ログアウト</button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">ログインしていません。</p>
          <button onClick={() => signIn()} className="bg-blue-500 text-white px-4 py-2 rounded">ログイン</button>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/quiz" className="text-blue-500 hover:underline">クイズを始める</Link>
      </div>
    </div>
  );
}

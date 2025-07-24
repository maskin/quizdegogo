"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-sm">Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm">{session.user?.email}</span>
        {session.user?.role === "admin" && (
          <Link href="/admin" className="text-sm hover:underline">
            Admin
          </Link>
        )}
        <button onClick={() => signOut()} className="text-sm hover:underline">
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className="text-sm hover:underline">
      ログイン
    </button>
  );
}

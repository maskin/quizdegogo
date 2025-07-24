import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest, ctx: any) => {
  try {
    return await handlers.GET(req, ctx)
  } catch (e) {
    console.error("[auth][GET]", e)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}

export const POST = async (req: NextRequest, ctx: any) => {
  try {
    return await handlers.POST(req, ctx)
  } catch (e) {
    console.error("[auth][POST]", e)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
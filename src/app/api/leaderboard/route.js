import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sql } from "@vercel/postgres";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user?.email?.endsWith("@startntnu.no")) return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  
  const {rows} = await sql`select id , avatar, email ,name, pfp, nickname, elo, redbull, wins, plays from users ORDER BY elo DESC`
  return NextResponse.json(rows,{status: 200});
}
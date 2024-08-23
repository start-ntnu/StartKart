import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mysql from 'mysql2';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || !session?.user?.email?.endsWith("@startntnu.no")) return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
  
  const query = "select id , `character`, email ,name, pfp, nickname, elo, redbull, wins, plays from Users ORDER BY elo DESC"
  const connection = mysql.createConnection(process.env.DATABASE_URL)
  
  const [rows] = await connection.promise().query(query);
  connection.end();
  return NextResponse.json(rows,{status: 200});
}
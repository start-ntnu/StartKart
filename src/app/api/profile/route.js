import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { sql } from "@vercel/postgres";

export async function GET(request) {
    // Get session from next-auth
    const session = await getSession({ req: request });

    // Check if the session exists and if there's an email in the session
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    
    try {
        // Get the user details from the database
        const {rows} = await sql`SELECT * FROM users WHERE email = ${userEmail}`

        // Check if we got the user details
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userDetails = rows[0];

        return NextResponse.json(userDetails, { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function POST(request) {
    const session = await getServerSession(authOptions);
    // Check if the session exists and if there's an email in the session
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Create a connection to the database
    try {
        // Get the user details from the database
        const { rows } = await sql`SELECT * FROM Users WHERE email = ${userEmail}`

        // Check if we got the user details
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userDetails = rows[0];
        const data = await request.json();
        await sql`Update users SET nickname = ${data.nickname}, avatar = ${data.avatar}, pfp = ${data.pfp} WHERE email = ${userEmail}`
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}
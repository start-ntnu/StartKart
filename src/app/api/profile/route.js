import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import mysql from 'mysql2/promise';
import { NextRequest  } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(request) {
    // Get session from next-auth
    const session = await getSession({ req: request });

    // Check if the session exists and if there's an email in the session
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Create a connection to the database
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    try {
        // Get the user details from the database
        const [rows] = await connection.query('SELECT * FROM Users WHERE email = ?', [userEmail]);

        // Check if we got the user details
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userDetails = rows[0];

        return NextResponse.json(userDetails, { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        connection.end();
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
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    try {
        // Get the user details from the database
        const [rows] = await connection.query('SELECT * FROM Users WHERE email = ?', [userEmail]);

        // Check if we got the user details
        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userDetails = rows[0];
        const data = await request.json();
        await connection.query("Update Users SET nickname = ?, `character` = ?, pfp = ? WHERE email = ?", [data.nickname, data.character, data.pfp, userEmail])
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        connection.end();
    }

}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sql } from "@vercel/postgres";
import EloCalculator from './calc'

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session || !session?.user?.email?.endsWith("@startntnu.no")) {
        return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const data = await request.json();

    const results = [];
    const elo = [];
    const player = [];

    data.result.forEach(entry => {
        if (entry[1] && entry[1].elo !== undefined) {
            results.push(entry[0]);
            elo.push(entry[1].elo);
            player.push(entry[1].id)
        }
    });

    const userId = await getUserIdByEmail(session.user.email);
    const eloCalculator = new EloCalculator();

    // Get the updated ratings
    const updatedElos = eloCalculator.adjustRatings(elo, results);

    try {
        const {rows} = await sql`INSERT INTO games (author) VALUES (${userId}) RETURNING id`
        const gameID = rows[0].id;

        for (let i = 0; i < player.length; i++) {
            const userID = player[i];
            const oldElo = elo[i];
            const newElo = updatedElos[i];
            const eloChange = newElo - oldElo;

            if(results[i] === 1) {
                await sql`UPDATE users SET elo=${newElo}, plays=plays+1, wins=wins+1 WHERE id=${userID}`;
            } else {
                await sql`UPDATE users SET elo=${newElo}, plays=plays+1 WHERE id=${userID}`;
            
            } 

            await sql`INSERT INTO statchanges (gameID, userID, elo, position) VALUES (${gameID}, ${userID}, ${eloChange}, ${results[i]})`;
        }

        return new NextResponse({}, { status: 200 });
    } catch (e) {
        console.error(e);
        return new NextResponse({ error: "Internal Server Error" }, { status: 500 });
    }
}


async function getUserIdByEmail(email) {
    const { rows } = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (rows.length > 0) {
        return rows[0].id
    }
    throw new Error('User not found');
}
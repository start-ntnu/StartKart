import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mysql from 'mysql2';
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

    const connection = mysql.createConnection(process.env.DATABASE_URL);
    const userId = await getUserIdByEmail(session.user.email, connection);
    const eloCalculator = new EloCalculator();

    // Get the updated ratings
    const updatedElos = eloCalculator.adjustRatings(elo, results);

    try {
        await new Promise((resolve, reject) => {
            connection.beginTransaction(err => {
                if (err) {
                    return reject(err);
                }

                const gameQuery = 'INSERT INTO Games (author) VALUES (?)';
                connection.query(gameQuery, [userId], (err, result) => {
                    if (err) {
                        connection.rollback(() => {
                            reject(err);
                        });
                        return;
                    }

                    const gameID = result.insertId;

                    for (let i = 0; i < player.length; i++) {
                        const userID = player[i];
                        const oldElo = elo[i];
                        const newElo = updatedElos[i];
                        const eloChange = newElo - oldElo;

                        const updateWins = results[i] === 1 ? 'wins=wins+1' : '';
                        const userUpdateQuery = `UPDATE Users SET elo=?, plays=plays+1${updateWins ? `, ${updateWins}` : ''} WHERE id=?`;

                        connection.query(userUpdateQuery, [newElo, userID], (err, result) => {
                            if (err) {
                                connection.rollback(() => {
                                    reject(err);
                                });
                                return;
                            }

                            const statsInsertQuery = 'INSERT INTO Statchanges (gameID, userID, elo, position) VALUES (?, ?, ?, ?)';
                            connection.query(statsInsertQuery, [gameID, userID, eloChange, results[i]], (err, result) => {
                                if (err) {
                                    connection.rollback(() => {
                                        reject(err);
                                    });
                                    return;
                                }
                            });
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            connection.rollback(() => {
                                reject(err);
                            });
                        } else {
                            console.log('Transaction Completed Successfully.');
                            resolve();
                        }
                    });
                });
            });
        });

        return new NextResponse({}, { status: 200 });
    } catch (e) {
        console.error(e);
        return new NextResponse({ error: "Internal Server Error" }, { status: 500 });
    }
}


async function getUserIdByEmail(email, connection) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM Users WHERE email = ? LIMIT 1';
        connection.query(query, [email], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            if (results.length > 0) {
                resolve(results[0].id);
            } else {
                reject(new Error('User not found'));
            }
        });
    });
}
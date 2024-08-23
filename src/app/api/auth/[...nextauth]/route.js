import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import mysql from 'mysql2';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        const connection = mysql.createConnection(process.env.DATABASE_URL)
        const checkquery = "select * from Users where email = ?"

        const [rows] = await connection.promise().query(checkquery, [user.email]);
        
        if (rows.length === 0) {
          const insertquery = "INSERT INTO Users (name, email, pfp, nickname) VALUES (?)"
          await connection.promise().query(insertquery, [[user.name, user.email, user.image, user.name.split(" ")[0]]])
        }
        connection.end();
      } catch (err) {
        console.log(err)
      }
      return true
    },
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
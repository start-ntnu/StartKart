import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sql } from "@vercel/postgres";

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
        const {rows} = await sql`select * from users where email = ${user.email}`
        if (rows.length === 0) {
          await sql`INSERT INTO users (name, email, pfp, nickname) VALUES (${user.name}, ${user.email}, ${user.image}, ${user.name.split(" ")[0]})`
        }
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
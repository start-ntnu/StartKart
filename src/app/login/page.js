"use client"
import { Grid, Paper } from '@mui/material'
import { signIn } from "next-auth/react"
import { useSession, signOut } from "next-auth/react"
import { redirect } from 'next/navigation'

export default function Page() {
    return (
        <div style={{ backgroundPosition: "center center", backgroundImage: `url("mariokart.png")`, width: "100vw", height: "100vh", backgroundSize: "cover" }}>
            <Grid container justifyContent="center" alignItems="center" style={{ witdh: "100vw", height: "100vh" }}>
                <Grid item xs={8} md={6} xl={4} lg={4}>
                    <Paper shadow={2} style={{ display: "flex", alignItems: "center", flexDirection: "column", padding: "2rem" }}>
                        <h1>Login</h1>
                        <div class="login" onClick={() => signIn("google", {callbackUrl: "/"})} style={{ fontWeight: "bold", borderRadius: "0.5rem", border: "1px solid black", padding: "0.5rem", display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
                            <img style={{ width: "1.25rem" }} src="google.png" />
                            Sign In With Google
                        </div>

                        <div class="code" style={{ fontSize: "small", paddingTop: "1rem", paddingLeft: "2rem", paddingRight: "1rem" }}>
                            Made with ❤️ by Code 🦆
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
"use client"
import CharacterAvatar from '../../components/CharacterAvatar'
import Leaderboard from '../../components/Leaderboard'
import Header from '../../components/Header'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation';


const fetcher = url => axios.get(url).then(res => res.data)

export default function Home(props) {
  const [data, setData] = useState(null);
  const sess = useSession()
  const { push } = useRouter();
  useEffect(() => {
    const fetch = async () =>{
      try {
        let response = await axios.get("/api/leaderboard")
        let json = await response.data;
        setData(json.sort((a, b) => b.elo - a.elo))
      } catch( err) {
        return push("/login")
        signOut()
      }
    }
    fetch();
  }, [])

  if(!data) return <div></div>
  return (
    <main style={{minHeight: "100vh", backgroundColor:"#0D2438"}}>
        <Header image={sess.data?.user?.image} players={data}/>
        <div style={{ marginBottom: "0.5rem", position: 'relative', backgroundImage: 'url(https://c4.wallpaperflare.com/wallpaper/335/426/455/mario-race-track-speed-wallpaper-preview.jpg)', backgroundSize: "cover", padding: 0, margin: 0}}>
          <div style={{backgroundColor: "lightgray", opacity: 0.3, zIndex: 1, width: "100%", height: "100%", position: "absolute", top: 0, right: 0}}>
          </div>
          <div style={{paddingBottom: "1rem", zIndex: 3, position: "relative"}}>
            <div style={{display: "flex", justifyContent: "center" }}>
              <div style={{paddingTop: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <CharacterAvatar color="#C0C0C0" size="small" number="2" icon={data[1]?.avatar} pfp={data[1]?.pfp}/>
                <h3 style={{padding: 0, margin: 0, color: 'black', fontWeight: "bolder", background: "lightgray", borderRadius: "2rem", padding: "0 0.5rem 0 0.5rem"}}>{data[1]?.nickname}</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <CharacterAvatar color="#FFD700" number="1" icon={data[0]?.avatar} pfp={data[0]?.pfp}/>
                <h3 style={{padding: 0, margin: 0, color: 'black', fontWeight: "bolder", background: "lightgray", borderRadius: "2rem", padding: "0 0.5rem 0 0.5rem"}}>{data[0]?.nickname}</h3>
              </div>
              <div style={{paddingTop: "3rem",  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <CharacterAvatar color="#CD7F32" size="small" number="3" icon={data[2]?.avatar} pfp={data[2]?.pfp}/>
                <h3 style={{padding: 0, margin: 0, color: 'black', fontWeight: "bolder", background: "lightgray", borderRadius: "2rem", padding: "0 0.5rem 0 0.5rem"}}>{data[2]?.nickname}</h3>
              </div>
            </div>
          </div>
        </div>
        <Leaderboard rows={data}/>
      </main>
  )
}

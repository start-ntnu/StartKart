import { Avatar } from "@mui/material"

export default function CharacterAvatar({color, size = "75px", number, icon, pfp}) {
    if(size == "small") {
        size = "50px"
    }

    return (
        <div style={{display: "flex"}}>
            <div style={{"display": "flex", borderRadius: "50%", position: "relative"}}>
                <div style={{border: `0.3rem solid ${color}`,backgroundColor: "#424549", position: "relative", borderRadius: "50%", margin: "1rem", padding:"0.5rem"}}>
                    <Avatar sx={{ width: size, height: size}} alt="Remy Sharp" src={icon} />
                    <div style={{position: "absolute", top: "-0.5rem", right: "-0.50rem", borderRadius: "50%", backgroundColor: color, fontWeight: "bold", color: "white", padding: "0.5rem", width: "1rem", height: "1em", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        {number}
                    </div>
                    <div style={{position: "absolute", bottom: "-0.5rem", left: "-0.5rem" , display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <Avatar  sx={{ width: "2.5rem", height: "2.5rem" }} alt="profile picture" src={pfp} />
                    </div>
                </div>
            </div>
        </div>
    )
}
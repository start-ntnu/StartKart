import {Button, Avatar, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, TextField} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import PositionSelect from './PositionSelect'
import PlayerAutoComplete from './PlayerAutoComplete';
import CharacterAutoComplete from './CharacterAutoComplete';
import axios from 'axios'
import { LoadingButton } from '@mui/lab';
import { useSession } from 'next-auth/react';

export default function Header({image, players}) {

    const [registerGameDialogOpen, setRegisterGameDialogOpen] = useState(false);
    const [editProfileDialogOpen, setEditProfileDialogOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState([[1,],[2,],[3,],[4,]])
    const [loading, setLoading] = useState(false);
    const [characters, setCharacters] = useState([]);
    const sess = useSession()
    const userdata = sess?.data?.user;
    
    const playerData = players.find(p => p.email == userdata?.email);
    const [character, setCharacter] = useState(playerData?.character || null)
    const [nickname, setNickname] = useState(playerData?.nickname || playerData?.name?.split(" ")?.[0] || "")
    const [pfp, setPfp] = useState(playerData?.pfp || "")
    
    useEffect(() => {
        const fetch = async () =>{
            try {
              let response = await axios.get("/api/game/characters")
              let json = await response.data;
              console.log(json)
              setCharacters(json.characters)
            } catch( err) {}
          }

        fetch();
    }, [])
    const handleGameClose = () => {
        setDialogValue([[1,],[2,],[3,],[4,]]);
        setRegisterGameDialogOpen(false);
    }
    
    const handleGameComplete = async () => {
        setLoading(true);
        await axios.post("/api/game", {
            result: dialogValue
        })
        
        setLoading(false);
        setDialogValue([[1,],[2,],[3,],[4,]]);
        setRegisterGameDialogOpen(false);
    }

    const handleProfileClose = () => {
        setEditProfileDialogOpen(false);
    }
    
    const handleProfileComplete = async () => {
        setLoading(true);
        
        await axios.post("/api/profile", {
            nickname: nickname, 
            pfp: userdata.image,
            character: character
        })
        setLoading(false);
        setEditProfileDialogOpen(false);
    }

    return (
        <>
            {/* Create Game Dialog*/}
            <Dialog 
                open={registerGameDialogOpen}
                fullWidth
                onClose={() => handleGameClose()}>
                <DialogTitle>Nytt Spill</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Velg spillerene og plassering
                    </DialogContentText>
                    <div style={{display: "flex", gap: "1rem", flexDirection: "column", marginTop: "0.5rem"}}>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <PositionSelect defaultValue={1} onUpdate={(value) => {
                                let values = dialogValue;
                                values[0] = [value, values[0][1]]
                                setDialogValue(values)
                            }} />
                            <PlayerAutoComplete players={players} onUpdate={(value) => {
                                let values = dialogValue;
                                values[0] = [values[0][0], value]
                                setDialogValue(values)
                            }}/>
                        </div>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <PositionSelect defaultValue={2} onUpdate={(value) => {
                                let values = dialogValue;
                                values[1] = [value,values[1][1]]
                                setDialogValue(values)
                            }} />
                            <PlayerAutoComplete players={players} onUpdate={(value) => {
                                let values = dialogValue;
                                values[1] = [values[1][0], value]
                                setDialogValue(values)
                            }}/>
                        </div>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <PositionSelect defaultValue={3} onUpdate={(value) => {
                                let values = dialogValue;
                                values[2] = [value,values[2][1]]
                                setDialogValue(values)
                            }}/>
                            <PlayerAutoComplete players={players} onUpdate={(value) => {
                                let values = dialogValue;
                                values[2] = [values[2][0], value]
                                setDialogValue(values)
                            }}/>
                        </div>
                        <div style={{display: "flex", gap: "0.5rem"}}>
                            <PositionSelect defaultValue={4} onUpdate={(value) => {
                                let values = dialogValue;
                                values[3] = [value,values[3][1]]
                                setDialogValue(values)
                            }}/>
                            <PlayerAutoComplete players={players} onUpdate={(value) => {
                                let values = dialogValue;
                                values[3] = [values[3][0], value]
                                setDialogValue(values)
                            }}/>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleGameClose()}>Cancel</Button>
                    <LoadingButton  loading={loading} onClick={() =>  handleGameComplete()}>Submit</LoadingButton>
                </DialogActions>
            </Dialog>
            
            {/* Edit Profile Dialog */}
            <Dialog 
                open={editProfileDialogOpen}
                fullWidth
                onClose={() => handleGameClose()}>
                <DialogTitle>Rediger Profil</DialogTitle>
                <DialogContent>
                    <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                        <div style={{display: "flex", gap: "0.5rem", justifyContent: "center"}}>
                            <Avatar sx={{width: "5rem", height: "5rem"}}src={pfp} />
                            <div style={{display: "flex", alignItems: "center"}}>
                                <LoadingButton variant='contained' onClick={() => setPfp(userdata.image)} loading={loading}>Oppdater Bilder (Gmail profil)</LoadingButton>
                            </div>
                        </div>
                        <TextField 
                            value={nickname}
                            onChange={(event) => setNickname(event.target.value)}
                            fullWidth
                            label="Kallenavn"
                        />
                        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                            <Avatar src={character} />
                            <CharacterAutoComplete characters={characters} selected={null} onUpdate={(newValue) => setCharacter(newValue)}/>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleProfileClose()}>Cancel</Button>
                    <LoadingButton  loading={loading} onClick={() =>  handleProfileComplete()}>Submit</LoadingButton>
                </DialogActions>
            </Dialog>

            <div style={{padding: "0.5rem", backgroundColor: "#0D2438", display: "flex", justifyContent: "space-between"}}>
                <div style={{display: "flex", maxWidth: "40%", alignItems: "cneter"}}>
                    <img 
                        style={{height: "auto", width: "100%"}}
                        src="https://static.wixstatic.com/media/56f459_2047a8d1532a4096833e7f574f449f6f~mv2.png/v1/crop/x_866,y_976,w_2939,h_593/fill/w_291,h_58,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/56f459_2047a8d1532a4096833e7f574f449f6f~mv2.png"
                        />

                    </div>
                <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Button variant="contained" onClick={() => setRegisterGameDialogOpen(true)} startIcon={<AddIcon />} size="small">Nytt spill</Button>
                    </div>
                    <Avatar style={{cursor: "pointer"}}src={image} onClick={() => setEditProfileDialogOpen(true)}></Avatar>
                </div>
            </div>
        </>
    )
}
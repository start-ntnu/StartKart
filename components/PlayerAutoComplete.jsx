import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Avatar} from "@mui/material"
import { useState } from 'react';


export default function PlayerAutoComplete({ players, onUpdate }) {
    const [value, setValue] = useState(null);
    return (
        <Autocomplete
            id="player-auto-complete"
            autoHighlight
            fullWidth
            options={players}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
                
                setValue(newValue);
                onUpdate(newValue)
            }}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar src={option.pfp} style={{marginRight: "0.5rem"}}/>
                    {option.name}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Velg person"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                    }}
                />
            )}
        />

    )
}
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {Avatar} from "@mui/material"
import { useState } from 'react';


export default function PlayerAutoComplete({ onUpdate, characters, selected }) {
    const [value, setValue] = useState(selected || null);

    return (
        <Autocomplete
            id="character-auto-complete"
            autoHighlight
            fullWidth
            options={characters}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
                setValue(newValue);
                onUpdate(newValue?.url)
            }}
            renderOption={(props, option) => (
                <Box key={option.url} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar src={option.url} style={{marginRight: "0.5rem"}}/>
                    {option.name}
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Velg Persona"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                    }}
                />
            )}
        />

    )
}
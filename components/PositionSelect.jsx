import { useState } from "react"
import {FormControl, Select, InputLabel, MenuItem} from '@mui/material';

export default function PositionSelect({defaultValue, onUpdate}) {
    const [value, setValue] = useState(defaultValue);
    return (
        <FormControl style={{minWidth: "5rem"}}>
            <Select
                id="select menu"
                value={value}
                defaultValue={defaultValue}
                label="Age"
                onChange={(event) => {
                    onUpdate(event.target.value)
                }}
            >
                <MenuItem value={1} onClick={() => setValue(1)}>1</MenuItem>
                <MenuItem value={2} onClick={() => setValue(2)}>2</MenuItem>
                <MenuItem value={3} onClick={() => setValue(3)}>3</MenuItem>
                <MenuItem value={4} onClick={() => setValue(4)}>4</MenuItem>
            </Select>
        </FormControl>
    )
}
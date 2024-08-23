import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar } from '@mui/material';

export default function Leaderboard({rows}) {
  console.log(rows)
    return (
        <TableContainer component={Paper}>
        <Table width="100%" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nr</TableCell>
              <TableCell>Navn</TableCell>
              <TableCell align="right">Antall Spill</TableCell>
              <TableCell align="right">Poeng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
              >
                <TableCell component="th" scope="row">
                  {(i+1)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem"}}>
                    <Avatar src={row.avatar} />
                    <div>
                      {row.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell align="right">{row.plays} ({row.wins}w)</TableCell>
                <TableCell align="right">{row.elo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}
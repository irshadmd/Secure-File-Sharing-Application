import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Button
} from '@mui/material'
import {Download} from '@mui/icons-material'
import { downloadSharedFile, fetchSharedFiles } from './slice'

const SharedList = () => {
  const files = useSelector(state => state.shared)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchSharedFiles())
  }, [])

  const handleDownload = (fileId, fileName) => {
    if(fileId){
        dispatch(downloadSharedFile(fileId, fileName))
    }
    console.log(fileId, fileName)
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 2, width: "100%"}}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography component="h1" variant="h5">
            Files Shared with Me
          </Typography>
        </Box>

        <TableContainer>
          <Table aria-label="files table">
            <TableHead>
              <TableRow>
                <TableCell>
                    Name
                </TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files?.list?.map((file) => (
                <TableRow
                  key={file?.file?.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {file?.file?.name}
                  </TableCell>
                  <TableCell>
                    {new Date(file?.file?.uploaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {file?.permission === "DOWNLOAD"? 
                    <Button variant="contained" 
                        startIcon={<Download />}
                        onClick={()=>handleDownload(file?.id, file?.file?.name)}
                    > Download</Button>
                    : <span>View Only</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default SharedList


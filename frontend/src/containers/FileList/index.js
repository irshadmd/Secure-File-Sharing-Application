import React, { useEffect, useState } from 'react'
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
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Container
} from '@mui/material'
import { MoreVert, CloudUpload } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { fetchFiles, uploadFile } from './slice'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const FileList = () => {
  const files = useSelector(state => state.files)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUserId, setShareUserId] = useState('')
  const [sharePermission, setSharePermission] = useState('view')
  const [shareExpiration, setShareExpiration] = useState('')

  useEffect(() => {
    dispatch(fetchFiles())
  }, [dispatch])

  const handleMenuClick = (event, file) => {
    setAnchorEl(event.currentTarget)
    setSelectedFile(file)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedFile(null)
  }

  const handleShare = () => {
    setShareDialogOpen(true)
    handleMenuClose()
  }

  const handleDownload = () => {
    if (selectedFile) {
    //   dispatch(downloadFile(selectedFile.id))
    console.log(selectedFile)
    }
    handleMenuClose()
  }

  const handleShareSubmit = () => {
    if (selectedFile) {
    //   dispatch(shareFile(selectedFile.id, shareUserId, sharePermission, shareExpiration))
    console.log(selectedFile)
    }
    setShareDialogOpen(false)
    setShareUserId('')
    setSharePermission('view')
    setShareExpiration('')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      dispatch(uploadFile(file))
    }
  }

  console.log(files)

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 2, width: "100%"}}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography component="h1" variant="h5">
            Secure File Sharing
          </Typography>
        </Box>
        <Stack direction="row" justifyContent="center" alignItems="center" mb={3}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
          >
            Upload File
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </Stack>

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
                  key={file?.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {file?.name}
                  </TableCell>
                  <TableCell>
                    {new Date(file?.uploaded_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="more actions"
                      onClick={(e) => handleMenuClick(e, file)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleShare}>Share</MenuItem>
          <MenuItem onClick={handleDownload}>Download</MenuItem>
        </Menu>

        <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
          <DialogTitle>Share File</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="User ID"
                value={shareUserId}
                onChange={(e) => setShareUserId(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Permission</InputLabel>
                <Select
                  value={sharePermission}
                  label="Permission"
                  onChange={(e) => setSharePermission(e.target.value)}
                >
                  <MenuItem value="view">View</MenuItem>
                  <MenuItem value="download">Download</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Expiration Date"
                type="datetime-local"
                value={shareExpiration}
                onChange={(e) => setShareExpiration(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShareSubmit} variant="contained">Share</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  )
}

export default FileList


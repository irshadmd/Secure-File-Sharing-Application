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
  Container,
  Autocomplete
} from '@mui/material'
import { MoreVert, CloudUpload } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { downloadFile, fetchFiles, setSelectedFile, shareFile, uploadFile } from './slice'
import { fetchUsersList } from '../application/slice'

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
  const selectedFile = useSelector(state => state.files.selected.file)
  const users = useSelector(state => state.auth.userslist)

  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUserId, setShareUserId] = useState(null)
  const [sharePermission, setSharePermission] = useState('VIEW')
  const [shareExpiration, setShareExpiration] = useState('')

  useEffect(() => {
    dispatch(fetchFiles())
    dispatch(fetchUsersList())
  }, [])

  const handleMenuClick = (event, file) => {
    setAnchorEl(event.currentTarget)
    dispatch(setSelectedFile({file: file}))
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
      dispatch(downloadFile(selectedFile.id, selectedFile.name))
    console.log(selectedFile)
    }
    handleMenuClose()
  }

  const handleShareSubmit = () => {
    if (selectedFile) {
      dispatch(shareFile(selectedFile.id, shareUserId, sharePermission, shareExpiration))
    }
    setShareDialogOpen(false)
    setShareUserId(null)
    setSharePermission('VIEW')
    setShareExpiration('')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      dispatch(uploadFile(file))
    }
  }

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
            <FormControl fullWidth margin="normal">
              <Autocomplete
                value={users?.find(user => user?.id === shareUserId) || null}
                onChange={(event, newValue) => {
                  setShareUserId(newValue ? newValue.id : '');
                }}
                options={users ?? []}
                getOptionLabel={(option) => `${option?.name} (${option?.email})`}
                renderInput={(params) => <TextField {...params} label="Select User" />}
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="share-permission-label">Permission</InputLabel>
              <Select
                labelId="share-permission-label"
                id="share-permission"
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value)}
                label="Permission"
              >
                <MenuItem value="VIEW">View</MenuItem>
                <MenuItem value="DOWNLOAD">Download</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                type="datetime-local"
                label="Expiration Date"
                value={shareExpiration}
                onChange={(e) => setShareExpiration(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleShareSubmit}>Share</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  )
}

export default FileList


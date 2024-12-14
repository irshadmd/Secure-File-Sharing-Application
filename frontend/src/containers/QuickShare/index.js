import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Snackbar,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { CloudUpload, ContentCopy } from '@mui/icons-material'
import { quickUploadFile } from './slice'

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

const UrlContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1),
  borderRadius: theme.spacing(1),
}))

const QuickShare = () => {
  const quickshare = useSelector(state => state.quickshare)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const fileInputRef = useRef(null)

  const dispatch = useDispatch()

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      dispatch(quickUploadFile(file))
    }
  }

  const handleCopyUrl = async () => {
    if (quickshare?.shareableUrl) {
      try {
        await navigator.clipboard.writeText(quickshare?.shareableUrl)
        setSnackbarOpen(true)
      } catch (err) {
        console.error('Failed to copy URL:', err)
      }
    }
  }

  console.log(quickshare)
  useEffect(() => {
    console.log(quickshare)
  }, [quickshare])

  return (
    <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold',
            color: '#2D3748',
            fontSize: { md: '2rem' },
        }}>
            Quick File Sharing!
        </Typography>
        
        <Typography variant="h5" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
            Upload and share the download link.
        </Typography>

        <Button
            component="label"
            variant="contained"
            size="large"
            disabled={quickshare?.isLoading}
            startIcon={quickshare?.isLoading ? <CircularProgress size={20} /> : <CloudUpload />}
            sx={{
                backgroundColor: '#4A5568',
                '&:hover': {
                    backgroundColor: '#2D3748',
                },
                py: 1.5,
                px: 4,
            }}
        >
            {quickshare?.isLoading ? 'Uploading...' : 'Upload'}
            <VisuallyHiddenInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            />
        </Button>

        {quickshare?.shareableUrl && (
            <Box mt={3}>
                <Typography variant="h6" align="left" gutterBottom>
                    Here is the generated URL that you may share with your friends:
                </Typography>
                <UrlContainer>
                    <TextField
                        fullWidth
                        value={quickshare?.shareableUrl}
                        InputProps={{
                            readOnly: true,
                        }}
                        variant="outlined"
                        size="small"
                        />
                        <Button
                        variant="contained"
                        onClick={handleCopyUrl}
                        startIcon={<ContentCopy />}
                        sx={{
                            backgroundColor: '#4299E1',
                            '&:hover': {
                            backgroundColor: '#3182CE',
                            },
                            whiteSpace: 'nowrap',
                        }}
                    >
                    Copy
                    </Button>
                </UrlContainer>
            </Box>
        )}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            message="URL copied to clipboard!"
        />
        </Paper>
    </Box>
  )
}

export default QuickShare
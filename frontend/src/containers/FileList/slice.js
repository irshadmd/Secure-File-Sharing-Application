import { createSlice } from '@reduxjs/toolkit'
import api from '../../api/api'

const filesSlice = createSlice({
    name: 'files',
    initialState: {
        isLoading: false,
        list: [],
        selected: {
            file: null,
            isLoading: false
        }
    },
    reducers: {
        setFiles: (state, action) => {
            state.list = action.payload
        },
        startFilesLoading: (state, action) => {
            state.isLoading = true
        },
        stopFilesLoading: (state, action) => {
            state.isLoading = false
        },
        setSelectedFile: (state, action) => {
            state.selected.file = action.payload.file
        },
        startSelectedFileLoading: (state, action) => {
            state.selected.isLoading = true
        },
        stopSelectedFileLoading: (state, action) => {
            state.file.isLoading = false
        },
    },
})

export const { 
    setFiles,
    startFilesLoading,
    stopFilesLoading,
    setSelectedFile,
    startSelectedFileLoading,
    stopSelectedFileLoading
} = filesSlice.actions

export default filesSlice.reducer

export const fetchFiles = () => async (dispatch) => {
  dispatch(startFilesLoading())
  try {
    const response = await api.get('/files/',{
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }},
    )
    dispatch(setFiles(response.data))
  } catch (error) {
    console.error('Error fetching files:', error)
  }
  dispatch(stopFilesLoading())
}

export const uploadFile = (file) => async (dispatch) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/files/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
    dispatch(fetchFiles())
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}

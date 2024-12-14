import { createSlice } from "@reduxjs/toolkit"
import api from "../../api/api"

const sharedFilesSlice = createSlice({
    name: 'shared',
    initialState: {
        isLoading: false,
        list: [],
        selected: {
            file: null,
            isLoading: false
        }
    },
    reducers: {
        setSharedFiles: (state, action) => {
            state.list = action.payload
        },
        startSharedFilesLoading: (state, action) => {
            state.isLoading = true
        },
        stopSharedFilesLoading: (state, action) => {
            state.isLoading = false
        },
        setSelectedSharedFile: (state, action) => {
            state.selected.file = action.payload.file
        },
        startSelectedSharedFileLoading: (state, action) => {
            state.selected.isLoading = true
        },
        stopSelectedSharedFileLoading: (state, action) => {
            state.file.isLoading = false
        },
    },
})


export const { 
    setSharedFiles,
    startSharedFilesLoading,
    stopSharedFilesLoading,
    setSelectedSharedFile,
    startSelectedSharedFileLoading,
    stopSelectedSharedFileLoading
} = sharedFilesSlice.actions

export default sharedFilesSlice.reducer


export const fetchSharedFiles = () => async (dispatch) => {
    dispatch(startSharedFilesLoading())
    try {
      const response = await api.get('/files-shared-with-me/',{
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }},
      )
      dispatch(setSharedFiles(response.data))
    } catch (error) {
      console.error('Error fetching files:', error)
    }
    dispatch(stopSharedFilesLoading())
  }

  export const downloadSharedFile = (fileId, fileName) => async () => {
    try {
      const response = await api.get(`/file-shares/${fileId}/access/`, {
        headers: {
          // responseType: 'blob',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName) //fetch from state
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }
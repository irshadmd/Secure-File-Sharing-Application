import { toast } from "react-toastify"
import api from "../../api/api"
import { createSlice } from "@reduxjs/toolkit"

const quickShareSlice = createSlice({
    name: 'quickshare',
    initialState: {
        isLoading: false,
        file: null,
        shareableUrl: null
    },
    reducers: {
        setQFile: (state, action) => {
            state.file = action.payload
        },
        startQFileLoading: (state, action) => {
            state.isLoading = true
        },
        stopQFileLoading: (state, action) => {
            state.isLoading = false
        },
        setQShareableUrl: (state, action) => {
            state.shareableUrl = action.payload
        }
    },
})

export const { 
    setQFile,
    startQFileLoading,
    stopQFileLoading,
    setQShareableUrl
} = quickShareSlice.actions

export default quickShareSlice.reducer

export const quickUploadFile = (file) => async (dispatch) => {
    dispatch(startQFileLoading())
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/files/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      console.log(response.data)
      dispatch(setQFile(response.data))
      dispatch(getShareableLink(response.data?.id))
    } catch (error) {
      toast.error(`Error uploading file:${error}`)
      console.error('Error uploading file:', error)
    }
    dispatch(stopQFileLoading())
}

export const getShareableLink = (fileId) => async (dispatch) => {
    dispatch(startQFileLoading())
    try {
      const response = await api.post(`/generate-shareable-link/`, {
        'file_id': fileId
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      console.log(response.data)
      dispatch(setQShareableUrl(`http://localhost:8000${response.data.shareable_url}`))
      toast.success('File shared successfully!')
    } catch (error) {
      console.error('Error sharing file:', error)
    }
    dispatch(stopQFileLoading())
  }
import axios from "axios"
import baseUrl from '../utils/baseUrl.js'

const signIn = async (payload) => {
  const response = await axios.post(`${baseUrl.localhost}/user/sign-in`, payload)
  return response.data
}

const getUserById = async (userId) => {
  const response = await axios.get(
    `${baseUrl.localhost}/user/get-user-by-id/${userId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashData = async () => {
  const response = await axios.get(
    `${baseUrl.localhost}/get-dash-data`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashById = async (dashId) => {
  const response = await axios.get(
    `${baseUrl.localhost}/get-dash-by-id/${dashId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getKPIs = async () => {
  const response = await axios.get(
    `${baseUrl.localhost}/kpi/get-all-kpis`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getAllCampaings = async () => {
  const response = await axios.get(
    `${baseUrl.localhost}/campaigns/get-all-campaigns`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )

  return response.data
}

const getDocsData = async () => {
  const response = await axios.get(
    `${baseUrl.localhost}/docs/get-docs`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )

  return response.data
}

const uploadScriptFile = async () => {
  const response = await axios.post(`${baseUrl.localhost}/docs/upload-script-file/:file`)
  return response.data
}

const createScriptDoc = async () => {
  const response = await axios.post(`${baseUrl.localhost}/docs/create-new-script-doc`, payload)
  return response.data
}

export default {
  signIn,
  getUserById,
  getDashById,
  getDashData,
  getKPIs,
  getAllCampaings,
  getDocsData,
  uploadScriptFile,
  createScriptDoc
}
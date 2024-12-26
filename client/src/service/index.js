import axios from "axios"
import baseUrl from '../utils/baseUrl.js'

const signIn = async (payload) => {
  const response = await axios.post(`${baseUrl.production}/user/sign-in`, payload)
  return response.data
}

const getUserById = async (userId) => {
  const response = await axios.get(
    `${baseUrl.production}/user/get-user-by-id/${userId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashData = async () => {
  const response = await axios.get(
    `${baseUrl.production}/get-dash-data`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashById = async (dashId) => {
  const response = await axios.get(
    `${baseUrl.production}/get-dash-by-id/${dashId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getKPIs = async () => {
  const response = await axios.get(
    `${baseUrl.production}/kpi/get-all-kpis`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getAllCampaings = async () => {
  const response = await axios.get(
    `${baseUrl.production}/campaigns/get-all-campaigns`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )

  return response.data
}

export default {
  signIn,
  getUserById,
  getDashById,
  getDashData,
  getKPIs,
  getAllCampaings
}
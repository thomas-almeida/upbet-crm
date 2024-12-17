import axios from "axios"
import baseUrl from '../utils/baseUrl.js'

const signIn = async (payload) => {
  const response = await axios.post(`${baseUrl.localhost}/user/sign-in`, payload)
  return response.data
}

const getUserById = async (userId) => {
  const response = await axios.get(`${baseUrl.localhost}/user/get-user-by-id/${userId}`)
  return response.data
}

const getDashData = async () => {
  const response = await axios.get(`${baseUrl.localhost}/get-dash-data`)
  return response.data
}

const getDashById = async (dashId) => {
  const response = await axios.get(`${baseUrl.localhost}/get-dash-by-id/${dashId}`)
  return response.data
}

export default {
  signIn,
  getUserById,
  getDashById,
  getDashData
}
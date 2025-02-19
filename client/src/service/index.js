import axios from "axios"
import baseUrl from '../utils/baseUrl.js'

const signIn = async (payload) => {
  const response = await axios.post(`${baseUrl.productionHome}/user/sign-in`, payload)
  return response.data
}

const getUserById = async (userId) => {
  const response = await axios.get(
    `${baseUrl.productionHome}/user/get-user-by-id/${userId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashData = async () => {
  const response = await axios.get(
    `${baseUrl.productionHome}/get-dash-data`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getDashById = async (dashId) => {
  const response = await axios.get(
    `${baseUrl.productionHome}/get-dash-by-id/${dashId}`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getKPIs = async () => {
  const response = await axios.get(
    `${baseUrl.productionHome}/kpi/get-all-kpis`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )
  return response.data
}

const getAllCampaings = async () => {
  const response = await axios.get(
    `${baseUrl.productionHome}/campaigns/get-all-campaigns`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )

  return response.data
}

const getDocsData = async () => {
  const response = await axios.get(
    `${baseUrl.productionHome}/docs/get-docs`, {
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  }
  )

  return response.data
}

const uploadScriptFile = async (file) => {

  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${baseUrl.productionHome}/docs/upload-script-file`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const createScriptDoc = async (payload) => {
  const response = await axios.post(`${baseUrl.productionHome}/docs/create-new-script-doc`, payload)
  return response.data
}

const getTransactionsBalance = async (start_date, end_date) => {
  const response = await axios.get(`${baseUrl.productionHome}/proxy/get-transactions-ballance?start_date=${start_date}&end_date=${end_date}`, {
    headers: {
      'x-signature': `${baseUrl.upsportsKey}`,
      "ngrok-skip-browser-warning": "true"
    }
  })

  return response.data
}

const getTransactionsByDate = async (payload) => {
  const response = await axios.post(`${baseUrl.productionHome}/transactions/get-transactions-by-date`, payload)
  return response.data
}

const getTransactionsToday = async (payload) => {
  const response = await axios.post(`${baseUrl.productionHome}/transactions/get-transactions-today`, payload)
  return response.data
}

const getKYCToday = async (targetDate) => {
  const response = await axios.get(`${baseUrl.productionHome}/kyc/get-kyc-today?targetDate=${targetDate}`, {
    headers: {
      'x-signature': `${baseUrl.upsportsKey}`,
      "ngrok-skip-browser-warning": "true"
    }
  })

  return response.data
}

const getFTDToday = async (targetDate) => {
  const response = await axios.get(`${baseUrl.productionHome}/ftd/get-ftd-today?targetDate=${targetDate}`, {
    headers: {
      'x-signature': `${baseUrl.upsportsKey}`,
      "ngrok-skip-browser-warning": "true"
    }
  })

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
  createScriptDoc,
  getTransactionsBalance,
  getTransactionsToday,
  getTransactionsByDate,
  getKYCToday,
  getFTDToday
}
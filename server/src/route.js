import { Router } from "express"
import queryDataController from "../controllers/queryDataController.js"
import userController from "../controllers/userController.js"
import routinesController from "../controllers/routinesController.js"
import cron from 'node-cron'
import kpiController from "../controllers/kpi-controller.js"

const api = Router()

// get query results (json)
api.post('/get-query-results', queryDataController.convertCSVQuery)
api.get('/get-dash-data', queryDataController.getDashData)
api.get('/get-dash-by-id/:id', queryDataController.getDashById)

// user
api.post('/user/sign-up', userController.signUp)
api.post('/user/sign-in', userController.signIn)
api.get('/user/get-user-by-id/:id', userController.getUserById)

//query
api.get('/update-dash-data/:id', routinesController.updateDashInLoopById)
api.post('/sheets/get-sheets-data', queryDataController.getSheetsData)

//Campaigns
api.post('/campaigns/get-campaigns-by-date', queryDataController.getCampaignData)
api.get('/campaigns/get-all-campaigns', queryDataController.getAllCampaings)

// KPIs
api.post('/kpi/create-kpi', kpiController.createKPI)
api.get('/kpi/get-all-kpis', kpiController.getAllKPIs)



// Cron Jobs

cron.schedule('41 16 * * *', async () => {

    const date = '12/2024'
    const spreadsheetId = '14P77Z0lbIo06JqXFiYyTPaUIV5yjuF41H9G5Nuc2x20'
    const range = 'resumo!A1:Q36'
    const campaignId = 'zyjwyt691'

    const response = await routinesController.updateCampaigns(date, spreadsheetId, range, campaignId)
    console.log('CRON JOB: CAMPAIGNS', response.message)
})

cron.schedule('42 16 * * *', async () => {

    const dashId = 'zyjwyt691'
    const date = '12/2024'

    const response = await routinesController.updateKPIs(dashId, date)
    console.log('CRON JOB: UPDATE KPIs', response.message)
})

cron.schedule('0 15 * * *', async () => {
    const dashId = 'hejtxd981'
    const response = await routinesController.updateDashInLoopById(dashId)
    console.log('CRON JOB: 03 AM', response.message)
})

export default api
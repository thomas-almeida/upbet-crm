import { Router } from "express"
import queryDataController from "../controllers/queryDataController.js"
import userController from "../controllers/userController.js"
import routinesController from "../controllers/routinesController.js"
import cron from 'node-cron'
import kpiController from "../controllers/kpi-controller.js"
import docsCotroller from "../controllers/docsCotroller.js"
import multer from '../utils/multer.js'
import sheetsController from "../controllers/sheets-controller.js"
import depositController from "../controllers/depositController.js"
import transactionsController from "../controllers/transactionsController.js"
import proxyController from "../controllers/proxyController.js"

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

//DOCS
api.post('/docs/upload-script-file', multer.upload.single('file'), docsCotroller.uploadFile)
api.post('/docs/create-new-script-doc', docsCotroller.createScriptDoc)
api.get('/docs/get-docs', docsCotroller.getScriptDocs)

//SHEETS DEPOSITS
api.get('/sheets/get-deposit/:campaignDataId/:campaignId/:startDate/:endDate/:type', sheetsController.getDepositByDate)
api.get('/sheets/get-users-target/:campaignDataId/:campaignId/:startDate/:endDate', sheetsController.getUsersTarget)
api.get('/sheets/get-deposit-by-campaing-id/:campaignDataId/:campaignId/:type', sheetsController.getDepositByCampaignId)
api.get('/sheets/get-user-target-by-campaign-id/:campaignDataId/:campaignId', sheetsController.getUsersTargetByCampaignId)
api.get('/sheets/get-mails-by-campaign/:campaignDataId/:campaignId/:factTypeId', sheetsController.getMailsByCampaign)

//DEPOSITS
api.get('/deposits/get-deposits-by-period/:start_date/:end_date', depositController.getDepositsByCurrentMonth)
api.get('/deposits/get-withdrawals-by-period/:start_date/:end_date', depositController.getWhitdrawsByCurrentMonth)
api.post('/transactions/get-transactions-today', transactionsController.getDepositsToday)

//Proxy
api.get('/proxy/get-transactions-ballance', proxyController.proxyTransactionsBalance)

cron.schedule('0 12 * * *', async () => {
    const dashId = 'hejtxd981'
    const response = await routinesController.updateDashInLoopById(dashId)
    console.log('Atualizando Jornada Cashback', response.message)
})

export default api
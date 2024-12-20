import { Router } from "express"
import queryDataController from "../controllers/queryDataController.js"
import userController from "../controllers/userController.js"
import routinesController from "../controllers/routinesController.js"
import cron from 'node-cron'

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

cron.schedule('0 15 * * *', async () => {
    const dashId = 'hejtxd981'
    const response = await routinesController.updateDashInLoopById(dashId)
    console.log('CRON JOB: 03 AM', response.message)
})

export default api
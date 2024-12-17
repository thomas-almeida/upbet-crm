import { Router } from "express"
import queryDataController from "../controllers/queryDataController.js"
import userController from "../controllers/userController.js"

const api = Router()

// get query results (json)
api.post('/get-query-results', queryDataController.convertCSVQuery)
api.get('/get-dash-data', queryDataController.getDashData)
api.get('/get-dash-by-id/:id', queryDataController.getDashById)

// user
api.post('/user/sign-up', userController.signUp)
api.post('/user/sign-in', userController.signIn)
api.get('/user/get-user-by-id/:id', userController.getUserById)

export default api
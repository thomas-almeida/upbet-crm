import { Router } from "express"
import queryDataController from "../controllers/queryDataController.js"

const api = Router()

// get query results (json)
api.post('/get-query-results', queryDataController.convertCSVQuery)
api.get('/get-dash-data/:id', queryDataController.getDashData)

export default api
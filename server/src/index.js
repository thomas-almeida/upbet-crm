import api from "./route.js"
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(express.json())
app.use(cors())
app.use(api)

app.listen(PORT, () => {
  console.log(`CRM ONLINE`)
})


import api from "./route.js"

import { fileUrlToPath } from 'url'
import path from 'path'
import express from 'express'
import cors from 'cors'

const __dirname = path.dirname(fileUrlToPath(import.meta.url))
const app = express()
const PORT = 3002

app.use(express.json())
app.use(cors())
app.use(api)

app.listen(PORT, () => {
  console.log(`CRM ONLINE`)
})


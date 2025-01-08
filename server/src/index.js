import api from "./route.js"
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from "url"

dotenv.config()
const app = express()
const PORT = 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.json({ limit: '500mb' }))

app.use(express.json())
app.use(cors())
app.use(api)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`CRM ONLINE`)
})


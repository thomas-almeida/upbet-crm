import idGenerator from "../utils/idGenerator.js"
import fs from 'fs'
import csvParser from 'csv-parser'

import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')

let dashes = []
async function convertCSVQuery(req, res) {
  try {
    const { csvPath, range, dashName } = req.body

    const data = fs.readFileSync(dashDB, 'utf-8')
    dashes = data ? JSON.parse(data) : []

    let csvFiltered = []

    fs.createReadStream(csvPath)
      .pipe(csvParser())
      .on('data', (row) => {
        csvFiltered.push(row)
      })
      .on('end', () => {
        
        const resultsData = {
          id: idGenerator.generateExtensiveId(dashes),
          name: dashName,
          range: range,
          results: csvFiltered
        }

        res.status(200).json({
          message: 'success',
          data: resultsData
        })

        dashes.push(resultsData)
        fs.writeFileSync(dashDB, JSON.stringify(dashes, null, 2))
      })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'An error occurred', error })
  }
}

async function getDashData(req, res) {
  try {

    const id = req.params.id
    const dashData = fs.readFileSync(dashDB, 'utf-8')
    dashes = dashData ? JSON.parse(dashData) : []

    dashes.forEach((dashItem) => {
      if (dashItem?.id === id) {
        res.status(200).json({
          message: 'success',
          data: dashItem
        })
      }
    })

  } catch (error) {
    console.error(error)
  }
}

export default {
  convertCSVQuery,
  getDashData
}
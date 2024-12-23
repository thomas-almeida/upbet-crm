import idGenerator from "../utils/idGenerator.js"
import fs from 'fs'
import csvParser from 'csv-parser'
import { google } from 'googleapis'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')

let dashes = []
async function convertCSVQuery(req, res) {
  try {
    const {
      csvPath,
      createdAt,
      dashName,
      metricLabel,
      label,
      value,
      headers,
      filter,
      chartType,
    } = req.body

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
          createdAt: createdAt,
          metricLabel: metricLabel,
          chartType: chartType,
          filter: filter,
          guides: {
            label: label,
            value: value
          },
          headers,
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

async function getDashById(req, res) {
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

async function getDashData(req, res) {
  try {

    const dashData = fs.readFileSync(dashDB, 'utf-8')
    dashes = dashData ? JSON.parse(dashData) : []

    res.status(200).json({
      message: 'success',
      dashData: dashes
    })

  } catch (error) {
    console.error(error)
  }
}

async function getSheetsData(req, res) {
  try {

    const {
      spreadsheetId,
      range,
      createdAt,
      dashName,
      metricLabel,
      label,
      value,
      headers,
      filter,
      chartType,
    } = req.body
    const dbData = fs.readFileSync(dashDB, 'utf-8')
    dashes = dbData ? JSON.parse(dbData) : []

    if (!spreadsheetId || !range) {
      return res.status(400).json({
        message: 'SpreadsheetId or range not defined'
      })
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../utils/sheets-credentials.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    })

    const client = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: client })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })

    const rows = response.data.values

    if (!rows.length) {
      return res.status(200).json({
        message: 'nenhum dado encontrado'
      })
    }

    const [sheetHeaders, ...data] = rows
    const jsonData = data.map(row => {
      return sheetHeaders.reduce((acc, header, index) => {
      
        let value = row[index] || null

        if (typeof value === 'string' && value.includes('R$')) {
          value = parseFloat(value.replace(/[^\d]/g, ''), 10) || null
        }
        acc[header] = value
        return acc
      }, {})
    })

    const resultsData = {
      id: idGenerator.generateExtensiveId(dashes),
      name: dashName,
      createdAt: createdAt,
      metricLabel: metricLabel,
      chartType: chartType,
      filter: filter,
      guides: {
        label: label,
        value: value
      },
      headers,
      results: jsonData
    }

    res.status(200).json({
      message: 'success',
      data: resultsData
    })

    dashes.push(resultsData)
    fs.writeFileSync(dashDB, JSON.stringify(dashes, null, 2))

  } catch (error) {
    res.status(500).json({
      message: `error, ${error}`
    })
    console.error(error)
  }
}

export default {
  convertCSVQuery,
  getDashById,
  getDashData,
  getSheetsData
}
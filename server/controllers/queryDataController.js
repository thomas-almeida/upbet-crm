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

    const { csvPath, range } = req.body
    const itemsMap = {}

    const data = fs.readFileSync(dashDB, 'utf-8')
    dashes = data ? JSON.parse(data) : []

    fs.createReadStream(`${csvPath}`)
      .pipe(csvParser())
      .on('data', (row) => {
        const shopItemId = row.shop_item_id
        const itemname = row.item_name
        const pointsAmount = parseInt(row.points_amount)

        if (itemsMap[shopItemId]) {
          itemsMap[shopItemId].totalPoints += pointsAmount
          itemsMap[shopItemId].count += 1
        } else {
          itemsMap[shopItemId] = {
            shopItemId,
            itemname,
            pointsAmount,
            totalPoints: pointsAmount,
            count: 1,
          }
        }
      })
      .on('end', () => {
        const resultsData = {
          id: idGenerator.generateExtensiveId(dashes),
          results: Object.values(itemsMap),
          range: range
        }
        resultsData.results.sort((a, b) => b.totalPoints - a.totalPoints)
        res.status(200).json({
          mesage: 'success',
          data: resultsData
        })

        dashes.push(resultsData)
        fs.writeFileSync(dashDB, JSON.stringify(dashes, null, 2))
      })
  } catch (error) {
    console.error(error)
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
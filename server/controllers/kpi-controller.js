import idGenerator from "../utils/idGenerator.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')
const kpiDB = path.join(__dirname, '..', 'db', 'kpi-data.json')

let dashes = []
let KPIs = []

async function createKPI(req, res) {
    try {

        const { dashId, label, calcOptions, kpiName, type, category } = req.body

        let calculatedItems
        const dashData = fs.readFileSync(dashDB, 'utf-8')
        dashes = dashData ? JSON.parse(dashData) : []

        const kpiData = fs.readFileSync(kpiDB, 'utf-8')
        KPIs = kpiData ? JSON.parse(kpiData) : []

        const selectedDash = dashes.find((dash) => dash.id === dashId)
        const itemsToCalc = selectedDash?.results?.map((filteredItem) => parseFloat(filteredItem[label]))

        if (calcOptions === 'soma') {
            calculatedItems = itemsToCalc?.reduce((acc, value) => {
                return acc + value
            }, 0)
        }

        const kpiObject = {
            id: idGenerator.generateExtensiveId(KPIs),
            name: kpiName,
            label: label,
            calcOptions: calcOptions,
            referenceDashId: dashId,
            type: type,
            category: category,
            value: calculatedItems
        }

        KPIs.push(kpiObject)

        res.status(200).json({
            message: 'success',
            data: kpiObject
        })

        fs.writeFileSync(kpiDB, JSON.stringify(KPIs, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function getAllKPIs(req, res) {
    try {

        const kpiData = fs.readFileSync(kpiDB, 'utf-8')
        KPIs = kpiData ? JSON.parse(kpiData) : []

        res.status(200).json({
            message: 'success',
            data: KPIs
        })

    } catch (error) {
        console.error(error)
    }
}

async function KPI(dashId, label, calcOptions) {

    try {

        let calculatedItems
        const dashData = fs.readFileSync(dashDB, 'utf-8')
        dashes = dashData ? JSON.parse(dashData) : []

        const kpiData = fs.readFileSync(kpiDB, 'utf-8')
        KPIs = kpiData ? JSON.parse(kpiData) : []

        const selectedDash = dashes.find((dash) => dash.id === dashId)
        const itemsToCalc = selectedDash?.results?.map((filteredItem) => parseFloat(filteredItem[label]))

        console.log(itemsToCalc)

        if (calcOptions === 'soma') {
            calculatedItems = itemsToCalc?.reduce((acc, value) => {

                if (typeof (acc) === 'string') {
                    parseInt(acc)
                    console.log(acc)
                }

                return acc + value
            }, 0)
        }

        console.log(calculatedItems)


    } catch (err) {
        console.error(err)
    }
}

//KPI("moebzq131", 'Clientes impactados', 'soma')

export default {
    createKPI,
    getAllKPIs
}
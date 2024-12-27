import path from 'path'
import { fileURLToPath } from 'url'
import sqlQuery from '../utils/sqlQuery.js'
import fs from 'fs'
import { google } from 'googleapis'
import idGenerator from '../utils/idGenerator.js'
import { error } from 'console'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')
const campaignDB = path.join(__dirname, '..', 'db', 'campaign-data.json')
const kpiDB = path.join(__dirname, '..', 'db', 'kpi-data.json')

const query = `
            SELECT 
                DATE(TIMESTAMP_ADD(conv.event_date, INTERVAL -3 HOUR)) AS event_date,
                COUNT(DISTINCT cm.user_id) as target_users,
                COUNT(DISTINCT conv.user_id) as converted_users
            FROM 
                dwh_ext_12023.dm_audience as a
            INNER JOIN 
                dwh_ext_12023.j_av as conv
                ON a.audience_id = conv.audience_id
            INNER JOIN 
                dwh_ext_12023.j_engagements as cm
                ON a.audience_id = cm.root_audience_id
                AND DATE(TIMESTAMP_ADD(conv.event_date, INTERVAL -3 HOUR)) = DATE(TIMESTAMP_ADD(cm.create_date , INTERVAL -3 HOUR))
            WHERE 
                a.audience_id = 1070225
            GROUP BY DATE(TIMESTAMP_ADD(conv.event_date, INTERVAL -3 HOUR))
            ORDER BY event_date
        `

let dashes = []
let campaigns = []
let kpis = []

async function updateDashInLoopById(dashId) {

    console.log('CRON JOB*******')
    console.log('DASH ID, ', dashId)
    const data = fs.readFileSync(dashDB, 'utf-8')
    dashes = data ? JSON.parse(data) : []

    const existantDash = dashes.some(dash => dash.id === dashId)

    if (existantDash) {

        console.log('CRON JOB INICIANDO TRY...')
        const selectedDash = dashes.find((dash) => dash.id === dashId)
        const queryResults = await sqlQuery.executeBigQuery(query)
        selectedDash.results = queryResults

        fs.writeFileSync(dashDB, JSON.stringify(dashes, null, 2))
        console.log(`Dash ${selectedDash?.name} foi atualizado`)
    }

}

async function updateCampaigns(date, spreadsheetId, range, campaingId) {

    try {

        console.log("CRON JOB: CAMPAIGNS")

        const campaignData = fs.readFileSync(campaignDB, 'utf-8')
        campaigns = campaignData ? JSON.parse(campaignData) : []

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

        console.log(campaingId, ': conect google sheets')

        const rows = response.data.values

        const [sheetHeaders, ...data] = rows
        const jsonData = data.map(row => {
            return sheetHeaders.reduce((acc, header, index) => {

                let value = row[index] || 0

                if (typeof value === 'string' && value.includes('R$')) {
                    value = parseFloat(value.replace(/[^\d]/g, ''), 10) || 0
                }
                acc[header] = value
                return acc
            }, {})
        })

        console.log(campaingId, ': data collected')
        const [selectedMonth, selectedYear] = date.split('/')
        const filteredDate = jsonData.filter((campaign) => {
            if (campaign?.Data) {
                const [campaignDay, campaignMonth, campaignYear] = campaign.Data.split('/')
                return campaignMonth === selectedMonth && campaignYear === selectedYear
            }

            return false
        })

        if (campaingId !== null || '') {

            const campaignExist = campaigns.some((campaign) => campaign?.id === campaingId)

            if (campaignExist) {

                const selectedCampaign = campaigns.find((campaign) => campaign?.id === campaingId)
                selectedCampaign.campaigns = filteredDate
                fs.writeFileSync(campaignDB, JSON.stringify(campaigns, null, 2))

                console.log(`Campanha ${campaingId} atualizada com sucesso`)
                return
            }
        }

        const resultsData = {
            id: idGenerator.generateExtensiveId(campaigns),
            referenceMonth: date,
            campaigns: filteredDate
        }

        campaigns.push(resultsData)
        fs.writeFileSync(campaignDB, JSON.stringify(campaigns, null, 2))

        console.log(`Nova campanha ${resultsData.id} criada com sucesso`)

    } catch (err) {
        console.error(err)
    }
}

async function updateKPIs(dashId, date) {

    try {

        let labelsToCalc = []

        const campaignData = fs.readFileSync(campaignDB, 'utf-8')
        campaigns = campaignData ? JSON.parse(campaignData) : []

        const kpiData = fs.readFileSync(kpiDB, 'utf-8')
        kpis = kpiData ? JSON.parse(kpiData) : []

        const selectedCampaignDash = campaigns.find((campaignDash) => campaignDash.id === dashId)
        const selectedKpis = kpis.filter((kpi) => kpi.date === date)

        selectedKpis.filter((item) => {
            labelsToCalc.push(item.label)
        })

        labelsToCalc.forEach((label) => {
            const itemsToCalc = selectedCampaignDash.campaigns.map((item) => parseFloat(item[label]))
            const calculatedLabel = itemsToCalc.reduce((acc, value) => {
                return acc + value
            }, 0)

            const kpiToUpdate = kpis.find((kpi) => kpi.date === date && kpi.label === label)

            if (kpiToUpdate) {
                kpiToUpdate.value = calculatedLabel
            }
        })

        fs.writeFileSync(kpiDB, JSON.stringify(kpis, null, 2))
        console.log('KPIs atualizados com sucesso')

    } catch (err) {
        console.error(error)
    }

}

export default {
    updateDashInLoopById,
    updateCampaigns,
    updateKPIs
}
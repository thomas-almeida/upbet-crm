import path from 'path'
import { fileURLToPath } from 'url'
import sqlQuery from '../utils/sqlQuery.js'
import fs from 'fs'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')

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

export default {
    updateDashInLoopById
}
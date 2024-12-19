import { BigQuery } from '@google-cloud/bigquery'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const credentialsPath = path.join(__dirname, 'credentials.json')
const bigquery = new BigQuery({
    keyFilename: credentialsPath,
    projectId: 'smartico-bq3'
})


function formatQueryResults(results) {
    return results.map(row => ({
        event_date: row.event_date.value,
        target_users: row.target_users,
        converted_users: row.converted_users
    }))
}

async function executeBigQuery(query) {
    try {
        const [rows] = await bigquery.query({ query })
        const formattedResults = formatQueryResults(rows)
        return formattedResults
    } catch (err) {
        console.error('Erro ao consultar: ', err.message)
        throw err
    }
}

export default {
    executeBigQuery
}
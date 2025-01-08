import { BigQuery } from '@google-cloud/bigquery'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const credentialsPath = path.join(__dirname, 'credentials.json')
const bigquery = new BigQuery({
    keyFilename: credentialsPath,
    projectId: 'smartico-bq3'
})

let userExtIds = []

function formatQueryResults(results) {
    return results.map((user) => (
        userExtIds.push(user.user_ext_id)
    ))
}

async function executeBigQuery(query) {
    try {
      const options = {
        query: query, // Aqui deve ser a string SQL
        useLegacySql: false, // Certifique-se de que está usando SQL moderno
      };
  
      const [rows] = await bigquery.query(options);
      formatQueryResults(rows);
      return userExtIds;
    } catch (err) {
      console.error("Erro ao consultar:", err.message);
      throw err;
    }
  }
  

export default {
    executeBigQuery
}
import { BigQuery } from '@google-cloud/bigquery'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const credentialsPath = path.join(__dirname, 'credentials.json')
const bigquery = new BigQuery({
  keyFilename: credentialsPath,
  projectId: 'smartico-bq3'
})


function formatQueryResults(results, userExtIds) {
  return results.map((user) => (
    userExtIds.push(user.user_ext_id)
  ))
}

async function executeBigQuery(query) {

  let userExtIds = []

  try {
    const options = {
      query: query, // Aqui deve ser a string SQL
      useLegacySql: false, // Certifique-se de que está usando SQL moderno
      useQueryCache: false
    };

    const [rows] = await bigquery.query(options);
    formatQueryResults(rows, userExtIds);
    return userExtIds;
  } catch (err) {
    console.error("Erro ao consultar:", err.message);
    throw err;
  }
}


export default {
  executeBigQuery
}
import queryExtId from "../utils/queryExtId.js"
import query from "../utils/query.js"
import axios from "axios"

const depositBaseUrl = "https://api.originals.upsports.app:3000/sportingtech/misc/balance/customers"

async function getDepositByDate(req, res) {
    try {
        const { campaignId, startDate, endDate } = req.params


        // Obtendo os customers da campanha
        const sqlQuery = query.usrs_by_campaign_id(campaignId)
        const queryResults = await queryExtId.executeBigQuery(sqlQuery)

        // Mapear customers como inteiros
        const customers = queryResults.map(result => parseInt(result))

        console.log(`CAMPAIGN ID: ${campaignId}`)
        console.log(`Total Customers: ${customers.length}`)

        // Criar chunks de tamanho fixo (10.000)
        const chunkSize = 10000
        const chunks = []
        for (let i = 0; i < customers.length; i += chunkSize) {
            chunks.push(customers.slice(i, i + chunkSize))
        }

        // Processar cada chunk
        let totalDeposit = 0
        for (const chunk of chunks) {

            const payload = {
                customers: chunk,
                start_date: startDate,
                end_date: endDate,
            }

            try {

                const response = await axios.post(depositBaseUrl, payload, {
                    headers: {
                        "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
                    },
                })

                const data = response.data
                const chunkDeposit = data.reduce((acc, cv) => acc + (cv.deposits_sum || 0), 0)
                totalDeposit += chunkDeposit
                console.log(`Chunk processed. Total so far: ${totalDeposit}`)
                
            } catch (err) {
                console.error("Erro no processamento do chunk:", err.message)
            }
        }

        res.status(200).json({
            message: "success",
            data: totalDeposit,
        })

    } catch (err) {
        console.error("Erro ao processar requisição:", err.message)
        res.status(500).json({ message: "Erro no servidor", error: err.message })
    }
}


export default {
    getDepositByDate,
}

import queryExtId from "../utils/queryExtId.js"
import query from "../utils/query.js"
import axios from "axios"
import fs, { fsync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const depositBaseUrl = "https://api.originals.upsports.app:3000/sportingtech/misc/balance/customers"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const campaignDB = path.join(__dirname, '..', 'db', 'campaign-data.json')

let campaigns = []
const types = ["Dep. 24hrs pos campanha", "Dep. 48h pos campanha", "Dep. 7 dias pos campanha"]

async function getDepositByDate(req, res) {

    try {
        const { campaignDataId, campaignId, startDate, endDate, type } = req.params

        const data = fs.readFileSync(campaignDB, 'utf-8')
        campaigns = data ? JSON.parse(data) : []

        // Obtendo os customers da campanha
        const sqlQuery = query.usrs_by_campaign_id(campaignId)
        const queryResults = await queryExtId.executeBigQuery(sqlQuery)

        // Mapear customers como inteiros
        const customers = queryResults.map(result => parseInt(result))

        console.log(`CAMPAIGN ID: ${campaignId}`)
        console.log(`Total Customers: ${customers.length}`)


        const chunkSize = 10000
        const chunks = []
        for (let i = 0; i < customers.length; i += chunkSize) {
            chunks.push(customers.slice(i, i + chunkSize))
        }

        const selectedCampaignData = campaigns.find((campaign) => campaign.id === campaignDataId)
        const targetCampaign = selectedCampaignData.campaigns.find((target) => target['Campaing ID'] === campaignId)

        // Processar cada chunk
        let totalDeposit = 0

        for (let chunk of chunks) {

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

        console.log(type)
        if (parseInt(type) === 1) {
            targetCampaign[types[0].label] = totalDeposit
        } else if (parseInt(type) === 2) {
            targetCampaign[types[1].label] = totalDeposit
        } else if (parseInt(type) === 3) {
            targetCampaign[types[2].label] = totalDeposit
        }

        res.status(200).json({
            message: "success",
            data: totalDeposit,
        })

        fs.writeFileSync(campaignDB, JSON.stringify(campaigns, null, 2))

    } catch (err) {
        console.error("Erro ao processar requisição:", err.message)
        res.status(500).json({ message: "Erro no servidor", error: err.message })
    }
}

async function getUsersTarget(req, res) {
    try {

        const { campaignDataId, campaignId, startDate, endDate } = req.params

        const data = fs.readFileSync(campaignDB, 'utf-8')
        campaigns = data ? JSON.parse(data) : []

        // Obtendo os customers da campanha
        const sqlQuery = query.usrs_by_campaign_id(campaignId)
        const queryResults = await queryExtId.executeBigQuery(sqlQuery)

        // Mapear customers como inteiros
        const customers = queryResults.map(result => parseInt(result))

        console.log(`CAMPAIGN ID: ${campaignId}`)
        console.log(`Total Customers: ${customers.length}`)


        const chunkSize = 10000
        const chunks = []
        for (let i = 0; i < customers.length; i += chunkSize) {
            chunks.push(customers.slice(i, i + chunkSize))
        }

        const selectedCampaignData = campaigns.find((campaign) => campaign.id === campaignDataId)
        const targetCampaign = selectedCampaignData.campaigns.find((target) => target['Campaing ID'] === campaignId)

        let depositsCount = 0

        for (let chunk of chunks) {

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
                const chunkCount = data.reduce((acc, cv) => acc + (cv.deposits_count > 0 ? 1 : 0), 0)
                depositsCount += chunkCount
                console.log(`Chunk processed. Total so far: ${depositsCount}`)

            } catch (err) {
                console.error("Erro no processamento do chunk:", err.message)
            }

        }

        targetCampaign['Clientes impactados'] = depositsCount

        res.status(200).json({
            message: "success",
            data: depositsCount,
        })

        fs.writeFileSync(campaignDB, JSON.stringify(campaigns, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function getDepositByCampaignId(req, res) {
    try {
        const { campaignDataId, campaignId, type } = req.params;
        let result = ''

        const data = fs.readFileSync(campaignDB, 'utf-8')
        const campaigns = data ? JSON.parse(data) : []

        const selectedCampaignItem = campaigns.find((campaignData) => campaignData.id === campaignDataId)

        if (!selectedCampaignItem) {
            return res.status(404).json({ message: 'Campaign data not found' })
        }

        const targetCampaign = selectedCampaignItem.campaigns.find(
            (target) => target['Campaing ID'] === campaignId
        )

        if (!targetCampaign) {
            return res.status(404).json({ message: 'Campaign ID not found' })
        }

        if (parseInt(type) === 1) {
            console.log(targetCampaign[types[0]])
            result = targetCampaign[types[0]]
        } else if (parseInt(type) === 2) {
            console.log(targetCampaign[types[1]])
            result = targetCampaign[types[1]]
        } else if (parseInt(type) === 3) {
            console.log(targetCampaign[types[2]])
            result = targetCampaign[types[2]]
        }

        res.status(200).json({
            message: 'success',
            data: result,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

async function getUsersTargetByCampaignId(req, res) {
    try {

        const { campaignDataId, campaignId } = req.params
        let result = ''

        const data = fs.readFileSync(campaignDB, 'utf-8')
        const campaigns = data ? JSON.parse(data) : []

        const selectedCampaignItem = campaigns.find((campaignData) => campaignData.id === campaignDataId)

        if (!selectedCampaignItem) {
            return res.status(404).json({ message: 'Campaign data not found' })
        }

        const targetCampaign = selectedCampaignItem.campaigns.find(
            (target) => target['Campaing ID'] === campaignId
        )

        if (!targetCampaign) {
            return res.status(404).json({ message: 'Campaign ID not found' })
        }

        result = targetCampaign['Clientes impactados']
        console.log(campaignId, `Clientes Impactados ${result}`)

        res.status(200).json({
            message: 'success',
            data: result,
        })

    } catch (err) {
        console.error(err)
    }
}

// trigger
async function getUsersImpact(campaignDataId, campaignId) {
    try {

        let campaignData = []
        campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

        // Obtendo os customers da campanha
        const sqlQuery = query.usrs_by_campaign_id(campaignId)
        const queryResults = await queryExtId.executeBigQuery(String(sqlQuery))

        // Mapear customers como inteiros
        const customers = queryResults.map((result) => parseInt(result))

        const chunkSize = 10000
        const chunks = []

        for (let i = 0; i < customers.length; i += chunkSize) {
            chunks.push(customers.slice(i, i + chunkSize))
        }

        const selectedCampaignData = campaignData.find((campaign) => campaign.id === campaignDataId)
        const targetCampaign = selectedCampaignData.campaigns.find((target) => target['Campaing ID'] === campaignId)

        let depositsCount = 0

        const [dd, mm, yyyy] = targetCampaign['Data'].split("/")
        const startDate = `${yyyy}-${mm}-${dd} 19:00:00`
        const endDate = `${yyyy}-${mm}-${parseInt(dd) + 2} 19:00:00`

        const chunkResults = await Promise.all(chunks.map(async (chunk) => {

            const payload = {
                customers: chunk,
                start_date: startDate,
                end_date: endDate,
            };

            try {
                const response = await axios.post(depositBaseUrl, payload, {
                    headers: {
                        "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
                    },
                });

                const data = response.data;

                return data.reduce((acc, cv) => acc + (cv.deposits_count > 0 ? 1 : 0), 0);
            } catch (err) {
                console.error("Erro no processamento do chunk:", err.message);
                return 0; // Retorna 0 em caso de erro para evitar inconsistência.
            }
        }));
        depositsCount = chunkResults.reduce((acc, chunkCount) => acc + chunkCount, 0);
        targetCampaign['Clientes impactados'] = depositsCount
        fs.writeFileSync(campaignDB, JSON.stringify(campaignData, null, 2))
        console.log(`Clientes Impactados ${campaignId}: ${depositsCount}`)

    } catch (err) {
        console.error(err)
    }
}

async function getDepositsByRange(campaignDataId, campaignId, range) {
    try {

        let campaignData = []
        campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

        // Obtendo os customers da campanha
        const sqlQuery = query.usrs_by_campaign_id(campaignId)
        const queryResults = await queryExtId.executeBigQuery(sqlQuery)

        // Mapear customers como inteiros
        const customers = queryResults.map(result => parseInt(result))

        const chunkSize = 8000
        const chunks = []

        for (let i = 0; i < customers.length; i += chunkSize) {
            chunks.push(customers.slice(i, i + chunkSize))
        }

        const selectedCampaignData = campaignData.find((campaign) => campaign.id === campaignDataId)
        const targetCampaign = selectedCampaignData.campaigns.find((target) => target['Campaing ID'] === campaignId)

        let totalDeposit = 0

        const [dd, mm, yyyy] = targetCampaign['Data'].split("/")
        const startDate = `${yyyy}-${mm}-${dd} 19:00:00`
        const endDate = `${yyyy}-${mm}-${parseInt(dd) + range} 19:00:00`

        const chunkResults = await Promise.all(chunks.map(async (chunk) => {

            const payload = {
                customers: chunk,
                start_date: startDate,
                end_date: endDate,
            }

            return axios.post(depositBaseUrl, payload, {
                headers: {
                    "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
                },
            })
                .then(response => {
                    const data = response.data
                    const chunkDeposit = data.reduce((acc, cv) => acc + (cv.deposits_sum > 0 ? cv.deposits_sum : 0), 0)
                    return chunkDeposit
                })
                .catch(err => {
                    console.error("Erro no processamento do chunk:", err.message)
                    return 0
                })
        }))

        // Somar todos os depósitos dos chunks
        totalDeposit = chunkResults.reduce((acc, deposit) => acc + deposit, 0)

        // Atualizar o valor correto dependendo do range
        if (parseInt(range) === 1) {
            targetCampaign[types[0]] = totalDeposit
        } else if (parseInt(range) === 2) {
            targetCampaign[types[1]] = totalDeposit
        } else if (parseInt(range) === 7) {
            targetCampaign[types[2]] = totalDeposit
        }

        fs.writeFileSync(campaignDB, JSON.stringify(campaignData, null, 2))
        console.log(`${campaignDataId}:${campaignId} | R$ ${totalDeposit}`)

    } catch (err) {
        console.error("Erro ao processar requisição:", err.message)
    }
}

async function getMailsByCampaignId(campaignDataId, campaignId, factTypeId) {

    let campaignData = []
    campaignData = JSON.parse(fs.readFileSync(campaignDB, 'utf-8'))

    const sqlQuery = query.mails_by_campaign_id(campaignId, factTypeId)
    const queryResults = await queryExtId.getTotalItems(sqlQuery)
    const totalMails = queryResults?.total

    const selectedCampaignData = campaignData.find((campaign) => campaign.id === campaignDataId)
    const targetCampaign = selectedCampaignData.campaigns.find((target) => target['Campaing ID'] === campaignId)

    if (factTypeId === 2) {
        targetCampaign['Enviados'] = totalMails
    } else if (factTypeId === 4) {
        targetCampaign['Clicados'] = totalMails
    }

    fs.writeFileSync(campaignDB, JSON.stringify(campaignData, null, 2))
    console.log(factTypeId === 1 ? `${campaignDataId}:${campaignId} - Emails Enviados: ${totalMails}` : `${campaignDataId}:${campaignId} - Emails Clicados: ${totalMails}`)

}

export default {
    getDepositByDate,
    getDepositByCampaignId,
    getUsersTarget,
    getUsersTargetByCampaignId,
    getUsersImpact,
    getDepositsByRange,
    getMailsByCampaignId
}

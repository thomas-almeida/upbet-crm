import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')
const baseUrl = 'https://api.originals.upbet.dev/sportingtech/transactions/balance'
const signature = 'add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f'

async function getDepositsToday(req, res) {

    const { dashId } = req.body

    let dashData = JSON.parse(fs.readFileSync(dashDB, "utf8"))
    const targetDashData = dashData.find((dash) => dash?.id === dashId)

    console.log(dashId)

    if (!targetDashData) {
        console.error(`Dashboard com ID ${dashId} não encontrado.`)
        return
    }

    const date = new Date()
    const formatDatePart = (part) => (part < 10 ? `0${part}` : part)
    const todayDate = `${date.getFullYear()}-${formatDatePart(date.getMonth() + 1)}-${formatDatePart(date.getDate())}`
    const todayStartDate = `${todayDate} 00:00:00`
    const todayEndDate = `${todayDate} 23:59:59`

    try {

        const response = await axios.get(`${baseUrl}?start_date=${todayStartDate}&end_date=${todayEndDate}`, {
            headers: {
                "x-signature": signature,
                "Content-Type": "application/json",
            },
        })

        const transactions = response.data

        const obj = {
            date: todayDate,
            deposits_count: transactions?.deposits_count || 0,
            deposits_sum: transactions?.deposits_sum || 0,
            withdraws_count: transactions?.withdraws_count || 0,
            withdraws_sum: transactions?.withdraws_sum || 0,
        }

        const existingIndex = targetDashData.results.findIndex((entry) => entry.date === todayDate)

        if (existingIndex !== -1) {
            targetDashData.results[existingIndex] = obj
        } else {
            targetDashData.results.push(obj)
        }

        res.status(200).json({
            message: 'success',
            data: obj
        })

        fs.writeFileSync(dashDB, JSON.stringify(dashData, null, 2))
        console.log(`Dados de ${todayDate} atualizados com sucesso.`)
    } catch (error) {
        console.error("Erro ao buscar ou atualizar os dados:", error.message)
    }
}


export default {
    getDepositsToday
}
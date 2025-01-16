import axios from 'axios'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dashDB = path.join(__dirname, '..', 'db', 'dash-data.json')
const baseUrl = 'https://api.originals.upsports.app:3000/sportingtech/transactions/balance'
const signature = 'add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f'

function getDaysInMonth(month, year) {

    let date = new Date(year, month, 1)
    let days = []
    while (date.getMonth() === month) {
        days.push(date.toISOString().split('T')[0])
        date.setDate(date.getDate() + 1)
    }

    return days
}

function isDecimal(value) {
    if (value < 10) {
        return `0${value}`
    }
}

async function getDepositsInADay(dashId) {

    let dashData = []
    dashData = JSON.parse(fs.readFileSync(dashDB))

    const targetDashData = dashData.find((dash) => dash?.id === dashId)
    const dayList = getDaysInMonth(0, 2025)

    for (const day of dayList) {

        const startDate = `${day} 00:00:00`
        const endDate = `${day} 23:59:59`

        const response = await axios.get(`${baseUrl}?start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                'x-signature': signature,
                'Content-Type': 'application/json'
            }
        })

        let transactions = response.data

        let obj = {
            date: day,
            deposits_count: transactions?.deposits_count,
            deposits_sum: transactions?.deposits_sum,
            withdraws_count: transactions?.withdraws_count,
            withdraws_sum: transactions?.withdraws_sum,
        }

        targetDashData?.results?.push(obj)
    }

    fs.writeFileSync(dashDB, JSON.stringify(dashData, null, 2))
}


async function getDepositsToday(dashId) {

    let dashData = JSON.parse(fs.readFileSync(dashDB, "utf8"))
    const targetDashData = dashData.find((dash) => dash?.id === dashId)

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

        fs.writeFileSync(dashDB, JSON.stringify(dashData, null, 2))
        console.log(`Dados de ${todayDate} atualizados com sucesso.`)
    } catch (error) {
        console.error("Erro ao buscar ou atualizar os dados:", error.message)
    }
}



getDepositsToday("hejtxd982")
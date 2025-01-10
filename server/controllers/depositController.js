import idGenerator from "../utils/idGenerator.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const depositsDB = path.join(__dirname, '..', 'db', 'deposits-data.json')
const withdrawsDB = path.join(__dirname, '..', 'db', 'withdraws-data.json')

let deposits = []
let withdraws = []

async function getDepositsByCurrentMonth(req, res) {
    try {

        const { start_date, end_date } = req.params

        const getDepositUrl = `https://api.originals.upsports.app:3000/sportingtech/transactions/balance?start_date=${start_date}&end_date=${end_date}`
        const data = fs.readFileSync(depositsDB, 'utf-8')
        deposits = data ? JSON.parse(data) : []

        const response = await axios.get(getDepositUrl, {
            headers: {
                "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
            },
        })

        const currentDate = new Date
        const currentReferenceMonth = `${currentDate.getUTCMonth()}/${currentDate.getFullYear()}`
        const depositItemExist = deposits.some((depositItem) => depositItem.referenceMonth === currentReferenceMonth)

        const depositObject = {
            id: idGenerator.generateExtensiveId(deposits),
            referenceMonth: currentReferenceMonth,
            depositsCount: response.data.deposits_count,
            depositsSum: response.data.deposits_sum,
        }

        if (depositItemExist) {

            let currentDepositItem = deposits.find((depositItem) => depositItem.referenceMonth === currentReferenceMonth)
            currentDepositItem.depositsCount = response.data.deposits_count
            currentDepositItem.depositsSum = response.data.deposits_sum

            console.log(deposits)


            res.status(200).json({
                message: 'success',
                data: {
                    depoistsCount: response.data.deposits_count,
                    depoistsSum: response.data.deposits_sum,
                }
            })

            fs.writeFileSync(depositsDB, JSON.stringify(deposits, null, 2))
            console.log(`Depositos de ${referenceMonth} atualizados com sucesso`)
            return
        }

        deposits.push(depositObject)

        res.status(200).json({
            message: 'success',
            data: {
                depoistsCount: response.data.deposits_count,
                depoistsSum: response.data.deposits_sum,
            }
        })

        fs.writeFileSync(depositsDB, JSON.stringify(deposits, null, 2))

    } catch (err) {
        console.error(err)
    }
}

async function getWhitdrawsByCurrentMonth(req, res) {
    try {

        const { start_date, end_date } = req.params

        const getDepositUrl = `https://api.originals.upsports.app:3000/sportingtech/transactions/balance?start_date=${start_date}&end_date=${end_date}`
        const data = fs.readFileSync(withdrawsDB, 'utf-8')
        withdraws = data ? JSON.parse(data) : []

        const response = await axios.get(getDepositUrl, {
            headers: {
                "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
            },
        })

        const currentDate = new Date
        const currentReferenceMonth = `${currentDate.getUTCMonth()}/${currentDate.getFullYear()}`
        const withdrawItemItemExist = withdraws.some((withdrawItem) => withdrawItem.referenceMonth === currentReferenceMonth)

        const withdrawObject = {
            id: idGenerator.generateExtensiveId(deposits),
            referenceMonth: currentReferenceMonth,
            withdrawsItemCount: response.data.withdraws_count,
            withdrawsItemSum: response.data.withdraws_sum,
        }

        if (withdrawItemItemExist) {

            let currentwithdrawItem = withdraws.find((depositItem) => depositItem.referenceMonth === currentReferenceMonth)
            currentwithdrawItem.withdrawCount = response.data.withdraws_count
            currentwithdrawItem.withdrawsum = response.data.withdraws_sum

            console.log(withdraws)


            res.status(200).json({
                message: 'success',
                data: {
                    withdrawsCount: response.data.withdraws_count,
                    withdrawsSum: response.data.withdraws_sum,
                }
            })

            fs.writeFileSync(withdrawsDB, JSON.stringify(withdraws, null, 2))
            console.log(`Depositos de ${referenceMonth} atualizados com sucesso`)
            return
        }

        deposits.push(withdrawObject)

        res.status(200).json({
            message: 'success',
            data: {
                withdrawsCount: response.data.withdraws_count,
                withdrawsSum: response.data.withdraws_sum,
            }
        })

        fs.writeFileSync(withdrawsDB, JSON.stringify(withdraws, null, 2))

    } catch (err) {
        console.error(err)
    }
}


export default {
    getDepositsByCurrentMonth,
    getWhitdrawsByCurrentMonth
}
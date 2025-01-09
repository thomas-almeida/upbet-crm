import idGenerator from "../utils/idGenerator.js"
import fs from 'fs'
import path from "path"
import { fileURLToPath } from "url"
import axios from 'axios'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const depositsDB = path.join(__dirname, '..', 'db', 'deposits-data.json')
const withdrawalsDB = path.join(__dirname, '..', 'db', 'withdrawals-data.json')

let deposits = []
let withdrawals = []

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

async function getWhitdrawalsByCurrentMonth(req, res) {
    try {

        const { start_date, end_date } = req.params

        const getDepositUrl = `https://api.originals.upsports.app:3000/sportingtech/transactions/balance?start_date=${start_date}&end_date=${end_date}`
        const data = fs.readFileSync(withdrawalsDB, 'utf-8')
        withdrawals = data ? JSON.parse(data) : []

        const response = await axios.get(getDepositUrl, {
            headers: {
                "x-signature": "add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f",
            },
        })

        const currentDate = new Date
        const currentReferenceMonth = `${currentDate.getUTCMonth()}/${currentDate.getFullYear()}`
        const withdrawalItemItemExist = withdrawals.some((withdrawalItem) => withdrawalItem.referenceMonth === currentReferenceMonth)

        const withdrawalObject = {
            id: idGenerator.generateExtensiveId(deposits),
            referenceMonth: currentReferenceMonth,
            withdrawalsItemCount: response.data.withdrawals_count,
            withdrawalsItemSum: response.data.withdrawals_sum,
        }

        if (withdrawalItemItemExist) {

            let currentwithdrawalItem = withdrawals.find((depositItem) => depositItem.referenceMonth === currentReferenceMonth)
            currentwithdrawalItem.withdrawalCount = response.data.withdrawals_count
            currentwithdrawalItem.withdrawalSum = response.data.withdrawals_sum

            console.log(withdrawals)


            res.status(200).json({
                message: 'success',
                data: {
                    withdrawalsCount: response.data.withdrawals_count,
                    withdrawalsSum: response.data.withdrawals_sum,
                }
            })

            fs.writeFileSync(withdrawalsDB, JSON.stringify(withdrawals, null, 2))
            console.log(`Depositos de ${referenceMonth} atualizados com sucesso`)
            return
        }

        deposits.push(withdrawalObject)

        res.status(200).json({
            message: 'success',
            data: {
                withdrawalsCount: response.data.withdrawals_count,
                withdrawalsSum: response.data.withdrawals_sum,
            }
        })

        fs.writeFileSync(withdrawalsDB, JSON.stringify(withdrawals, null, 2))

    } catch (err) {
        console.error(err)
    }
}


export default {
    getDepositsByCurrentMonth,
    getWhitdrawalsByCurrentMonth
}
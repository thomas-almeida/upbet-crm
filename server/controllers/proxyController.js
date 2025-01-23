import axios from 'axios'

const upsportsKey = 'add2aea4982a6bca11794494a8c6d2057045787400dde7135b9d4d6f'
const upsportsBaseUrl = 'https://api.originals.upbet.dev/sportingtech'

async function proxyTransactionsBalance(req, res) {
    const { start_date, end_date } = req.query

    try {
        const response = await axios.get(`${upsportsBaseUrl}/transactions/balance`, {
            params: {
                start_date,
                end_date,
            },
            headers: {
                'x-signature': upsportsKey,
            },
        })

        res.json(response.data)
    } catch (error) {
        console.error('Erro ao consultar a API:', error.response?.data || error.message)

        res.status(error.response?.status || 500).json({
            message: error.response?.data || 'Erro no proxy',
        })
    }
}

export default {
    proxyTransactionsBalance,
}

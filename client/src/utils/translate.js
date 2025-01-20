
const transactionsTerms = [
    {
        name: "deposits_sum",
        translate: "Depósitos"
    },
    {
        name: "withdraws_sum",
        translate: "Saques"
    },
    {
        name: "target_users",
        translate: "Usuários Alvo"
    },
    {
        name: "converted_users",
        translate: "Usuários Convertidos"
    }
]

function translateItem(value) {
    const term = transactionsTerms.find((term) => value === term.name)
    return term ? term.translate : value // Retorna a tradução ou o valor original
}

function translateNumbers(value) {
    if (!value) return "0"
    return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 0 })
}

// Função para traduzir e formatar datas
function translateDates(dateString) {

    if (!dateString) return "Data Inválida"

    try {

        if (dateString.includes("-")) {
            const splitedDate = dateString.split("-")
            return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
        } else {

            return dateString
        }

    } catch (error) {
        return "Data Inválida"
    }
}


export default {
    translateItem,
    translateNumbers,
    translateDates
}
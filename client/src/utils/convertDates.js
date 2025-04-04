function formatDate (date) {
    let dateArr = date.split("-")
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0].substring(2)}`      
}

function formatDateConventional(date) {
    let splitedDate = date.split("-")
    console.log(`${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`)
    return `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
}

function isDecimal(value) {
    return value <= 9 ? `0${value}` : value
}

export default {
    formatDate,
    formatDateConventional,
    isDecimal
}
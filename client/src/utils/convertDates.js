function formatDate (date) {
    let dateArr = date.split("-")
    return `${dateArr[2]}/${dateArr[1]}/${dateArr[0].substring(2)}`      
}

export default {
    formatDate
}
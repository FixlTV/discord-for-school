module.exports = function(date) {
    date = new Date(date || Date.now())
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + 4 - (date.getDay()||7))
    let yearStart = new Date(Date.UTC(date.getFullYear(),0,1))
    return Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7)
}
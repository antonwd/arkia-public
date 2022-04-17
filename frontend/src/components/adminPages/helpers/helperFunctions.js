export function getVisibleTo (word) {
    const visability = {
        "purser": "כלכלים",
        "ca3": "דיילים",
        "trainer": "מדריכים",
        "inspector": "בוחנים",
        "training": "מחלקת הדרכה",
    }

    return visability.hasOwnProperty(word) ? visability[word] : word
}

export function formatDate(dateString, short = false) {
    const givenDate = new Date(dateString)
    const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
    
    let year = givenDate.getFullYear()
    let month = short ? givenDate.getMonth() + 1 : months[givenDate.getMonth()]
    let day = givenDate.getDay()

    let result = short ? day + "/" + month + "/" + year : day + " ב" + month + ", " + year;

    return result;
}
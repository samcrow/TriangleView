
function Document(notes, years) {
    this.notes = notes || '';
    this.years = years || Document.defaultYears();
}

Document.defaultYears = function() {

    let thisYear = new Date().getFullYear();

    return [
        {
            year: thisYear - 2,
            triangle: new Triangle(),
        },
        {
            year: thisYear - 1,
            triangle: new Triangle(),
        },
        {
            year: thisYear,
            triangle: new Triangle(),
        },
    ]
}

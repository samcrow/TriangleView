
/**
 * Access to the user interface
 */
function Ui(context) {
    // Get elements

    // Notes and year selection
    this.generalForm = context.getElementById('generalForm');
    // Year-specific form
    this.yearForm = context.getElementById('yearForm');

    this.notesField = context.getElementById('notesField');
    this.graphics = new Graphics(context.getElementById('graphics-svg'));
    this.activeYear1 = context.getElementById('activeYear1');
    this.activeYear2 = context.getElementById('activeYear2');
    this.activeYear3 = context.getElementById('activeYear3');
    this.activeYear1Field = context.getElementById('activeYear1Field');
    this.activeYear2Field = context.getElementById('activeYear2Field');
    this.activeYear3Field = context.getElementById('activeYear3Field');
    this.openButton = context.getElementById('openButton');
    this.saveButton = context.getElementById('saveButton');

    // If any unsaved changes have been made
    this.dirty = false;

    this.yearForms = {
        ab: {
            contact: context.getElementById('selectAbContact'),
            conflict: context.getElementById('selectAbConflict'),
            distance: context.getElementById('selectAbDistance'),
            polarization: context.getElementById('selectAbPolarization'),
            polarizationDirection: context.getElementById('selectAbPolarizationDirection'),
        },
        bc: {
            contact: context.getElementById('selectBcContact'),
            conflict: context.getElementById('selectBcConflict'),
            distance: context.getElementById('selectBcDistance'),
            polarization: context.getElementById('selectBcPolarization'),
            polarizationDirection: context.getElementById('selectBcPolarizationDirection'),
        },
        ca: {
            contact: context.getElementById('selectCaContact'),
            conflict: context.getElementById('selectCaConflict'),
            distance: context.getElementById('selectCaDistance'),
            polarization: context.getElementById('selectCaPolarization'),
            polarizationDirection: context.getElementById('selectCaPolarizationDirection'),
        },
    };

    let ui = this;

    // Respond to changes in the general form
    this.generalForm.onchange = function() {
        ui.dirty = true;

        // Update document from form
        ui.document.notes = ui.notesField.value;
        ui.document.years[0].year = ui.activeYear1Field.value;
        ui.document.years[1].year = ui.activeYear2Field.value;
        ui.document.years[2].year = ui.activeYear3Field.value;

        // Show selected year, and fill in form for active year
        if (ui.activeYear1.checked) {
            ui.graphics.setTriangle(ui.document.years[0].triangle);
            ui.updateFormForYear(ui.document.years[0].triangle);
        } else if (ui.activeYear2.checked) {
            ui.graphics.setTriangle(ui.document.years[1].triangle);
            ui.updateFormForYear(ui.document.years[1].triangle);
        } else if (ui.activeYear3.checked) {
            ui.graphics.setTriangle(ui.document.years[2].triangle);
            ui.updateFormForYear(ui.document.years[2].triangle);
        }
    };

    // Respond to changes in the year-specific form
    this.yearForm.onchange = function() {
        ui.dirty = true;

        if (ui.activeYear1.checked) {
            ui.updateYear(ui.document.years[0]);
            ui.graphics.setTriangle(ui.document.years[0].triangle);
        } else if (ui.activeYear2.checked) {
            ui.updateYear(ui.document.years[1]);
            ui.graphics.setTriangle(ui.document.years[1].triangle);
        } else if (ui.activeYear3.checked) {
            ui.updateYear(ui.document.years[2]);
            ui.graphics.setTriangle(ui.document.years[2].triangle);
        }
        console.log(ui.document);
    }

    // Reads values from this.yearForm and updates year
    this.updateYear = function(year) {
        // A-B
        this.updateInteractions(year.triangle.ab, this.yearForms.ab);
        // B-C
        this.updateInteractions(year.triangle.bc, this.yearForms.bc);
        // C-A
        this.updateInteractions(year.triangle.ca, this.yearForms.ca);
    };

    this.updateInteractions = function(triangleInteraction, formInteraction) {
        triangleInteraction.contact = Number(formInteraction.contact.value);
        triangleInteraction.conflict = Number(formInteraction.conflict.value);
        triangleInteraction.distance = Number(formInteraction.distance.value);
        triangleInteraction.polarization = Number(formInteraction.polarization.value);

        let direction = formInteraction.polarizationDirection.value;
        if (direction == 'to_first') {
            triangleInteraction.polarizationDirection = Connections.DIRECTION.TO_FIRST;
        } else if (direction == 'to_second') {
            triangleInteraction.polarizationDirection = Connections.DIRECTION.TO_SECOND;
        } else {
            triangleInteraction.polarizationDirection = Connections.DIRECTION.NONE;
        }
    }
    // Updates this.yearForm with values from a triangle
    this.updateFormForYear = function(triangle) {
        this.updateInteractionsForYear(triangle.ab, this.yearForms.ab);
        this.updateInteractionsForYear(triangle.bc, this.yearForms.bc);
        this.updateInteractionsForYear(triangle.ca, this.yearForms.ca);
    }
    this.updateInteractionsForYear = function(triangleInteraction, formInteraction) {
        formInteraction.contact.value = triangleInteraction.contact;
        formInteraction.conflict.value = triangleInteraction.conflict;
        formInteraction.distance.value = triangleInteraction.distance;
        formInteraction.polarization.value = triangleInteraction.polarization;

        let direction = triangleInteraction.polarizationDirection;
        if (direction == Connections.DIRECTION.TO_FIRST) {
            formInteraction.polarizationDirection.value = 'to_first';
        } else if (direction == Connections.DIRECTION.TO_SECOND) {
            formInteraction.polarizationDirection.value = 'to_second';
        } else {
            formInteraction.polarizationDirection.value = 'none';
        }
    }

    this.openButton.onclick = function() {
        let fileInput = document.createElement('input');
        fileInput.type = 'file';

        fileInput.onchange = function() {
            let file = fileInput.files[0];

            // Read the file
            let reader = new FileReader()
            reader.onload = function() {
                try {
                    let json = JSON.parse(reader.result);

                    // Assign prototypes
                    let newDocument = json;
                    newDocument.prototype = Document.prototype;
                    for (let year of newDocument.years) {
                        year.triangle.prototype = Triangle.prototype;
                        for (let connections of [year.triangle.ab, year.triangle.bc, year.triangle.ca]) {
                            connections.prototype = Connections.prototype;
                        }
                    }
                    ui.showDocument(newDocument);

                } catch (e) {
                    alert(e);
                }
            };
            reader.readAsText(file);
        };

        fileInput.click();
    }

    this.saveButton.onclick = function() {
        let document = ui.getDocument();
        let json = JSON.stringify(document, null, 2);
        let dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);

        let anchor = window.document.createElement('a');
        anchor.href = dataUrl;
        anchor.download = 'TriangleView.json';
        anchor.click();
    }

    // Open the default document
    this.showDocument(new Document())
}

Ui.prototype.showDocument = function(document) {
    console.log(document);
    this.document = document;

    this.notesField.value = document.notes;
    this.activeYear1Field.value = document.years[0].year;
    this.activeYear2Field.value = document.years[1].year;
    this.activeYear3Field.value = document.years[2].year;

    // Select year 1 and display it
    this.activeYear1.checked = true;
    this.graphics.setTriangle(document.years[0].triangle);
}

Ui.prototype.getDocument = function() {
    // Update from UI
    this.document.notes = this.notesField.value
    console.log(this.notesField.value)

    return this.document;
}

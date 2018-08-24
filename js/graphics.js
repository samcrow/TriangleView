
/**
 * An interface to the SVG graphics used to draw the triangle
 *
 * @param svg an SVG element containing the graphical elements
 */
function Graphics(svg) {
    this.svg = svg;
    this.names = {
        a: svg.querySelector('#name-a tspan'),
        b: svg.querySelector('#name-b tspan'),
        c: svg.querySelector('#name-c tspan'),
    };
    this.connections = {
        ab: {
            contact: svg.getElementById('conn-ab-contact'),
            conflict: svg.getElementById('conn-ab-conflict'),
            distance: svg.getElementById('conn-ab-distance'),
            polarization: svg.getElementById('conn-ab-polarization'),
            polarizationArrowheads: {
                toFirst: svg.getElementById('conn-ab-polarization-to-a'),
                toSecond: svg.getElementById('conn-ab-polarization-to-b')
            },
        },
        bc: {
            contact: svg.getElementById('conn-bc-contact'),
            conflict: svg.getElementById('conn-bc-conflict'),
            distance: svg.getElementById('conn-bc-distance'),
            polarization: svg.getElementById('conn-bc-polarization'),
            polarizationArrowheads: {
                toFirst: svg.getElementById('conn-bc-polarization-to-b'),
                toSecond: svg.getElementById('conn-bc-polarization-to-c')
            },
        },
        ca: {
            contact: svg.getElementById('conn-ca-contact'),
            conflict: svg.getElementById('conn-ca-conflict'),
            distance: svg.getElementById('conn-ca-distance'),
            polarization: svg.getElementById('conn-ca-polarization'),
            polarizationArrowheads: {
                toFirst: svg.getElementById('conn-ca-polarization-to-c'),
                toSecond: svg.getElementById('conn-ca-polarization-to-a')
            },
        },
    };
}

Graphics.prototype.setNameA = function(name) {
    this.names.a.textContent = name;
}
Graphics.prototype.setNameB = function(name) {
    this.names.b.textContent = name;
}
Graphics.prototype.setNameC = function(name) {
    this.names.c.textContent = name;
}

/**
 * @param triangle a Triangle object
 */
Graphics.prototype.setTriangle = function(triangle) {
    Graphics.setConnections(this.connections.ab, triangle.ab)
    Graphics.setConnections(this.connections.bc, triangle.bc)
    Graphics.setConnections(this.connections.ca, triangle.ca)
}

Graphics.setConnections = function(connectionElements, connections) {
    connectionElements.contact.style.stroke = Graphics.intensityToColor(connections.contact);
    connectionElements.conflict.style.stroke = Graphics.intensityToColor(connections.conflict);
    connectionElements.distance.style.stroke = Graphics.intensityToColor(connections.distance);

    let polarizationColor = Graphics.intensityToColor(connections.polarization);
    connectionElements.polarization.style.stroke = polarizationColor;
    connectionElements.polarizationArrowheads.toFirst.style.stroke = polarizationColor;
    connectionElements.polarizationArrowheads.toFirst.style.fill = polarizationColor;
    connectionElements.polarizationArrowheads.toSecond.style.stroke = polarizationColor;
    connectionElements.polarizationArrowheads.toSecond.style.fill = polarizationColor;

    switch (connections.polarizationDirection) {
    case Connections.DIRECTION.NONE:
        connectionElements.polarizationArrowheads.toFirst.style.visibility = 'hidden';
        connectionElements.polarizationArrowheads.toSecond.style.visibility = 'hidden';
        break;
    case Connections.DIRECTION.TO_FIRST:
        connectionElements.polarizationArrowheads.toFirst.style.visibility = '';
        connectionElements.polarizationArrowheads.toSecond.style.visibility = 'hidden';
        break;
    case Connections.DIRECTION.TO_SECOND:
        connectionElements.polarizationArrowheads.toFirst.style.visibility = 'hidden';
        connectionElements.polarizationArrowheads.toSecond.style.visibility = '';
        break;
    }
}

Graphics.intensityToColor = function(intensity) {
    switch (intensity) {
    case 1:
        return 'blue';
    case 2:
        return 'yellow';
    case 3:
        return 'orange';
    case 4:
        return 'red';
    default:
        throw 'Invalid intensity'
    }
}

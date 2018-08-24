
function Connections(year, contact, conflict, distance, polarization, polarizationDirection) {
    this.year = year || 0;
    this.contact = contact || 1;
    this.conflict = conflict || 1;
    this.distance = distance || 1;
    this.polarization = polarization || 1;
    this.polarizationDirection = polarizationDirection || Connections.DIRECTION.NONE;
}

/** Polarization direction values */
Connections.DIRECTION = Object.freeze({
    NONE: "none",
    TO_FIRST: "to_first",
    TO_SECOND: "to_second",
});

/**
 * Triangle prototype
 *
 * A triangle contains the state needed to show a visualization
 */
function Triangle(ab, bc, ca) {
    this.ab = ab || new Connections();
    this.bc = bc || new Connections();
    this.ca = ca || new Connections();
}

const colors = Object.freeze({
    white: "white",
    black: "black",
    a: "#2EC0F9",
    b: "#67597A",
    c: "#F97068",
    d: "#D1D646",
    e: "#23CE6B"
} as const);

export const enum Cell {
    Disabled = 0,
    Enabled = 1,
    A = 2,
    B = 3,
    C = 4,
    D = 5,
    E = 6
}

const maxCell = Cell.E;

const cellColorMap: { [key in Cell]: string } = {
    [Cell.Disabled]: colors.white,
    [Cell.Enabled]: colors.black,
    [Cell.A]: colors.a,
    [Cell.B]: colors.b,
    [Cell.C]: colors.c,
    [Cell.D]: colors.d,
    [Cell.E]: colors.e
};

export function cellToColor(cell: Cell): string {
    return cellColorMap[cell];
}

/**
 * If a cell isn't disabled, disable it;
 * otherwise, enable it.
 */
export function flipCell(cell: Cell) {
    if (cell == Cell.Disabled) {
        return Cell.Enabled;
    }

    return Cell.Disabled;
}

/** Cycles the color of a cell - if it's not a color, make it the first one. */
export function cycleColor(cell: Cell, reverse = false) {
    if (cell < Cell.A) return Cell.A;
    if (cell == maxCell && !reverse) return Cell.A;
    if (cell == Cell.A && reverse) return maxCell;

    return cell + (reverse ? -1 : 1);
}

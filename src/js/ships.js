export default class Ship {
    static shipsAndSize = {
        Carrier: 5,
        Battleship: 4,
        Cruiser: 3,
        Submarine: 3,
        Destroyer: 2,
    };

    constructor(type) {
        this.type = type;
        this.length = Ship.shipsAndSize[type];
        this.hits = 0;
        this.sunk = false;
    }

    hit() {
        this.hits++;
        this.isSunk();
    }

    isSunk() {
        this.sunk = this.length === this.hits;
    }
}

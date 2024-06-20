class Ship {
    constructor(length) {
        this.length = length;
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

export default Ship;

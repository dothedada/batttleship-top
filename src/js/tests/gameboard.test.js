import Gameboard from '../gameboard';
const board = new Gameboard();

const shipCells = (arr = [], ship = undefined) => {
    return arr.reduce((sum, current) => {
        if (Array.isArray(current)) {
            sum = shipCells(current);
            return sum;
        }

        if (ship && ship === current) {
            sum++;
            return sum;
        }

        if (current) sum++;
        return sum;
    });
};

describe('Evaluación del tablero', () => {
    test('El tablero es un array 2D de 10x10', () => {
        expect(Array.isArray(board.table)).toBe(true);
        expect(Array.isArray(board.table.length)).toBe(10);
        expect(Array.isArray(board.table[9])).toBe(true);
        expect(Array.isArray(board.table[9].length)).toBe(10);
    });

    test('Todos los campos están inicializados con false', () => {
        expect(
            board.table.every((box) => box[0] === false && box[1] === false),
        ).toBe(true);
    });
});

describe('Administración y posicionamiento de barcos', () => {
    test('Ubica un barco verticalmente dentro del tablero', () => {
        expect(board.palceShip(0, 2, false, 'Carrier')).toBe(true);
        for (let i = 0; i < 5; i++) {
            expect(board.table[i][2]).toBe('K');
        }
    });

    test('Sólo son marcadas las celdas ocupadas por el barco', () => {
        expect(shipCells(board.table, 'K')).toBe(5);
    });

    test('Ubica un barco horizontalmente dentro del tablero', () => {
        expect(board.palceShip(7, 0, true, 'Battleship')).toBe(true);
        for (let i = 0; i < 4; i++) {
            expect(board.table[7][i]).toBe('B');
        }
    });

    test('Mantiene el inventario de los barcos ubicados', () => {
        expect(board.shipsLeft()).toBe(3);
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, mismo sentido', () => {
        expect(board.palceShip(4, 2, false, 'Cruiser')).toThrow(
            new Error('No se puede ubicar un barco donde ya existe otro'),
        );
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, sentido contrario', () => {
        expect(board.palceShip(2, 1, true, 'Cruiser')).toThrow(
            new Error('No se puede ubicar un barco donde ya existe otro'),
        );
    });

    test('La ubicación de un barco horizontal nunca excede el límite', () => {
        expect(board.palceShip(9, 6, false, 'Cruiser')).toBe(true);
        for (let i = 7; i < 10; i++) {
            expect(board.table[i][6]).toBe('C');
        }
    });

    test('La ubicación de un barco vertical nunca excede el límite', () => {
        expect(board.palceShip(9, 6, true, 'Submarine')).toBe(true);
        for (let i = 7; i < 10; i++) {
            expect(board.table[4][i]).toBe('S');
        }
    });

    test('Mantiene el inventario de los barcos ubicados 2', () => {
        expect(board.shipsLeft()).toBe(1);
    });

    test('ubica aleatoriamente un barco', () => {
        expect(placeShipRandom('Destroyer')).toBe(true);
        expect(shipCells(board.table, 'D')).toBe(2);
    });

    test('Las celdas del barco ubicado aleatoriamente son continuas', () => {
        const flatBoard = board.table.flat();
        const differenceOfIndexes =
            flatBoard.lastIndexOf('D') - flatBoard.findIndex('D');

        expect([1,10]).toContain(differenceOfIndexes);
    });

    test('Sólo son marcadas las celdas ocupadas por kos barcos 2', () => {
        expect(shipCells(board.table)).toBe(17);
    });
});

describe('Elementos del juego', () => {
    test('Marca en el disparo en una celda desocupada', () => {
        //
    });

    test('Marca el disparo en una celda ocupada', () => {
        //
    });

    test('Cuando el disparo da en un bote, se actualiza el estado de este', () => {
        //
    });

    test('Reporta el hundimiento de un bote', () => {
        //
    });

    test('avisa cuando ya no le quedan barcos en este tablero', () => {
        //
    });
    //
});

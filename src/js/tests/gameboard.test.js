import Gameboard from '../gameboard';
const board = new Gameboard();

const shipCells = (arr = [], ship = undefined) => {
    const array = arr.flat();
    if (ship) {
        return array.filter((e) => e.type === ship).length;
    } else {
        return array.filter((e) => !e).length;
    }
};

describe('Evaluación del tablero', () => {
    test('El tablero es un array 2D de 10x10', () => {
        expect(Array.isArray(board.ships)).toBe(true);
        expect(board.ships.length).toBe(10);
        expect(Array.isArray(board.ships[9])).toBe(true);
        expect(board.ships[9].length).toBe(10);
    });

    test('Todos los campos están inicializados con false', () => {
        expect(shipCells(board.ships, true)).toBe(0);
    });
});

describe('Administración y posicionamiento de barcos', () => {
    test('Ubica un barco horizontalmente dentro del tablero', () => {
        expect(board.placeShip(0, 2, false, 'Carrier')).toBe(true);
        for (let i = 0; i < 5; i++) {
            expect(board.ships[2][i].type).toBe('Carrier');
        }
    });

    test('Sólo son marcadas las celdas ocupadas por el barco', () => {
        expect(shipCells(board.ships, 'Carrier')).toBe(5);
    });

    test('Ubica un barco verticalmente dentro del tablero', () => {
        expect(board.placeShip(7, 0, true, 'Battleship')).toBe(true);
        for (let i = 0; i < 4; i++) {
            expect(board.ships[i][7].type).toBe('Battleship');
        }
    });

    test('Mantiene el inventario de los barcos ubicados', () => {
        expect(board.shipsLeft()).toBe(3);
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, mismo sentido', () => {
        expect(board.placeShip(4, 2, false, 'Cruiser')).toBe(false);
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, sentido contrario', () => {
        expect(board.placeShip(2, 1, true, 'Cruiser')).toBe(false);
    });

    test('La ubicación de un barco horizontal nunca excede el límite', () => {
        expect(board.placeShip(9, 6, false, 'Cruiser')).toBe(true);
        for (let i = 7; i < 10; i++) {
            expect(board.ships[6][i].type).toBe('Cruiser');
        }
    });

    test('La ubicación de un barco vertical nunca excede el límite', () => {
        expect(board.placeShip(4, 9, true, 'Submarine')).toBe(true);
        for (let i = 7; i < 10; i++) {
            expect(board.ships[i][4].type).toBe('Submarine');
        }
    });

    test('Mantiene el inventario de los barcos ubicados 2', () => {
        expect(board.shipsLeft()).toBe(1);
    });

    test('ubica aleatoriamente un barco', () => {
        expect(board.placeShipRandom('Destroyer')).toBe(true);
        expect(shipCells(board.ships, 'Destroyer')).toBe(2);
    });

    test('Las celdas del barco ubicado aleatoriamente son continuas', () => {
        const flatBoard = board.ships.flat();
        const differenceOfIndexes =
            99 -
            flatBoard
                .slice()
                .reverse()
                .findIndex((e) => e.type === 'Destroyer') -
            flatBoard.findIndex((e) => e.type === 'Destroyer');

        expect([1, 10]).toContain(differenceOfIndexes);
    });

    test('Sólo son marcadas las celdas ocupadas por kos barcos 2', () => {
        expect(shipCells(board.ships)).toBe(83);
    });
});

describe('Elementos del juego', () => {
    test('Marca en el disparo en una celda desocupada', () => {
        expect(board.receiveAttack(4, 0)).toBe(true);
        console.table(board.ships);
        expect(board.ships[0][4]).toBe('·');
    });
    //
    // test('No permite repetir ubicación de disparo', () => {
    //     expect(board.receiveAttack(0, 0)).toBe(false);
    // });
    //
    // test('Marca el disparo en una celda ocupada', () => {
    //     expect(board.receiveAttack(0, 0)).toBe(true);
    //     expect(board.ships[0][0]).toBe('X');
    //     //
    // });
    //
    // test('Cuando el disparo da en un bote, se actualiza el estado de este', () => {
    //     //
    // });
    //
    // test('Reporta el hundimiento de un bote', () => {
    //     //
    // });
    //
    // test('avisa cuando ya no le quedan barcos en este tablero', () => {
    //     //
    // });
    // //
});
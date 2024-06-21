import Gameboard from '../gameboard';
const board = new Gameboard();

describe('Evaluación del tablero', () => {
    test('El tablero sea un array 2D de 10x10', () => {
        expect(Array.isArray(board.table)).toBe(true);
        expect(Array.isArray(board.table.length)).toBe(9);
        expect(Array.isArray(board.table[9])).toBe(true);
        expect(Array.isArray(board.table[9].length)).toBe(9);
    });

    test('Todos los campos están inicializados con false', () => {
        expect(
            board.table.every((box) => box[0] === false && box[1] === false),
        ).toBe(true);
    });
});

describe('Administración y posicionamiento de barcos', () => {
    test('Ubica un barco verticalmente dentro del tablero', () => {
        //
    });

    test('Ubica un barco horizontalmente dentro del tablero', () => {
        //
    });

    test('Mantiene el inventario de los barcos ubicados', () => {
        // quedan 3
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, mismo sentido', () => {
        //
    });

    test('No permite la ubicación de un barco donde por donde ya pasa otro, sentido contrario', () => {
        //
    });

    test('La ubicación de un barco vertical nunca excede el límite', () => {
        //
    });

    test('La ubicación de un barco horizontal nunca excede el límite', () => {
        //
    });

    test('Mantiene el inventario de los barcos ubicados 2', () => {
        // queda 1
    });

    test('ubica aleatoriamente un barco', () => {
        //
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
    })
    //
});

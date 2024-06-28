import Player from "../players";

const humanPlayer1 = new Player('Human')
const humanPlayer2 = new Player('Human')
const computerPlayer2 = new Player('Computer')

describe('Métodos para el Jugador humano', () => {
    test('Cada jugador tiene su tablero', ()=> {
        expect(Array.isArray(humanPlayer1.board.ships)).toBe(true)
        expect(Array.isArray(humanPlayer1.board.attacks)).toBe(true)
    })

    test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
        expect(humanPlayer1.board.remainingShips()).toBe(5)
    });

    test('El contador se actualiza cada que ubica un barco', () => {
        expect(humanPlayer1.board.placeShipRandom('Carrier')).toBe(true)
        expect(humanPlayer1.board.remainingShips()).toBe(4)
        expect(humanPlayer1.board.placeShipRandom('Battleship')).toBe(true)
        expect(humanPlayer1.board.remainingShips()).toBe(3)
        expect(humanPlayer1.board.placeShipRandom('Cruiser')).toBe(true)
        expect(humanPlayer1.board.remainingShips()).toBe(2)
        expect(humanPlayer1.board.placeShipRandom('Submarine')).toBe(true)
        expect(humanPlayer1.board.remainingShips()).toBe(1)
        expect(humanPlayer1.board.placeShipRandom('Destroyer')).toBe(true)
        expect(humanPlayer1.board.remainingShips()).toBe(0)
        console.table(humanPlayer1.board.ships)
    });

    test('No permite ningun disparo fuera del tablero', () => {
        expect(humanPlayer1.attack(0,0)).toBe(true)
        expect(humanPlayer1.attack(10,10)).toBe(false)
        expect(humanPlayer1.board.attacks[0][0]).toBe('·')
    });

    test('No permite disparos en donde ya han disparado', () => {
        expect(humanPlayer1.attack(0, 0)).toBe(false)
    });

    // test('Muestra la ubicación de los barcos y disparos recibidos', () => {
    //     // getShipsBoard()
    // });
    //
    // test('Muestra la ubicación de los disparos realizados', () => {
    //     // getAttacksBoard()
    // });
});

// describe('Métodos para el Jugador automático', () => {
//     test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
//         //
//     });
//
//     test('ubica sus 5 barcos de forma aleatoria', () => {
//         //
//     });
//
//     test('hace un disparos aleatorios', () => {
//         //
//     });
//
//     test('No dispara fuera del tablero', () => {
//         //
//     });
//
//     test('No disparas donde ya han disparado', () => {
//         //
//     });
//
//     test('Luego de impactar un barco, los siguientes disparos son en las casillas contiguas hasta volver a impactar', () => {
//         //
//     });
//
//     test('una vez vuelve a impactar, dispara en las celdas contiguas a esa línea hasta hundir el barco', () => {
//         //
//     });
// });
//
// test('Cuando un jugador queda sin barcos declara el ganador', () => {
//     //
// });

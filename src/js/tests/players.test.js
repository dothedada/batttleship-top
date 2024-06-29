import Player from '../players';

const player1 = new Player('Human');
const player2 = new Player('Human');
const playerC = new Player('Computer');

describe('Métodos para el Jugador humano', () => {
    test('Cada jugador tiene su tablero', () => {
        expect(Array.isArray(player1.board.ships)).toBe(true);
        expect(Array.isArray(player1.board.attacks)).toBe(true);
    });

    test('Asigna un adversario', () => {
        expect(player1.setAdversary(player2)).toBe(true);
        expect(player2.setAdversary(player1)).toBe(true);
    });

    test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
        expect(player1.board.remainingShips()).toBe(5);
    });

    test('El contador se actualiza cada que ubica un barco', () => {
        expect(player1.board.placeShip(0, 2, false, 'Carrier')).toBe(true);
        expect(player1.board.remainingShips()).toBe(4);
        expect(player1.board.placeShip(7, 0, true, 'Battleship')).toBe(true);
        expect(player1.board.remainingShips()).toBe(3);
        expect(player1.board.placeShip(7, 0, false, 'Cruiser')).toBe(false);
        expect(player1.board.remainingShips()).toBe(3);
        expect(player1.board.placeShip(7, 6, false, 'Cruiser')).toBe(true);
        expect(player1.board.remainingShips()).toBe(2);
        expect(player1.board.placeShip(4, 9, true, 'Submarine')).toBe(true);
        expect(player1.board.remainingShips()).toBe(1);
        expect(player1.board.placeShip(1, 5, false, 'Destroyer')).toBe(true);
        expect(player1.board.remainingShips()).toBe(0);
    });

    test('No permite ningun disparo fuera del tablero', () => {
        expect(player1.attack(0, 0)).toBe(true);
        expect(player1.attack(10, 10)).toBe(false);
        expect(player1.board.attacks[0][0]).toBe('·');
    });

    test('No permite disparos en donde ya han disparado', () => {
        expect(player1.attack(0, 0)).toBe(false);
    });

    test('Muestra la ubicación de los barcos y disparos recibidos', () => {
        expect(Array.isArray(player1.shipsBoard)).toBe(true);
    });

    test('Muestra la ubicación de los disparos realizados', () => {
        expect(Array.isArray(player1.attacksBoard)).toBe(true);
    });

    test('Marca los disparos que dieron en algun barco del enemigo', () => {
        player2.board.placeShip(3, 2, true, 'Carrier');
        expect(player1.attack(3, 2)).toBe(true);
        expect(player1.board.attacks[2][3]).toBe('X');
        expect(player2.board.ships[2][3]).toBe('X');
    });
});

describe('Métodos para el Jugador automático', () => {
    test('ubica sus 5 barcos de forma aleatoria', () => {
        playerC.placeAllShips()
        expect(playerC.shipsBoard.flat().filter(e => e.type).length).toBe(17)
        console.table(playerC.shipsBoard)
    });

    // test('hace un disparos aleatorios', () => {
    //     //
    // });
    //
    // test('No dispara fuera del tablero', () => {
    //     //
    // });
    //
    // test('No disparas donde ya han disparado', () => {
    //     //
    // });
    //
    // test('Luego de impactar un barco, los siguientes disparos son en las casillas contiguas hasta volver a impactar', () => {
    //     //
    // });
    //
    // test('una vez vuelve a impactar, dispara en las celdas contiguas a esa línea hasta hundir el barco', () => {
    //     //
    // });
});
//
// test('Cuando un jugador queda sin barcos declara el ganador', () => {
//     //
// });

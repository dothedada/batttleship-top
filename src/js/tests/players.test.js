import Gameboard from '../gameboard';
import Player from '../players';

const player1 = new Player('Miguel');
const player2 = new Player('Andrea');
const playerC = new Player();
const player3 = new Player('Arturito');

describe('Tablero de juego para cada juugador', () => {
    test('Cada jugador tiene su tablero y los jugadores humanos un nombre', () => {
        expect(Array.isArray(player1.myShips)).toBe(true);
        expect(Array.isArray(player1.myAttacks)).toBe(true);
        expect(player1.board instanceof Gameboard).toBe(true);
        expect(player1).toHaveProperty('name');
        expect(playerC).not.toHaveProperty('name');
    });

    test('Crea queue para jugadas automatizadas del jugador automático', () => {
        expect(playerC).toHaveProperty('nextAttack');
        expect(playerC).toHaveProperty('nextAttack.hits');
        expect(playerC).toHaveProperty('nextAttack.queue');
    });

    test('Vincula los adversarios', () => {
        player1.setAdversary(player2);
        playerC.setAdversary(player3);

        expect(player1.adversaryName).toBe('Andrea');
        expect(player2.adversaryName).toBe('Miguel');
        expect(playerC.adversaryName).toBe('Arturito');
        expect(player3.adversaryName).toBe('AutoPlayer');
    });

    test('Permite ubicar automaticamente todos los barcos', () => {
        playerC.placeAllShips();
        expect(playerC.myShips.flat().filter((e) => e.type).length).toBe(17);
        expect(playerC.board.shipsInventory.placed.size).toBe(5);
    });

    test('Permite ubicar los barcos restantes de forma aleatoria', () => {
        player3.board.placeShip(0, 0, false, 'Carrier')
        player3.board.placeShip(1, 0, false, 'Submarine')
        player3.placeAllShips()
        expect(playerC.myShips.flat().filter((e) => e.type).length).toBe(17);
        expect(playerC.board.shipsInventory.placed.size).toBe(5);
    })
});
// test('El tablero de ataques únicamente muestra disparos posibles, fallidos o acertados', () => {
//     player1.board.placeShip(0, 2, false, 'Carrier')
//     player1.board.placeShip(7, 0, true, 'Battleship')
//     player1.board.placeShip(7, 0, false, 'Cruiser')
//     player1.board.placeShip(7, 6, false, 'Cruiser')
//     player1.board.placeShip(0, 0, false, 'Cruiser')
//     player1.board.placeShip(4, 9, true, 'Submarine')
//     player1.board.placeShip(1, 5, false, 'Destroyer')
// });
//
// test('No permite ningun disparo fuera del tablero', () => {
//     expect(player1.attack(0, 0)).toBe(true);
//     expect(player1.attack(10, 10)).toBe(false);
//     expect(player1.board.attacks[0][0]).toBe('·');
// });
//
// test('No permite disparos en donde ya han disparado', () => {
//     expect(player1.attack(0, 0)).toBe(false);
// });
//
// test('Muestra la ubicación de los barcos y disparos recibidos', () => {
//     expect(Array.isArray(player1.shipsBoard)).toBe(true);
// });
//
// test('Muestra la ubicación de los disparos realizados', () => {
//     expect(Array.isArray(player1.attacksBoard)).toBe(true);
// });
//
// test('Marca los disparos que dieron en algun barco del enemigo', () => {
//     player2.board.placeShip(3, 2, true, 'Carrier');
//     expect(player1.attack(3, 2)).toBe(true);
//     expect(player1.board.attacks[2][3]).toBe('X');
//     expect(player2.board.ships[2][3]).toBe('X');
// });

// describe('Setup base para el Jugador automático', () => {
//     test('Crea attackQueue para jugador automatico', () => {
//         expect(typeof playerC.nextAttack === 'object').toBe(true);
//         expect(playerC.nextAttack.hits).toBeTruthy();
//         expect(playerC.nextAttack.queue).toBeUndefined();
//         expect(player1.nextAttack).toBeUndefined();
//     });
//
//     test('Luego de 100 disparos aleatorios ha cubierto todo el tablero', () => {
//         for (let i = 0; i < 100; i++) {
//             playerC.autoAtack();
//         }
//         expect(
//             playerC.attacksBoard.flat().filter((e) => e === false).length,
//         ).toBe(0);
//     });
// });

// describe('Comportamiento de los disparos de la computadora desde el impacto hasta hundir un bote', () => {
//     test('Con el primer impacto marca el punto y la secuencia de ataque a seguir', () => {
//         playerC.board.resetAttacksBoard();
//         playerC2.board.placeShip(1, 1, true, 'Carrier');
//         playerC.attack(1, 1);
//
//         expect(playerC.nextAttack.hits.length).toBe(1)
//         expect(playerC.nextAttack.hits[0]).toBe('11')
//
//         console.log(playerC.nextAttack.queue.length)
// expect(playerC.nextAttack.queue.length).toBe(4)
// expect(playerC.nextAttack.queue[0]).toBe('01')
// expect(playerC.nextAttack.queue[1]).toBe('12')
// expect(playerC.nextAttack.queue[2]).toBe('21')
// expect(playerC.nextAttack.queue[3]).toBe('10')

// });

// test('Sigue la secuencia de disparos hasta volver a impactar', () => {
//     playerC.autoAtack()
//     expect(playerC.attacksBoard[0][1]).toBe('·')
//     playerC.autoAtack()
//     expect(playerC.attacksBoard[1][2]).toBe('·')
//     expect(playerC.attacksBoard.flat().filter(c => c ==='·').length).toBe(2)
//
//     playerC.autoAtack()
//     playerC.autoAtack()
//     playerC.autoAtack()
//     playerC.autoAtack()
//     playerC.autoAtack()
//     console.table(playerC.attacksBoard)
// });
//
// test('Luego del segundo disparo acertado, prioriza la dirección', () => {
//     //
// });
//
// test('si al tener la dirección y llega al final, dispara en el otro sentido', () => {
//     //
// });
// });
//
// test('Cuando un jugador queda sin barcos declara el ganador', () => {
//     //
// });

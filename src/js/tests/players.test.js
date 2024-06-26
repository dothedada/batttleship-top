import Gameboard from '../gameboard';
import Player from '../players';

const player1 = new Player('Miguel');
const player2 = new Player('Andrea');
const playerC = new Player();
const player3 = new Player('Arturito');

const playerC1 = new Player();
const playerC2 = new Player();

describe('Tablero de juego para cada jugador', () => {
    test('Cada jugador tiene su tablero y los jugadores humanos un nombre', () => {
        expect(Array.isArray(player1.myShips)).toBe(true);
        expect(Array.isArray(player1.myAttacks)).toBe(true);
        expect(player1.board instanceof Gameboard).toBe(true);
        expect(player1).toHaveProperty('name');
        expect(playerC).not.toHaveProperty('name');
    });

    test('Crea queue para jugadas automatizadas del jugador automático', () => {
        expect(player1).not.toHaveProperty('nextAttack');
        expect(playerC).toHaveProperty('nextAttack');
        expect(playerC).toHaveProperty('nextAttack.hits');
        expect(playerC).toHaveProperty('nextAttack.queue');
    });

    test('Vincula los adversarios', () => {
        player1.setAdversary(player2);
        playerC.setAdversary(player3);
        playerC1.setAdversary(playerC2);

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
        player3.board.placeShip(0, 0, false, 'Carrier');
        player3.board.placeShip(1, 0, false, 'Submarine');
        player3.placeAllShips();
        expect(playerC.myShips.flat().filter((e) => e.type).length).toBe(17);
        expect(playerC.board.shipsInventory.placed.size).toBe(5);
    });
});

describe('Interacciones entre jugadores', () => {
    player2.board.placeShip(0, 2, true, 'Carrier');
    player2.board.placeShip(7, 0, false, 'Battleship');
    player2.board.placeShip(7, 6, true, 'Cruiser');
    player2.board.placeShip(4, 9, false, 'Submarine');
    player2.board.placeShip(1, 5, true, 'Destroyer');

    test('No permite ningun disparo fuera del tablero', () => {
        expect(player1.attack(0, 0)).toBe(true);
        expect(player1.attack(10, 10)).toBe(false);
        expect(player1.myAttacks[0][0]).toBe('·');
    });

    test('Marca de igual manera los disparos en el tablero del attacante y del defensor', () => {
        expect(player2.myShips[0][0]).toBe('·');
        expect(player1.attack(0, 2)).toBe(true);
        expect(player1.myAttacks[2][0]).toBe('X');
    });

    test('No permite disparos en donde ya han disparado', () => {
        expect(player1.attack(0, 0)).toBe(false);
    });

    test('Muestra la ubicación de barcos y disparos recibidos', () => {
        expect(Array.isArray(player2.myShips)).toBe(true);
    });

    test('Muestra la ubicación de disparos realizados', () => {
        expect(Array.isArray(player1.myAttacks)).toBe(true);
    });

    test('Informa al atacante cuando ha hundido un barco', () => {
        expect(player1.attack(1, 2)).toBe(true);
        expect(player1.myAttacks[2][1]).toBe('X');
        expect(player1.attack(2, 2)).toBe(true);
        expect(player1.myAttacks[2][2]).toBe('X');
        expect(player1.attack(3, 2)).toBe(true);
        expect(player1.myAttacks[2][3]).toBe('X');
        expect(player1.attack(4, 2)).toBe('Sunk');
        expect(player1.myAttacks[2][1]).toBe('X');
        expect(player1.score).toBe(1);
    });
});

playerC2.board.placeShip(3, 4, true, 'Carrier');
playerC2.board.placeShip(8, 6, false, 'Battleship');
playerC2.board.placeShip(9, 0, false, 'Cruiser');
playerC2.board.placeShip(0, 6, false, 'Submarine');
playerC2.board.placeShip(1, 5, false, 'Destroyer');

describe('Comportamiento de los ataques automatizados', () => {
    test.skip('Luego de 100 disparos aleatorios ha cubierto todo el tablero', () => {
        for (let i = 0; i < 100; i++) {
            player2.attackAuto();
        }
        expect(player2.myAttacks.flat().filter((e) => e === false).length).toBe(
            0,
        );
    });

    test('Al impactar un barco, registra las coordenadas del disparo', () => {
        playerC1.attack(1, 1);
        expect(playerC1.nextAttack.hits.length).toBe(0);
        playerC1.attack(5, 4);
        expect(playerC1.nextAttack.hits.length).toBe(1);
    });

    test('El primer impacto crea el queue de exploración', () => {
        expect(playerC1.nextAttack.queue.length).toBe(4);
        expect(playerC1.nextAttack.queue[0].join('')).toBe('35');
        expect(playerC1.nextAttack.queue[1].join('')).toBe('46');
        expect(playerC1.nextAttack.queue[2].join('')).toBe('55');
        expect(playerC1.nextAttack.queue[3].join('')).toBe('44');
    });

    test('Los disparos siguientes a un impacto siguen el queue', () => {
        playerC1.attackAuto();
        expect(playerC1.myAttacks[3][5]).not.toBe('X');
        playerC1.attackAuto();
        expect(playerC1.myAttacks[4][6]).toBe('X');
    });

    test('desde el segundo impacto se priorizan los ataques en ese eje', () => {
        playerC1.attackAuto()
        expect(playerC1.myAttacks[4][7]).toBe('X');
        playerC1.attackAuto()
        expect(playerC1.myAttacks[4][8]).toBe('·');
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        playerC1.attackAuto()
        console.table(playerC2.myShips);
    })
});

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

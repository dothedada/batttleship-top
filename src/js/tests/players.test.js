import Player from '../players';

const player1 = new Player('Human');
const player2 = new Player('Human');
const playerC = new Player('Computer');
const playerC2 = new Player('Computer');

describe('Métodos para el Jugador humano', () => {
    test('Cada jugador tiene su tablero', () => {
        expect(Array.isArray(player1.board.ships)).toBe(true);
        expect(Array.isArray(player1.board.attacks)).toBe(true);
    });

    test('Asigna un adversario', () => {
        expect(player1.setAdversary(player2)).toBe(true);
        expect(player2.setAdversary(player1)).toBe(true);
        expect(playerC.setAdversary(playerC2)).toBe(true);
        expect(playerC2.setAdversary(playerC)).toBe(true);
    });

    test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
        expect(player1.board.shipsLeftToPlace()).toBe(5);
    });

    test('El contador se actualiza cada que ubica un barco', () => {
        expect(player1.board.placeShip(0, 2, false, 'Carrier')).toBe(true);
        expect(player1.board.shipsLeftToPlace()).toBe(4);
        expect(player1.board.placeShip(7, 0, true, 'Battleship')).toBe(true);
        expect(player1.board.shipsLeftToPlace()).toBe(3);
        expect(player1.board.placeShip(7, 0, false, 'Cruiser')).toBe(false);
        expect(player1.board.shipsLeftToPlace()).toBe(3);
        expect(player1.board.placeShip(7, 6, false, 'Cruiser')).toBe(true);
        expect(player1.board.shipsLeftToPlace()).toBe(2);
        expect(player1.board.placeShip(4, 9, true, 'Submarine')).toBe(true);
        expect(player1.board.shipsLeftToPlace()).toBe(1);
        expect(player1.board.placeShip(1, 5, false, 'Destroyer')).toBe(true);
        expect(player1.board.shipsLeftToPlace()).toBe(0);
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

describe('Setup base para el Jugador automático', () => {
    test('Crea attackQueue para jugador automatico', () => {
        expect(typeof playerC.nextAttack === 'object').toBe(true);
        expect(playerC.nextAttack.hits).toBeTruthy();
        expect(playerC.nextAttack.queue).toBeUndefined();
        expect(player1.nextAttack).toBeUndefined();
    });
    test('ubica sus 5 barcos de forma aleatoria', () => {
        playerC.placeAllShips();
        expect(playerC.shipsBoard.flat().filter((e) => e.type).length).toBe(17);
    });

    test('Luego de 100 disparos aleatorios ha cubierto todo el tablero', () => {
        for (let i = 0; i < 100; i++) {
            playerC.autoAtack();
        }
        expect(
            playerC.attacksBoard.flat().filter((e) => e === false).length,
        ).toBe(0);
    });
});

describe('Comportamiento de los disparos de la computadora desde el impacto hasta hundir un bote', () => {
    test('Con el primer impacto marca el punto y la secuencia de ataque a seguir', () => {
        playerC.board.resetAttacksBoard();
        playerC2.board.placeShip(1, 1, true, 'Carrier');
        playerC.attack(1, 1);

        expect(playerC.nextAttack.hits.length).toBe(1)
        expect(playerC.nextAttack.hits[0]).toBe('11')
        
        console.log(playerC.nextAttack.queue.length)
        // expect(playerC.nextAttack.queue.length).toBe(4)
        // expect(playerC.nextAttack.queue[0]).toBe('01')
        // expect(playerC.nextAttack.queue[1]).toBe('12')
        // expect(playerC.nextAttack.queue[2]).toBe('21')
        // expect(playerC.nextAttack.queue[3]).toBe('10')
        
    });

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
});
//
// test('Cuando un jugador queda sin barcos declara el ganador', () => {
//     //
// });

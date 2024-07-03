import { describe, expect, test } from '@jest/globals';

import Gameboard from '../gameboard';
import Player from '../players';

const player1 = new Player('Miguel');
const player2 = new Player('Andrea');
const playerC = new Player();
const player3 = new Player('Arturito');
const playerC1 = new Player();
const playerC2 = new Player();

player2.board.placeShip(0, 2, true, 'Carrier');
player2.board.placeShip(7, 0, false, 'Battleship');
player2.board.placeShip(7, 6, true, 'Cruiser');
player2.board.placeShip(4, 9, false, 'Submarine');
player2.board.placeShip(1, 5, true, 'Destroyer');

playerC2.board.placeShip(3, 4, true, 'Carrier');
playerC2.board.placeShip(2, 0, false, 'Battleship');
playerC2.board.placeShip(2, 5, false, 'Cruiser');
playerC2.board.placeShip(0, 6, false, 'Submarine');
playerC2.board.placeShip(1, 6, false, 'Destroyer');

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
        playerC.board.placeRemainignShipsRandom();
        expect(playerC.myShips.flat().filter((e) => e.type).length).toBe(17);
        expect(playerC.board.shipsInventory.placed.size).toBe(5);
    });
});

describe('Interacciones entre jugadores', () => {
    test('No permite ningun disparo fuera del tablero', () => {
        expect(player1.attack(0, 0)).toBeTruthy();
        expect(player1.attack(10, 10)).toBe(false);
        expect(player1.myAttacks[0][0]).toBe('·');
    });

    test('Marca de igual manera los disparos en el tablero del attacante y del defensor', () => {
        expect(player2.myShips[0][0]).toBe('·');
        expect(player1.attack(0, 2)).toBe('Ship');
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
        for (let i = 1; i < 4; i++) {
            expect(player1.attack(i, 2)).toBeTruthy();
            expect(player1.myAttacks[2][i]).toBe('X');
        }
        expect(player1.attack(4, 2)).toBe('Sunk');
        expect(player1.myAttacks[2][4]).toBe('X');
        expect(player1.score).toBe(1);
    });
});

describe('Comportamiento de Autoplayer', () => {
    test('Luego de 100 disparos aleatorios ha cubierto todo el tablero', () => {
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

    test('El primer impacto crea en el queue una secuencia de exploración', () => {
        expect(playerC1.nextAttack.queue.length).toBe(4);
        expect(playerC1.nextAttack.queue[0].join(',')).toBe('3,5');
        expect(playerC1.nextAttack.queue[1].join(',')).toBe('4,6');
        expect(playerC1.nextAttack.queue[2].join(',')).toBe('5,5');
        expect(playerC1.nextAttack.queue[3].join(',')).toBe('4,4');
    });

    test('Los disparos siguientes a un impacto siguen la secuencua del queue', () => {
        playerC1.attackAuto();
        expect(playerC1.myAttacks[3][5]).not.toBe('X');
        playerC1.attackAuto();
        expect(playerC1.myAttacks[4][6]).toBe('X');
    });

    test('desde el segundo impacto se priorizan en el queue los ataques en ese eje', () => {
        expect(playerC1.nextAttack.queue[0].join(',')).toBe('4,7');
        playerC1.attackAuto();
        expect(playerC1.nextAttack.queue[0].join(',')).toBe('4,8');
    });

    test('luego de 7 disparos un Carrier horizontal es hundido', () => {
        playerC1.attackAuto();
        playerC1.attackAuto();
        expect(playerC1.attackAuto()).toBe('Sunk');
        expect(playerC1.score).toBe(1);
    });

    test('Cada Jugador lleva el inventario de la cantidad de barcos hundidos', () => {
        expect(playerC1.score).toBe(1);
        expect(playerC2.score).toBe(0);
    });

    test('Al hundir un barco el attack queue es reseteado', () => {
        expect(playerC1.nextAttack.hits.length).toBe(0);
        expect(playerC1.nextAttack.queue.length).toBe(0);
        expect(playerC1.nextAttack.suspicious).toBe(0);
    });

    test('Hunde un barco ubicado verticalmente en menos de su longitud + 1', () => {
        playerC1.attack(2, 2);
        playerC1.attackAuto();
        playerC1.attackAuto();
        expect(playerC1.attackAuto()).toBe('Sunk');
    });
});

describe('Comportamiento de Autoplayer frente a un cluster de barcos', () => {
    test('Crea una sospecha al no haber casillas en el queue para la direccion del ataque', () => {
        playerC1.attack(0, 6);
        for (let i = 0; i < 4; i++) {
            playerC1.attackAuto();
        }
        expect(
            playerC1.nextAttack.hits.length === playerC1.nextAttack.suspicious,
        ).toBe(true);
    });

    test('cada que hunde un barco va reduciendo la cantidad de barcos posibles', () => {
        playerC1.attackAuto();
        playerC1.attackAuto();
        expect(playerC1.nextAttack.suspicious).toBe(2);
    });

    test('Se limpia Hits y Queue de la info generada por el barco hundido', () => {
        expect(playerC1.nextAttack.hits.some((e) => e[1] === 0)).toBe(false);
        expect(playerC1.nextAttack.queue.some((e) => e[1] === 0)).toBe(false);
    });

    test('cada que hunde un barco va reduciendo la cantidad de barcos posibles', () => {
        playerC1.attackAuto();
        playerC1.attackAuto();
        expect(playerC1.nextAttack.suspicious).toBe(1);
    });
});
describe('Fin de partida', () => {
    test('El ataque reporta cuando un jugador se ha quedado sin barcos', () => {
        playerC1.attackAuto();
        playerC1.attackAuto();
        expect(playerC1.attackAuto()).toBe('No ships left');
    });
});

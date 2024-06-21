import Player from "../players";

describe('Métodos para el Jugador humano', () => {
    test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
        //
    });

    test('El contador se actualiza cada que ubica un barco', () => {
        //
    });

    test('No permite ningun disparo fuera del tablero', () => {
        //
    });

    test('No permite disparos en donde ya han disparado', () => {
        //
    });

    test('Muestra la ubicación de los barcos y disparos recibidos', () => {
        // getShipsBoard()
    });

    test('Muestra la ubicación de los disparos realizados', () => {
        // getAttacksBoard()
    });
});

describe('Métodos para el Jugador automático', () => {
    test('Cada jugador dispone de 5 barcos al iniciar el tablero', () => {
        //
    });

    test('ubica sus 5 barcos de forma aleatoria', () => {
        //
    });

    test('hace un disparos aleatorios', () => {
        //
    });

    test('No dispara fuera del tablero', () => {
        //
    });

    test('No disparas donde ya han disparado', () => {
        //
    });

    test('Luego de impactar un barco, los siguientes disparos son en las casillas contiguas hasta volver a impactar', () => {
        //
    });

    test('una vez vuelve a impactar, dispara en las celdas contiguas a esa línea hasta hundir el barco', () => {
        //
    });
});

test('Cuando un jugador queda sin barcos declara el ganador', () => {
    //
});

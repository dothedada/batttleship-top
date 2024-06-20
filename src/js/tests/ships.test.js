import Ship from '../ships';

describe('Test para ship', () => {
    const carrier = new Ship(5);
    const battleship = new Ship(4);
    const cruiser = new Ship(3);
    const destroyer = new Ship(2);

    test('Los barcos son objetos', () => {
        expect(typeof destroyer === 'object').toBe(true);
    });

    test('Los barcos tienen la longitud esperada', () => {
        expect(carrier.length).toBe(5);
        expect(battleship.length).toBe(4);
        expect(cruiser.length).toBe(3);
        expect(destroyer.length).toBe(2);
    });

    test('Cada hit() reduce 1 hits y el inventario de daños se actualiza', () => {
        for (let i = 0; i < carrier.length; i++) {
            expect(carrier.hits).toBe(i);
            carrier.hit();
        }
    });

    test('Con cada impacto evalua si el barco se hunde', () => {
        for (let i = cruiser.length; i > 1; i--) {
            cruiser.hit();
            expect(cruiser.sunk).toBe(false);
        }
        cruiser.hit();
        expect(cruiser.sunk).toBe(true);
    });
});

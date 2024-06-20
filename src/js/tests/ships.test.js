import ship from "../ships";

describe('Test para ship', () => {
    test('Ship tiene la cantidad de impactos asugnada', () => {
        expect(ship(9)).toBe(9)
    })
})

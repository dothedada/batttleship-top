# La Cumbancha

Para este esjercicio de TDD, creé mi versión de Battleship. Además de permitirme profundizar mis conocimientos en unit testing y Jest, aproveché la oportunidad para trabajar el desarrollo y empaquetado con Vite e incorporar Biome como herramienta de lint.

Usar nvim y pasar tanto tiempo en la terminal tienen consecuencias, aunque este juego sea implementado en navegador, no quiero pasar mucho tiempo diseñando, toda la interfase va a emular un terminal y será controlada por teclado, el único uso del mouse será para responer a un requerimiento del ejercicio, ubicar los barcos en el tablero.

## Tareas
- [] Crear los test propios y el objeto Ship
    - [] Ships es un objeto con la propiedades length, hits y sunk
    - [] debe tener un método hit() para marcar los impactos
    - [] debe tener un método isSunk() para detectar si un barco fue hundido
- [] Crear los test propios y el objeto Gameboard
    - [] El tablero esta construido por un array de 2 dimensiones y 10 de length en cada dimensión, y cada celda está estructurada de la siguiente forma, [ attacked<boolean>, ship<object> || false ]
    - [] debe tener el método placeShip(col<number>, row<number>, dir<boolean>, lenght<number>) que ubica el punto inicial del barco en col y row, y su direccion dir (true: horizontal, false: vertical), si las cordenadas marcadas estan por fuera del cuadro, ubicar en la posible más cercana
    - [] Debe tener el método receiveAttack(col<number>, row<number>), que determina si algun barco fue impactado le envía la señal de hit() y/o marcar en el tablero el impacto
    - [] debe tener el método shipsLeft() que indica cuántos botes aún quedan flotando.
    - [] debe tener un método randomPlaceShips() que ubica en un lugar aleatorio los barcons que todavía no han sido ubicados
    - [] debe tener los métodos getShipsBoard() y getAttacksBoard() que retorna los tableros para renderizar
- [] Crear los test propios y el objeto Player
    - [] crea un jugador con un nombre, sus barcos disponibles y su tablero
    - [] cada jugador debe tener un contador de barcos disponibles para ubicar
- [] Crea el archivo que integra los tres objetos y determina el gameflow
    - [] el gameflow se determina solo por los métodos
    - [] Posibilidad de jugar contra el cpu
        - [] Disparar solo dentro del tablero
        - [] si impacta en un barco, los siguientes disparos son continuos al impacto hasta undirlo
    - [] Posibilidad de jugar contra otra persona, (blackout screen)
- [] Crea la interfase a partir de los gameboards

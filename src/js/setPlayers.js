const setPlayers = () => {
    document.querySelector('#header').innerHTML =
        '<h1>¿Quienes van a jugar?</h1>';

    document.querySelector('#app').innerHTML = `
<form>
    <label>
        Nombre de la persona que inicia el juego:
        <input type="text" placeholder="Deja en blanco para jugar conta la compu">
    </label>

    <label>
        Nombre del contrincante:
        <input type="text" placeholder="Deja en blanco para jugar conta la compu">
    </label>

    <button type="button" class="set">¡Iniciar el combate!</button>

    <div>Debe existir al menos un jugador humano</div>

</form>
`;

};

export default setPlayers;

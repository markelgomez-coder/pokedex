document.getElementById("panel-pokemon-izquierda").innerHTML = "";
document.getElementById("panel-pokemon-derecha").innerHTML = "";

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

obtenerPokemon(numeroPokemon).then((pokemon) => {
  mostrarPokemonSinLink(pokemon, "panel-pokemon-izquierda");
  obtenerPokemonDescripcion(numeroPokemon).then((descripcion) => {
    mostrarPanelDerecha(descripcion);
  });
});

async function mostrarPanelDerecha(descripcion) {
  document.getElementById("panel-pokemon-derecha").innerHTML += `
        
            <p class="descripcion-pokemon">${descripcion}</p>
            <div class="panel-evoluciones">

            </div>
            <div class="panel-debilidades">

            </div>
            `;
}

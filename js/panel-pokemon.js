document.getElementById("panel-pokemon-izquierda").innerHTML = "";
document.getElementById("panel-pokemon-derecha").innerHTML = "";

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

obtenerPokemon(numeroPokemon).then(async (pokemon) => {
  mostrarPokemonSinLink(pokemon, "panel-pokemon-izquierda");

  const descripcion = await obtenerPokemonDescripcion(numeroPokemon);
  const dobleDaño = await obtenerDobleDañoPokemon(numeroPokemon);
  const mitadDaño = await obtenerMitadDañoPokemon(numeroPokemon);
  const noDaño = await obtenerNoDañoPokemon(numeroPokemon);

  mostrarPanelDerecha(descripcion, dobleDaño, mitadDaño, noDaño);
});

async function mostrarPanelDerecha(descripcion, dobleDaño, mitadDaño, noDaño) {
  const dobleDañoHTML = dobleDaño
    .map((d) => `<span class="daño ${d}">${d}</span>`)
    .join("");

  const mitadDañoHTML = mitadDaño
    .map((d) => `<span class="daño ${d}">${d}</span>`)
    .join("");

  const noDañoHTML = noDaño
    .map((d) => `<span class="daño ${d}">${d}</span>`)
    .join("");

  document.getElementById("panel-pokemon-derecha").innerHTML += `
    <p class="descripcion-pokemon">${descripcion}</p>

    <p class="subtitulo-panel-pokemon">Evoluciones</p>
    <div class="panel-evoluciones"></div>

    <p class="subtitulo-panel-pokemon">Debilidades</p>
    <div class="panel-debilidades">
      <div class="panel-doble-daño">
        <p class="debilidades"> DOBLE DAÑO </p>
        ${dobleDañoHTML}
      </div>
      <div class="panel-mitad-daño">
      <p class="debilidades"> MITAD DAÑO </p>
      ${mitadDañoHTML}
      </div>
      <div class="panel-no-daño">
      <p class="debilidades"> NO DAÑO </p>
      ${noDañoHTML}
      </div>
      
    </div>
  `;
}

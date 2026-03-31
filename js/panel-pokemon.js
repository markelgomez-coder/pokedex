document.getElementById("panel-pokemon-izquierda").innerHTML = "";
document.getElementById("panel-pokemon-derecha").innerHTML = "";

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

obtenerPokemon(numeroPokemon).then(async (pokemon) => {
  mostrarPokemonSinLink(pokemon, "panel-pokemon-izquierda");

  const descripcion = await obtenerPokemonDescripcion(numeroPokemon);
  const dobleDano = await obtenerDobleDanoPokemon(numeroPokemon);
  const mitadDano = await obtenerMitadDanoPokemon(numeroPokemon);
  const noDano = await obtenerNoDanoPokemon(numeroPokemon);
  const evolucionesLink = await obtenerPokemonEvolucionesLink(numeroPokemon);
  const evolucion = await obtenerPokemonEvoluciones(evolucionesLink);

  const evoluciones = await Promise.all(
    evolucion.map((evo) => obtenerPokemon(evo)),
  );

  console.log(evoluciones);

  mostrarPanelDerecha(descripcion, dobleDano, mitadDano, noDano, evoluciones);
});

async function mostrarPanelDerecha(
  descripcion,
  dobleDano,
  mitadDano,
  noDano,
  evoluciones,
) {
  const dobleDanoHTML = dobleDano
    .map((d) => `<span class="dano ${d}">${d}</span>`)
    .join("");

  const mitadDanoHTML = mitadDano
    .map((d) => `<span class="dano ${d}">${d}</span>`)
    .join("");

  const noDanoHTML = noDano
    .map((d) => `<span class="dano ${d}">${d}</span>`)
    .join("");

  document.getElementById("panel-pokemon-derecha").innerHTML += `
    <p class="descripcion-pokemon">${descripcion}</p>

    <p class="subtitulo-panel-pokemon">Evoluciones</p>
    <div class="panel-evoluciones">
      ${evoluciones
        .map(
          (evo) => `
      <a class="evolucion-pokemon" href="panel-pokemon.html?pokemon=${evo.nombre}">
        <img src=${evo.imagen}>
        <p class="evolucion-pokemon-nombre">${evo.nombre.charAt(0).toUpperCase() + evo.nombre.slice(1)}</p>
      </a>`,
        )
        .join("")}
    </div>

    <p class="subtitulo-panel-pokemon">Debilidades</p>
    <div class="panel-debilidades">
      <div class="panel-doble-dano">
        <p class="debilidades-subtitulo"> DEBILIDAD </p>
        <div class="tipos-dano">
        ${dobleDanoHTML}
        </div>
      </div>
      <div class="panel-mitad-dano">
        <p class="debilidades-subtitulo"> RESISTENCIA </p>
        <div class="tipos-dano">
        ${mitadDanoHTML}
        </div>
      </div>
      <div class="panel-no-dano">
        <p class="debilidades-subtitulo"> INMUNIDAD </p>
        <div class="tipos-dano">
        ${noDanoHTML}
        </div>
      </div>
      
    </div>
  `;
}

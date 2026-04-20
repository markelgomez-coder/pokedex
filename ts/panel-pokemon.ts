import type { DanoPokemon, Pokemon } from "./tipos";
import * as funciones from "./funciones-generales.js";
import { dreamTeam } from "./dream-team.js";

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

if(numeroPokemon!= null)
funciones.obtenerPokemon(numeroPokemon).then(async (pokemon:Pokemon) => {
  let html = funciones.mostrarPokemon(pokemon, dreamTeam.includes(pokemon)? true : false  );
  const container = document.getElementById("panel-pokemon-izquierda");

  const descripcion = await funciones.obtenerPokemonDescripcion(numeroPokemon);
  const dobleDano = await funciones.obtenerDebilidadPokemon(numeroPokemon);
  const mitadDano = await funciones.obtenerResistenciaPokemon(numeroPokemon);
  const noDano = await funciones.obtenerInmunidadPokemon(numeroPokemon);
  const evolucionesLink = await funciones.obtenerPokemonEvolucionesLink(numeroPokemon);
  const evolucion = await funciones.obtenerPokemonEvoluciones(evolucionesLink);

  const evoluciones = await Promise.all(
    evolucion.map((evo:Pokemon) => funciones.obtenerPokemon(evo.nombre)),
  );  
  if (container != null) {
    container.innerHTML += html;
  }
  mostrarPanelDerecha(descripcion, dobleDano, mitadDano, noDano, evoluciones);
});

async function mostrarPanelDerecha(
  descripcion:string,
  dobleDano:Array<DanoPokemon>,
  mitadDano:Array<DanoPokemon>,
  noDano:Array<DanoPokemon>,
  evoluciones:Array<Pokemon>,
) {
  const dobleDanoHTML = dobleDano
    .map((d:DanoPokemon) => `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`)
    .join("");

  const mitadDanoHTML = mitadDano
    .map((d:DanoPokemon) => `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`)
    .join("");

  const noDanoHTML = noDano
    .map((d:DanoPokemon) => `<span class="dano ${d.name}">${d.name.charAt(0).toUpperCase() + d.name.slice(1)}</span>`)
    .join("");

    const container = document.getElementById("panel-pokemon-derecha");

    if(container!= null){
      container.innerHTML += `
    <p class="descripcion-pokemon">${descripcion}</p>

    <p class="subtitulo-panel-pokemon">Evoluciones</p>
    <div class="panel-evoluciones">
      ${evoluciones
        .map(
          (evo:Pokemon) => `
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
  
}

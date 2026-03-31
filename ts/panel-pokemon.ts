import type { Pokemon } from "./tipos";
import * as funciones from "./funciones-generales";

function inicializarPanelVacio(){
  const containerIzquierda = document.getElementById("panel-pokemon-izquierda");
  if(containerIzquierda != null){
    containerIzquierda.innerHTML = "";
  }
    const containerDerecha = document.getElementById("panel-pokemon-derecha");
  if(containerDerecha != null){
    containerDerecha.innerHTML = "";
  }
}

const numeroPokemon = new URLSearchParams(window.location.search).get(
  "pokemon",
);

if(numeroPokemon!= null)
funciones.obtenerPokemon(numeroPokemon).then(async (pokemon:Pokemon) => {
  funciones.mostrarPokemonSinLink(pokemon, "panel-pokemon-izquierda");

  const descripcion = await funciones.obtenerPokemonDescripcion(numeroPokemon);
  const dobleDano = await funciones.obtenerDobleDanoPokemon(numeroPokemon);
  const mitadDano = await funciones.obtenerMitadDanoPokemon(numeroPokemon);
  const noDano = await funciones.obtenerNoDanoPokemon(numeroPokemon);
  const evolucionesLink = await funciones.obtenerPokemonEvolucionesLink(numeroPokemon);
  const evolucion = await funciones.obtenerPokemonEvoluciones(evolucionesLink);

  const evoluciones = await Promise.all(
    evolucion.map((evo:Pokemon) => funciones.obtenerPokemon(evo.nombre)),
  );

  console.log(evoluciones);

  mostrarPanelDerecha(descripcion, dobleDano, mitadDano, noDano, evoluciones);
});

async function mostrarPanelDerecha(
  descripcion:string,
  dobleDano:Array<string>,
  mitadDano:Array<string>,
  noDano:Array<string>,
  evoluciones:Array<Pokemon>,
) {
  const dobleDanoHTML = dobleDano
    .map((d:string) => `<span class="dano ${d}">${d}</span>`)
    .join("");

  const mitadDanoHTML = mitadDano
    .map((d:string) => `<span class="dano ${d}">${d}</span>`)
    .join("");

  const noDanoHTML = noDano
    .map((d:string) => `<span class="dano ${d}">${d}</span>`)
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

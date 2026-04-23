import * as datosGenerales from "./datos-generales.js";
import * as funcionesAPI from "./funciones-API.js";
import * as funcionesStorage from "./storage-funciones.js";
import * as funcionesPokedex from "./pokedex.js";

import type {
  EvolutionNode,
  FlavorTextEntry,
  Pokemon,
  TipoPokemon,
  DanoPokemon,
} from "./tipos";

export async function setPokemons(containerId: string) {
  let pokemonsGuardados: Array<Pokemon> = [];
  datosGenerales.VaciarListaPokemon();

  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    datosGenerales.listaPokemon.push(...pokemonsGuardados);
    if (containerId === "pokedex") {
      funcionesStorage.cargarDreamTeamDesdeStorage();
      funcionesPokedex.ensenarCartas(pokemonsGuardados);
    }
    pokemonsGuardados = [];
  }
  if (containerId === "dreamTeam") {
    funcionesStorage.cargarDreamTeamDesdeStorage();
  }
}

async function obtenerGeneracion(id: number) {
  const container = document.getElementById("resultado-busqueda");
  const promesas = [];
  let pokemonsAnteriores: number = sacarPokemonsAnteriores(id);
  try {
    for (
      let i = pokemonsAnteriores;
      i <= pokemonsAnteriores + datosGenerales.generaciones[id - 1].cantidadPokemon - 1;
      i++
    ) {
      promesas.push(funcionesAPI.obtenerPokemon(i + ""));
    }

    const pokemons: Array<Pokemon> = await Promise.all(promesas);
    if (container != null && pokemonsAnteriores == 1) container.innerHTML = "";

    return pokemons;
  } catch (error) {
    if (container != null) container.innerHTML = "";
    ensenarErrorAPI();
    return [];
  }
}

function sacarPokemonsAnteriores(id: number) {
  let pokemonsAnteriores = 0;
  for (let i = 1; i < id; i++) {
    pokemonsAnteriores += datosGenerales.generaciones[i - 1].cantidadPokemon;
  }
  if (pokemonsAnteriores == 0) {
    return 1;
  }
  return pokemonsAnteriores;
}

export function sacarTipoDato(value: string) {
  value = value.toLowerCase().trim();

  if (datosGenerales.tiposPokemon.includes(value)) {
    return "tipo";
  }
  if (/^#?\d+$/.test(value)) {
    return "numero";
  }
  return "nombre";
}

export function formatearNumero(numero: number) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
}

export function mostrarPokemon(pokemon: Pokemon, gogokoa: boolean) {
  const htmlDreamTeam = `
  <div class="icono-dream-team-vector2 ${gogokoa ? "activo" : ""}"></div>`;
  return `
      <a class="carta-pokemon ${pokemon.tipos[0]}">
            <header>
              <p class="pokemon-name">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</p>
              <p class="pokemon-number">${formatearNumero(pokemon.numero)}</p>
            </header>
            <img
              class="pokemon-image"
              src="${pokemon.imagen}"
              alt="Imagen ${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}"
            />
            <div class="pokemon-info">
              <div class="icono-dream-team">
                <div class="icono-dream-team-interior">
                  <div class="icono-dream-team-vector1"></div>
                  ${htmlDreamTeam}
                </div>
              </div>
              <div class="tipo-pokemon">
                ${pokemon.tipos
                  .map(
                    (tipo) => `
                  <div class="icono-tipo ${tipo}">
                    <p class="texto-tipo">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                  </div>`,
                  )
                  .join("")}
              </div>
              <div class="medidas-pokemon">
                <div class="icono-peso"></div>
                <p>${pokemon.peso} Kg</p>
                <div class="separador-tipos"></div>
                <div class="icono-altura"></div>
                <p>${pokemon.altura} m</p>
              </div>
              <div class="estadisticas-pokemon">
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">HP</p>
                    <p class="estadistica-valor">${pokemon.hp}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.hp / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">ATK</p>
                    <p class="estadistica-valor">${pokemon.atk}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.atk / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">DEF</p>
                    <p class="estadistica-valor">${pokemon.def}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.def / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SAT</p>
                    <p class="estadistica-valor">${pokemon.sat}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sat / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SDF</p>
                    <p class="estadistica-valor">${pokemon.sdf}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sdf / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SPD</p>
                    <p class="estadistica-valor">${pokemon.spd}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.spd / 255) - 16 + "px"}"></div>
                </div>
              </div>
            </div>
          </a>
      `;
}

export function mostrarCartasVacias() {
  const container = document.getElementById("resultado-busqueda");

  if (container != null) {
    container.innerHTML = "";

    let vaciasHtml = "";

    for (let i = 0; i < 9; i++) {
      vaciasHtml += `
      <div class="carta-pokemon-vacia">
        <div class="carta-pokemon-vacia-interior"> 
          <div class="carta-pokemon-vacia-icono-interior">
            <div class="carta-pokemon-vacia-icono-interior-circulo-fuera"></div>
            <div class="carta-pokemon-vacia-icono-interior-circulo-dentro"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-derecha"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-izquierda"></div>
          </div>
        </div>
      </div>
      `;
    }

    container.innerHTML = vaciasHtml;
  }
}

export function ensenarNoHayResultado() {
  const container = document.getElementById("resultado-busqueda");
  const input = document.getElementById("input-busqueda") as HTMLInputElement;

  if (container != null)
    container.innerHTML = `
    <div class="no-hay-resultado">
      <div class="icono-no-hay-resultado">
        <div class="icono-no-hay-resultado-interior"></div>
        <div class="icono-no-hay-resultado-vector1"></div>
        <div class="icono-no-hay-resultado-vector2"></div>
        <div class="icono-no-hay-resultado-vector3"></div>
        <div class="icono-no-hay-resultado-vector4"></div>
        <div class="icono-no-hay-resultado-vector5"></div>
      </div>
      <p> There is no results for "${input.value}" </p>
    </div>
    `;
}

export function ensenarErrorAPI() {
  const container = document.getElementById("resultado-busqueda");
  if (container != null)
    container.innerHTML += `
  <div class="error-api-pokemon">
    <div class="icono-error-api-pokemon">
      <div class="icono-error-api-pokemon-interior"></div>
      <div class="icono-error-api-pokemon-vector1"></div>
      <div class="icono-error-api-pokemon-vector2"></div>
      <div class="icono-error-api-pokemon-vector3"></div>
      <div class="icono-error-api-pokemon-vector4"></div>
    </div>
    <p> An error ocurred getting Pokemons.</p>
    <p> <br>Please try later</p>
  </div>
  `;
}

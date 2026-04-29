import * as datosGenerales from "./datos-generales.js";
import * as funcionesAPI from "./funciones-API.js";
import * as funcionesStorage from "./storage-funciones.js";
import * as mostrarHTML from "./mostrar-html.js";
import * as funcionesPokedex from "./pokedex.js";

import type {
  EvolutionNode,
  FlavorTextEntry,
  Pokemon,
  TipoPokemon,
  DanoPokemon,
} from "./tipos";

export async function setPokemonsPokedex() {
  let pokemonsGuardados: Array<Pokemon> = [];
  datosGenerales.VaciarListaPokemon();

  vaciarHtmlConId("resultado-busqueda");

  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    datosGenerales.listaPokemon.push(...pokemonsGuardados);
    funcionesStorage.cargarDreamTeamDesdeStorage();
    funcionesPokedex.ensenarCartas(pokemonsGuardados);

    pokemonsGuardados = [];
  }

  datosGenerales.quitarRepetidosListaPokemon();
}

export async function setPokemonsDreamTeam() {
  let pokemonsGuardados: Array<Pokemon> = [];
  datosGenerales.VaciarListaPokemon();

  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    datosGenerales.listaPokemon.push(...pokemonsGuardados);
    pokemonsGuardados = [];
  }
  funcionesStorage.cargarDreamTeamDesdeStorage();
  datosGenerales.quitarRepetidosListaPokemon();
}

async function obtenerGeneracion(id: number) {
  const promesas = [];
  let pokemonsAnteriores: number = sacarPokemonsAnteriores(id);
  try {
    for (
      let i = pokemonsAnteriores;
      i <=
      pokemonsAnteriores + datosGenerales.generaciones[id - 1].cantidadPokemon;
      i++
    ) {
      promesas.push(funcionesAPI.obtenerPokemon(String(i)));
    }

    const pokemons: Array<Pokemon> = await Promise.all(promesas);

    return pokemons;
  } catch (error) {
    vaciarHtmlConId("resultado-busqueda");
    mostrarHTML.mostrarErrorAPI();
    return [];
  }
}

export function vaciarHtmlConId(htmlId:string) {
  const container = document.getElementById(htmlId);
  if (container != null) {
    container.innerHTML = "";
  }
}

export function meterAlHtmlConId(htmlId:string, html:string) {
  const container = document.getElementById(htmlId);
  if (container != null) {
    container.innerHTML += html;
  }
}

function sacarPokemonsAnteriores(id: number) {
  let pokemonsAnteriores = 0;
  for (let i = 1; i < id; i++) {
    pokemonsAnteriores += datosGenerales.generaciones[i - 1].cantidadPokemon;
  }
  if (pokemonsAnteriores === 0) {
    return 1;
  }
  return pokemonsAnteriores + 1;
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

export function pokemonDentroDeLaLista(
  lista: Array<Pokemon>,
  pokemon: Pokemon,
) {
  return lista.some((p) => p.nombre === pokemon.nombre);
}

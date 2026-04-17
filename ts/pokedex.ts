import * as funciones from "./funciones-generales.js";
import * as funcionesDreamTeam from "./dream-team.js";
import type { Pokemon } from "./tipos";

export const tiposPokemon = [
  "grass",
  "bug",
  "electric",
  "fire",
  "water",
  "normal",
  "poison",
  "ground",
  "flying",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ghost",
  "ice",
  "dragon",
  "dark",
  "steel",
];

export const generaciones = [
  { id: 1, nombre: "Generación 1", cantidadPokemon: 151 },
  { id: 2, nombre: "Generación 2", cantidadPokemon: 100 },
  { id: 3, nombre: "Generación 3", cantidadPokemon: 135 },
  { id: 4, nombre: "Generación 4", cantidadPokemon: 107 },
  { id: 5, nombre: "Generación 5", cantidadPokemon: 156 },
  { id: 6, nombre: "Generación 6", cantidadPokemon: 72 },
  { id: 7, nombre: "Generación 7", cantidadPokemon: 81 },
  { id: 8, nombre: "Generación 8", cantidadPokemon: 89 },
  { id: 9, nombre: "Generación 9", cantidadPokemon: 103 },
];

export let listaPokemon: Array<Pokemon> = [];
let timeoutId: ReturnType<typeof window.setTimeout> | null = null;

if (!(import.meta as any).vitest) {
  if (window.location.pathname.endsWith("pokedex.html")) {
    main();
  }
}

function main() {
  funciones.mostrarCartasVacias();
  setPokemons("pokedex");
}

export async function setPokemons(containerId: string) {
  let pokemonsGuardados: Array<Pokemon> = [];
  listaPokemon = [];
  for (let i = 1; i <= 9; i++) {
    pokemonsGuardados.push(...(await obtenerGeneracion(i)));
    listaPokemon.push(...pokemonsGuardados);
    if (containerId === "pokedex") {
      funcionesDreamTeam.cargarDreamTeamDesdeStorage();
      ensenarCartas(pokemonsGuardados);
    }
    pokemonsGuardados = [];
  }
  if (containerId === "dreamTeam") {
    funcionesDreamTeam.cargarDreamTeamDesdeStorage();
  }
}

async function obtenerGeneracion(id: number) {
  const container = document.getElementById("resultado-busqueda");
  const promesas = [];
  let pokemonsAnteriores: number = sacarPokemonsAnteriores(id);
  try {
    for (
      let i = pokemonsAnteriores;
      i <= pokemonsAnteriores + generaciones[id - 1].cantidadPokemon - 1;
      i++
    ) {
      promesas.push(funciones.obtenerPokemon(i + ""));
    }

    const pokemons: Array<Pokemon> = await Promise.all(promesas);
    if (container != null && pokemonsAnteriores == 1) container.innerHTML = "";

    return pokemons;
  } catch (error) {
    if (container != null) container.innerHTML = "";
    funciones.ensenarErrorAPI();
    return [];
  }
}

function sacarPokemonsAnteriores(id: number) {
  let pokemonsAnteriores = 0;
  for (let i = 1; i < id; i++) {
    pokemonsAnteriores += generaciones[i - 1].cantidadPokemon;
  }
  if (pokemonsAnteriores == 0) {
    return 1;
  }
  return pokemonsAnteriores;
}

document.addEventListener("keyup", (e) => {
  const container = document.getElementById("resultado-busqueda");
  const target = e.target as HTMLInputElement;
  if (target != null && container != null) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      if (target.matches("#input-busqueda")) {
        const value = target.value;

        if (value === "") {
          container.innerHTML = "";
          ensenarCartas(listaPokemon);
        } else {
          const tipoDato = funciones.sacarTipoDato(value);
          container.innerHTML = "";
          switch (tipoDato) {
            case "tipo":
              filtraPorTipo(value);
              break;
            case "numero":
              filtraPorNumero(value);
              break;
            case "nombre":
              filtraPorNombre(value);
              break;
          }
        }
      }
    }, 1000);
  }
});

export function filtraPorTipo(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  ensenarCartas(filtrados);
  return filtrados;
}

export function filtraPorNumero(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }
    if (pokemon.numero.toString().includes(value)) {
      filtrados.push(pokemon);
    }
  });
  ensenarCartas(filtrados);
  return filtrados;
}

export function filtraPorNombre(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  ensenarCartas(filtrados);
  return filtrados;
}

function ensenarCartas(pokemons: Array<Pokemon>) {
  funcionesDreamTeam.cargarDreamTeamDesdeStorage();
  let html = "";
  const container = document.getElementById("resultado-busqueda");
  let gogokoa = false;
  if (pokemons.length === 0) {
    funciones.ensenarNoHayResultado();
  } else {
    pokemons.forEach((pokemon) => {
      if (funcionesDreamTeam.dreamTeam.includes(pokemon)) gogokoa = true;
      html += funciones.mostrarPokemon(pokemon, gogokoa);
      gogokoa = false;
    });
    if (container != null) {
      container.innerHTML += html;
    }
  }
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (
    target.classList.contains("icono-dream-team-interior") ||
    target.classList.contains("icono-dream-team-vector1") ||
    target.classList.contains("icono-dream-team-vector2")
  ) {
    const card = target.closest(".carta-pokemon") as HTMLElement;

    if (card) {
      const nombrePokemon = card.querySelector(".pokemon-name");
      if (nombrePokemon) {
        const nombrePokemonMinusculas = nombrePokemon.textContent.toLowerCase();

        const sumaDreamTeam = funcionesDreamTeam.sumarDreamTeam(
          nombrePokemonMinusculas,
        );
        const icono = card.getElementsByClassName(
          "icono-dream-team-vector2",
        )[0] as HTMLElement;

        switch (sumaDreamTeam) {
          case 0:
            if (icono) {
              icono.classList.add("activo");
            }
            console.log("Se ha añadido el pokemon");
            break;

          case 1:
            if (icono) {
              icono.classList.remove("activo");
            }
            console.log("Se ha borrado el pokemon");
            break;
        }
      }
    }
  } else if (
    target.classList.contains("carta-pokemon") ||
    target.classList.contains("pokemon-name") ||
    target.classList.contains("pokemon-image") ||
    target.classList.contains("pokemon-number") ||
    target.classList.contains("pokemon-info")
  ) {
    const card = target.closest(".carta-pokemon") as HTMLElement;

    if (card) {
      const nombrePokemon = card.querySelector(".pokemon-name");
      if (nombrePokemon) {
        irPanelPokemon(nombrePokemon.textContent.toLowerCase());
      }
    }
  }
});

function irPanelPokemon(id: string) {
  window.location.href = `panel-pokemon.html?pokemon=${id}`;
}

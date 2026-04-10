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
main();

function main() {
  funciones.mostrarCartasVacias();
  setPokemons();
}

export let listaPokemon: Array<Pokemon>;
let timeoutId: ReturnType<typeof window.setTimeout> | null = null;

async function obtenerPrimeraGeneracion() {
  const container = document.getElementById("resultado-busqueda");
  const promesas = [];
  try {
    for (let i = 1; i <= 151; i++) {
      promesas.push(funciones.obtenerPokemon(i + ""));
    }

    const pokemons: Array<Pokemon> = await Promise.all(promesas);
    ensenarCartas(pokemons);

    return pokemons;
  } catch (error) {
    if (container != null) container.innerHTML = "";
    funciones.ensenarErrorAPI();
    return [];
  }
}

async function setPokemons() {
  listaPokemon = await obtenerPrimeraGeneracion();
}

function formatearNumero(numero: number) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
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
          ensenarCartas(listaPokemon);
        } else {
          const tipoDato = funciones.sacarTipoDato(value);
          container.innerHTML += "";
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

function filtraPorTipo(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  ensenarCartas(filtrados);
}

function filtraPorNumero(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }

    if (pokemon.numero.toString().includes(value)) {
      filtrados.push(pokemon);
    }
    ensenarCartas(filtrados);
  });
}

function filtraPorNombre(value: string) {
  const filtrados: Array<Pokemon> = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
    ensenarCartas(filtrados);
  });
}

function ensenarCartas(pokemons: Array<Pokemon>) {
  const container = document.getElementById("resultado-busqueda");
  if (container != null) container.innerHTML = "";
  if (pokemons.length === 0) {
    funciones.ensenarNoHayResultado();
  } else {
    pokemons.forEach((pokemon) => {
      funciones.mostrarPokemon(pokemon, "resultado-busqueda");
    });
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
  } else if (target.classList.contains("carta-pokemon") || target.classList.contains("pokemon-name") || target.classList.contains("pokemon-image") || target.classList.contains("pokemon-number") || target.classList.contains("pokemon-info")) {
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

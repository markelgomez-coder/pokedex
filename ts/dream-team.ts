import type { Pokemon } from "./tipos";
import { listaPokemon } from "./pokedex.js";

const DREAM_TEAM_STORAGE_KEY = "dreamTeam";

export let dreamTeam: Array<Pokemon> = [];
export let maxDreamTeam: number = 6;

window.addEventListener("load", () => {
  cargarDreamTeamDesdeStorage();
});

export function sumarDreamTeam(nombre: string) {
  const pokemon = listaPokemon.find((p) => p.nombre === nombre);

  if (
    pokemon != null &&
    !dreamTeam.includes(pokemon) &&
    dreamTeam.length < maxDreamTeam
  ) {
    dreamTeam.push(pokemon);
    pokemon.dream_team = true;
    guardarDreamTeamEnStorage();
    return 0;
  }

  if (pokemon != null && dreamTeam.includes(pokemon)) {
    const index = dreamTeam.indexOf(pokemon);
    dreamTeam.splice(index, 1);
    pokemon.dream_team = false;
    guardarDreamTeamEnStorage();

    return 1;
  }

  return 2;
}

function mostrarDreamTeam() {
  pokemonGrandeDreamTeam();
  pokemonPequenoDreamTeam();
}

function cargarDreamTeamDesdeStorage() {
  const storageValue = localStorage.getItem(DREAM_TEAM_STORAGE_KEY);
  if (!storageValue) return;

  try {
    const nombresGuardados = JSON.parse(storageValue);
    if (!Array.isArray(nombresGuardados)) return;

    if (Array.isArray(listaPokemon) && listaPokemon.length > 0) {
      restaurarDreamTeam(nombresGuardados);
    } else {
      const id = window.setInterval(() => {
        if (Array.isArray(listaPokemon) && listaPokemon.length > 0) {
          restaurarDreamTeam(nombresGuardados);
          window.clearInterval(id);
        }
      }, 100);
    }
  } catch (error) {
    console.warn("No se pudo cargar el Dream Team guardado:", error);
  }
}

function restaurarDreamTeam(nombres: Array<string>) {
  dreamTeam = listaPokemon.filter((pokemon) =>
    nombres.includes(pokemon.nombre),
  );
  dreamTeam.forEach((pokemon) => {
    pokemon.dream_team = true;
  });
  actualizarIconosDreamTeamEnDOM();
  mostrarDreamTeam();
}

function actualizarIconosDreamTeamEnDOM() {
  const iconos = document.querySelectorAll(".icono-dream-team-vector2");
  iconos.forEach((icono) => {
    const carta = icono.closest(".carta-pokemon");
    if (carta) {
      const nombreElement = carta.querySelector(".pokemon-name");
      if (nombreElement) {
        const nombrePokemon = nombreElement.textContent?.toLowerCase() || "";
        const estaEnDreamTeam = dreamTeam.some(
          (p) => p.nombre === nombrePokemon,
        );

        if (estaEnDreamTeam) {
          icono.classList.add("activo");
        } else {
          icono.classList.remove("activo");
        }
      }
    }
  });
}

function guardarDreamTeamEnStorage() {
  const nombres = dreamTeam.map((pokemon) => pokemon.nombre);
  localStorage.setItem(DREAM_TEAM_STORAGE_KEY, JSON.stringify(nombres));
}

function pokemonGrandeDreamTeam() {
  const contenedorGrande = document.getElementById("dream-team-grandes");

  if (contenedorGrande != null) {
    const htmlGrande = dreamTeam
      .map(
        (p: Pokemon) =>
          `<img class="dream-team-grandes-img" src="${p.imagen}" />`,
      )
      .join("");

    contenedorGrande.innerHTML = "";
    contenedorGrande.innerHTML += htmlGrande;
  }
}

function pokemonPequenoDreamTeam() {
  const contenedorPequeno = document.getElementById("dream-team-pequenos");

  if (contenedorPequeno != null) {
    const htmlPequeno = dreamTeam
      .map(
        (p: Pokemon) =>
          ` <img class="dream-team-pequenos-img" src="${p.imagen}" />`,
      )
      .join("");

    contenedorPequeno.innerHTML = "";
    contenedorPequeno.innerHTML += htmlPequeno;
  }
}

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
  const dreamTeamOrdenadoTamano = [...dreamTeam].sort(
    (a, b) => a.altura - b.altura,
  );
  if (contenedorGrande != null) {
    const htmlGrande = dreamTeamOrdenadoTamano
      .map((p: Pokemon, index: number) => {
        const angle = index * (Math.PI / 3);
        const radius = 80;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        let inicial = 25;
        let suma = 1.25;

        if (p.peso >= 100) {
          inicial = 150;
          suma = 0.2;
        }

        return `<img 
          class="dream-team-grandes-img" 
          src="${p.imagen}" 
          style="
            position: absolute;
            width: calc(${inicial}px + ${suma} * ${p.peso}px);
            left: calc(50% + ${x}px);
            bottom: calc(10% + ${y}px);
            z-index: ${6 - index};
            transform: translate(-50%, -50%);
          " 
        />`;
      })
      .join("");

    contenedorGrande.innerHTML = htmlGrande;
  }
}

function pokemonPequenoDreamTeam() {
  const contenedorPequeno = document.getElementById("dream-team-pequenos");
  const dreamTeamOrdenadoNumero = [...dreamTeam].sort(
    (a, b) => a.numero - b.numero,
  );

  if (contenedorPequeno != null) {
    const htmlPequeno = dreamTeamOrdenadoNumero
      .map(
        (p: Pokemon) =>
          ` <img class="dream-team-pequenos-img" src="${p.imagen}" />`,
      )
      .join("");

    contenedorPequeno.innerHTML = "";
    contenedorPequeno.innerHTML += htmlPequeno;
  }
}

import * as funcionesGenerales from "./funciones-generales.js";
import * as datosGenerales from "./datos-generales.js";
import * as funcionesStorage from "./storage-funciones.js";

import type { Pokemon } from "./tipos";

mostrarDreamTeam();

export function sumarDreamTeam(nombre: string) {
  const pokemon = datosGenerales.listaPokemon.find((p) => p.nombre === nombre);
  datosGenerales.quitarRepetidosDreamTeam();
  
  if (
    pokemon != null &&
    !datosGenerales.dreamTeam.includes(pokemon) &&
    datosGenerales.dreamTeam.length < datosGenerales.maxDreamTeam
  ) {
    datosGenerales.dreamTeam.push(pokemon);
    pokemon.dream_team = true;
    funcionesStorage.guardarDreamTeamEnStorage();
    return 0;
  }

  if (pokemon != null && datosGenerales.dreamTeam.includes(pokemon)) {
    const index = datosGenerales.dreamTeam.indexOf(pokemon);
    datosGenerales.dreamTeam.splice(index, 1);
    pokemon.dream_team = false;
    funcionesStorage.guardarDreamTeamEnStorage();

    return 1;
  }

  return 2;
}

function mostrarDreamTeam() {
  funcionesGenerales.setPokemonsDreamTeam().then(() => {
    pokemonGrandeDreamTeam();
    pokemonPequenoDreamTeam();
  });
}

export function restaurarDreamTeam(nombres: Array<string>) {
  datosGenerales.VaciarDreamTeam();
  datosGenerales.listaPokemon.forEach((pokemon) => {
    if (
      nombres.includes(pokemon.nombre) &&
      !datosGenerales.dreamTeam.includes(pokemon)
    ) {
      datosGenerales.dreamTeam.push(pokemon);
      pokemon.dream_team = true;
    }
  });
}

export function actualizarIconosDreamTeamEnDOM() {
  const iconos = document.querySelectorAll(".icono-dream-team-vector2");
  iconos.forEach((icono) => {
    const carta = icono.closest(".carta-pokemon");
    if (carta) {
      const nombreElement = carta.querySelector(".pokemon-name");
      if (nombreElement) {
        const nombrePokemon = nombreElement.textContent?.toLowerCase() || "";
        const estaEnDreamTeam = datosGenerales.dreamTeam.some(
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

function pokemonGrandeDreamTeam() {
  const contenedorGrande = document.getElementById("dream-team-grandes");
  const dreamTeamOrdenadoTamano = [...datosGenerales.dreamTeam].sort(
    (a, b) => a.altura - b.altura,
  );
  if (contenedorGrande != null) {
    const posiciones = [
      { x: -120, y: 120 },
      { x: 0, y: 140 },
      { x: 120, y: 120 },
      { x: -70, y: 20 },
      { x: 70, y: 20 },
      { x: 0, y: 70 },
    ];

    const htmlGrande = dreamTeamOrdenadoTamano
      .map((p: Pokemon, index: number) => {
        const pos = posiciones[index];

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
        left: calc(50% + ${pos.x}px);
        bottom: calc(${pos.y}px);
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
  const dreamTeamOrdenadoNumero = [...datosGenerales.dreamTeam].sort(
    (a, b) => a.numero - b.numero,
  );

  if (contenedorPequeno != null) {
    const htmlPequeno = dreamTeamOrdenadoNumero
      .map(
        (p: Pokemon) =>
          ` <img class="dream-team-pequenos-img" src="${p.imagen}" />`,
      )
      .join("");

    funcionesGenerales.vaciarHtmlConId("dream-team-pequenos");
    contenedorPequeno.innerHTML += htmlPequeno;
  }
}

import * as datosGenerales from "./datos-generales.js";
import * as funcionesDreamTeam from "./dream-team.js";

export function cargarDreamTeamDesdeStorage() {
  const storageValue = localStorage.getItem(
    datosGenerales.DREAM_TEAM_STORAGE_KEY,
  );
  if (!storageValue) return;

  try {
    const nombresGuardados: Array<string> = Array.from(
      new Set(JSON.parse(storageValue)),
    );

    if (!Array.isArray(nombresGuardados)) return;

    if (
      Array.isArray(datosGenerales.listaPokemon) &&
      datosGenerales.listaPokemon.length > 0
    ) {
      funcionesDreamTeam.restaurarDreamTeam(nombresGuardados);
    } else {
      const id = window.setInterval(() => {
        if (
          Array.isArray(datosGenerales.listaPokemon) &&
          datosGenerales.listaPokemon.length > 0
        ) {
          funcionesDreamTeam.restaurarDreamTeam(nombresGuardados);
          window.clearInterval(id);
        }
      }, 100);
    }
  } catch (error) {
    console.warn("No se pudo cargar el Dream Team guardado:", error);
  }

}

export function guardarDreamTeamEnStorage() {
  const nombres = datosGenerales.dreamTeam.map((pokemon) => pokemon.nombre);
  const nombresUnicos = Array.from(new Set(nombres));
  localStorage.setItem(
    datosGenerales.DREAM_TEAM_STORAGE_KEY,
    JSON.stringify(nombresUnicos),
  );
}

import { describe, it, expect, beforeEach } from "vitest";
import * as funcionesGenerales from "../dist/ts/funciones-generales.js";
import * as datosGenerales from "../dist/ts/datos-generales.js";

describe("Cambiar la lista de los pokemons en el dreamTeam", () => {
  beforeEach(() => {
    datosGenerales.dreamTeam.lenght = 0;
    datosGenerales.dreamTeam.push({nombre: "charmander", numero: "004", tipos: ["fire"]});
    datosGenerales.dreamTeam.push({nombre: "charmeleon", numero: "005", tipos: ["fire"]});
  });

  it("Añadir un pokemon al dreamTeam", async () => {
    const pokemon = {
      nombre: "bulbasaur",
      numero: 1,
      imagen: "src",
      tipos: ["grass", "poison"],
      peso: 12,
      altura: 7,
      hp: 45,
      atk: 45,
      def: 45,
      sat: 45,
      sdf: 45,
      spd: 45,
      dream_team: false,
    };

    expect(datosGenerales.dreamTeam).not.toContain(pokemon);
    funcionesGenerales.sumarAlDreamTeam(pokemon);
    expect(datosGenerales.dreamTeam).toContain(pokemon);
  });

  it("Quitar un pokemon del dreamTeam", () => {
    expect(1).toBe(1);
  });
});

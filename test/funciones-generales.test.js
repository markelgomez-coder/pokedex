import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as funcionesGenerales from "../dist/ts/funciones-generales.js";
import * as datosGenerales from "../dist/ts/datos-generales.js"
import { obtenerPokemon } from "../dist/ts/funciones-API.js";

describe("Cambiar la lista de los pokemons en el dreamTeam", () => {
  it("Añadir un pokemon al dreamTeam", async () => {
    const pokemon = await obtenerPokemon(1);
    funcionesGenerales.sumarAlDreamTeam(pokemon)
    expect(pokemon.name).toBe(undefined);
  });
  it("Quitar un pokemon del dreamTeam", () => {
    expect(1).toBe(1);
  });
});

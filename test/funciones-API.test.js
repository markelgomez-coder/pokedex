import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as funcionesGenerales from "../dist/ts/funciones-generales.js";
import * as funcionesAPI from "../dist/ts/funciones-API.js";

describe("Hacer fetch", () => {
  it("El fetch se hace correctamente",
    async () => {
      const url = "https://pokeapi.co/api/v2/pokemon/1";
      const resultado = "bulbasaur";
      const result = await funcionesAPI.hacerFetch(url);

      expect(result.name).toBe(resultado)
    });
});

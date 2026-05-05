import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as funcionesGenerales from "../dist/ts/funciones-generales.js";
import * as funcionesAPI from "../dist/ts/funciones-API.js";

describe("Hacer fetch", () => {
  (it("El fetch se hace correctamente"),
    () => {
      const url = "https://pokeapi.co/api/v2/pokemon/1";
      const resultado = "";
      const result = funcionesAPI.hacerFetch(url);

      expect(result).toBe(resultado);
    });
});

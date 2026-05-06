import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import * as funcionesAPI from "../dist/ts/funciones-API.js";

describe("Hacer fetch", () => {
  beforeAll(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({ name: "bulbasaur" }),
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("El fetch se hace correctamente", async () => {
    const url = "https://pokeapi.co/api/v2/pokemon/1";
    const result = await funcionesAPI.hacerFetch(url);

    expect(result.name).toBe("bulbasaur");
  });
});

describe("Obtener diferentes datos de la API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Obtener pokemon", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({
        name: "bulbasaur",
        id: 1,
        sprites: {
          other: { "official-artwork": { front_default: "img.png" } },
        },
        types: [{ type: { name: "grass" } }],
        weight: 100,
        height: 10,
        stats: [
          { base_stat: 45 },
          { base_stat: 49 },
          { base_stat: 49 },
          { base_stat: 65 },
          { base_stat: 65 },
          { base_stat: 45 },
        ],
      }),
    });

    const result = await funcionesAPI.obtenerPokemon(1);

    expect(result.nombre).toBe("bulbasaur");
  });
  it("Obtener descripcion del pokemon", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: async () => ({
        flavor_text: "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.",
      }),
    });
    const result = await funcionesAPI.obtenerPokemonDescripcion(1);

    expect(result).toBe("A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.")
  });
  it("Obtener tipos del pokemon", () => {});
  it("Obtener links de la eficacia ante diferentes tipos de pokemon", () => {});
  it("Obtener tipos a los que es debil el pokemon", () => {});
  it("Obtener tipos a los que resiste el pokemon", () => {});
  it("Obtener tipos a los que es inmune el pokemon", () => {});
  it("Obtener evoluciones del pokemon", () => {});
});

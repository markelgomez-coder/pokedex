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

vi.mock("../dist/ts/fetch.js", () => ({
  hacerFetch: vi.fn(),
}));

import * as funcionesAPI from "../dist/ts/funciones-API.js";
import { hacerFetch } from "../dist/ts/fetch.js";


describe("Obtener diferentes datos de la API", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Obtener pokemon", async () => {
    hacerFetch.mockResolvedValue({
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
    });

    const result = await funcionesAPI.obtenerPokemon(1);

    expect(result.nombre).toBe("bulbasaur");
  });

  it("Obtener descripcion del pokemon", async () => {
    hacerFetch.mockResolvedValue({
      flavor_text_entries: [
        {
          flavor_text:
            "A strange seed was planted on its back at birth.\nThe plant sprouts and grows with this POKéMON.",
          language: { name: "en" },
        },
      ],
    });

    const result = await funcionesAPI.obtenerPokemonDescripcion(1);

    expect(result).toBe(
      "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.",
    );
  });
  it("Obtener tipos del pokemon", () => {});
  it("Obtener links de la eficacia ante diferentes tipos de pokemon", () => {});
  it("Obtener tipos a los que es debil el pokemon", () => {});
  it("Obtener tipos a los que resiste el pokemon", () => {});
  it("Obtener tipos a los que es inmune el pokemon", () => {});
  it("Obtener evoluciones del pokemon", () => {});
});

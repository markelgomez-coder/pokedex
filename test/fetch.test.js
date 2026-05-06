import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { hacerFetch } from "../dist/ts/fetch.js";

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
    const result = await hacerFetch("https://pokeapi.co/api/v2/pokemon/1");

    expect(result.name).toBe("bulbasaur");
  });
});
import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as funcionesPanel from "../dist/ts/panel-pokemon.js";
import * as funciones from "../dist/ts/funciones-generales.js";

describe("El panel muestra el pokemon", () => {
  it("Recoge bien el nombre del pokemon del url", () => {
    const url = "http://localhost:3000/panel-pokemon.html?pokemon=bulbasaur";
    const params = new URL(url).searchParams;
    const pokemon = params.get("pokemon");

    expect(pokemon).toBe("bulbasaur");
  });

  it("Recoge bien el numero del pokemon del url", () => {
    const url = "http://localhost:3000/panel-pokemon.html?pokemon=1";

    const params = new URL(url).searchParams;
    const pokemon = { numero: params.get("pokemon"), nombre: "bulbasaur" };

    expect(pokemon.nombre).toBe("bulbasaur");
  });
});

describe("El panel muestra el panel de la derecha", () => {
  it("Recoge bien la descripcion del pokemon", async () => {
    const descripcion =
      "A strange seed was planted on its back at birth. The plant sprouts and grows with this POKéMON.";

    const result = await funciones.obtenerPokemonDescripcion("1");
    
    expect(result).toBe(descripcion);
  });
  it("Recoge bien las evoluciones del pokemon", async() => {
    const evoluciones = [
      { numero: 1, nombre: "bulbasaur" },
      { numero: 2, nombre: "ivysaur" },
      { numero: 3, nombre: "venusaur" },
    ];

    const link = await funciones.obtenerPokemonEvolucionesLink("1");
    const result = await funciones.obtenerPokemonEvoluciones(link);

    for (let i = 0; i < evoluciones.length; i++) {
      expect(result[i].numero).toBe(evoluciones[i].numero);
      expect(result[i].nombre).toBe(evoluciones[i].nombre);
    } 
  });
  it("Recoge bien las debilidades del pokemon", async () => {
    const debilidad = ["grass", "electric"];

    const result = await funciones.obtenerDebilidadPokemon("7");

    for (let i = 0; i < debilidad.length; i++) {
      expect(result[i].name).toBe(debilidad[i]);
    }
  });
  it("Recoge bien las resistencias del pokemon", async () => {
    const resistencias = ["steel", "fire", "water", "ice"];

    const result = await funciones.obtenerResistenciaPokemon("7");

    for (let i = 0; i < resistencias.length; i++) {
      expect(result[i].name).toBe(resistencias[i]);
    }
  });
    it("Recoge bien las inmunidades del pokemon", async () => {
    const inmunidades = ["psychic", "ground"];

    const result = await funciones.obtenerInmunidadPokemon("993");

    for (let i = 0; i < inmunidades.length; i++) {
      expect(result[i].name).toBe(inmunidades[i]);
    }
  });
});

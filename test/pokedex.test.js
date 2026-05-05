import { describe, it, expect, beforeEach, vi } from "vitest";
import * as funcionesPokedex from "../dist/ts/pokedex.js";

vi.mock("../dist/ts/datos-generales.js", async (importOriginal) => {
  const actual = await importOriginal();

  const listaPokemonMock = [
    { nombre: "bulbasaur", numero: "001", tipos: ["grass"] },
    { nombre: "charmander", numero: "004", tipos: ["fire"] },
    { nombre: "charmeleon", numero: "005", tipos: ["fire"] },
    { nombre: "charizard", numero: "006", tipos: ["fire", "flying"] },
    { nombre: "squirtle", numero: "007", tipos: ["water"] },
    { nombre: "pikachu", numero: "025", tipos: ["electric"] },
    { nombre: "raichu", numero: "026", tipos: ["electric"] },
  ];

  return {
    ...actual,
    listaPokemon: listaPokemonMock,
  };
});

const listaPokemonMock = [
  { nombre: "bulbasaur", numero: "001", tipos: ["grass"] },
  { nombre: "charmander", numero: "004", tipos: ["fire"] },
  { nombre: "charmeleon", numero: "005", tipos: ["fire"] },
  { nombre: "charizard", numero: "006", tipos: ["fire", "flying"] },
  { nombre: "squirtle", numero: "007", tipos: ["water"] },
  { nombre: "pikachu", numero: "025", tipos: ["electric"] },
  { nombre: "raichu", numero: "026", tipos: ["electric"] },
];

beforeEach(() => {
  document.body.innerHTML = `
    <input id="input-busqueda" value="" />
    <div id="resultado-busqueda"></div>
  `;
});

describe("Escribes algo correcto en el buscador", () => {
  it("Deja vacío el buscador (devuelve todos los Pokémon)", () => {
    const busqueda = "";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    expect(result).toEqual(listaPokemonMock);

    console.log(result);
  });

  it("Pone un nombre o parte del nombre", () => {
    const busqueda = "cha";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.nombre).toContain(busqueda);
    });

    console.log(result);
  });

  it("Pone un tipo de pokemon en el buscador", () => {
    const busqueda = "grass";

    const result = funcionesPokedex.filtraPorTipo(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.tipos).toContain(busqueda);
    });

    console.log(result);
  });

  it("Pone un número sin #", () => {
    const busqueda = "02";

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busqueda);
    });

    console.log(result);
  });

  it("Pone un número con #", () => {
    const busqueda = "#02";
    const busquedaSinHash = busqueda.replace("#", "");

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    expect(result.length).toBeGreaterThan(0);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busquedaSinHash);
    });
    console.log(result);
  });
});

describe("Escribes algo incorrecto en el buscador", () => {
  it("Nombre o texto que no existe", () => {
    const busqueda = "xyz";
    const input = document.getElementById("input-busqueda");

    if (input) input.value = busqueda;

    const filtro = funcionesPokedex.filtraPorNombre(busqueda);
    const result = document.getElementById("resultado-busqueda");

    expect(filtro).toEqual([]);
    expect(result).not.toBeNull();
    expect(result.innerHTML).toContain(`There is no results for "${busqueda}"`);
    console.log(result);
  });
});

import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import * as funcionesPokedex from "../dist/ts/pokedex.js";
import { listaPokemon } from "../dist/ts/pokedex.js";

beforeAll(() => {
  listaPokemon.length = 0;

  listaPokemon.push(
    { nombre: "bulbasaur", numero: "001", tipos: ["grass"] },
    { nombre: "charmander", numero: "004", tipos: ["fire"] },
    { nombre: "charmeleon", numero: "005", tipos: ["fire"] },
    { nombre: "charizard", numero: "006", tipos: ["fire", "flying"] },
    { nombre: "squirtle", numero: "007", tipos: ["water"] },
    { nombre: "pikachu", numero: "025", tipos: ["electric"] },
    { nombre: "raichu", numero: "026", tipos: ["electric"] },
  );
});

beforeEach(() => {
  document.body.innerHTML = `
    <input id="input-busqueda" value="" />
    <div id="resultado-busqueda"></div>
  `;
});

describe("Escribes algo correcto en el busacador", () => {

    it("Deja vacio el buscador", () => {
    const busqueda = "";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    console.log(`Resultado de la busqueda (${busqueda}):`, result);

    expect(result).toEqual(listaPokemon);
  });

  it("Pone un nombre o parte del nombre", () => {
    const busqueda = "cha";

    const result = funcionesPokedex.filtraPorNombre(busqueda);

    console.log(`Resultado de la busqueda (${busqueda}):`, result);

    result.forEach((pokemon) => {
      expect(pokemon.nombre).toContain(busqueda);
    });
  });

  it("Pone un tipo de pokemon en el buscador", () => {
    const busqueda = "grass";

    const result = funcionesPokedex.filtraPorTipo(busqueda);

    console.log(`Resultado de la busqueda (${busqueda}):`, result);

    result.forEach((pokemon) => {
      expect(pokemon.tipos).toContain(busqueda);
    });
  });

  it("Pone un numero sin #", () => {
    const busqueda = "02";

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    console.log(`Resultado de la busqueda (${busqueda}):`, result);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busqueda);
    });
  });

  it("Pone un numero con #", () => {
    const busqueda = "#02";
    const busquedaSinHash = busqueda.replace("#", "");

    const result = funcionesPokedex.filtraPorNumero(busqueda);

    console.log(`Resultado de la busqueda (${busqueda}):`, result);

    result.forEach((pokemon) => {
      expect(pokemon.numero).toContain(busquedaSinHash);
    });
  });
});

describe("Escribes algo incorrecto en el busacador", () => {

  it("Pone un nombre o parte del nombre que no existe", () => {
    const busqueda = "xyz";
    const input = document.getElementById("input-busqueda");
    if (input) input.value = busqueda;

    const filtro = funcionesPokedex.filtraPorNombre(busqueda);
    const result = document.getElementById("resultado-busqueda");

    expect(filtro).toEqual([]);
    expect(result).not.toBeNull();
    expect(result?.innerHTML).toContain(`There is no results for "${busqueda}"`);
  });
});
import type { Pokemon, TipoPokemon, DanoPokemon, FlavorTextEntry, EvolutionNode } from "./tipos";

export async function obtenerPokemon(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const pokemon = {
    nombre: data.name,
    numero: data.id,
    imagen: data.sprites.other["official-artwork"].front_default,
    tipos: data.types.map((t: TipoPokemon) => t.type.name),
    peso: data.weight / 10,
    altura: data.height / 10,
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    sat: data.stats[3].base_stat,
    sdf: data.stats[4].base_stat,
    spd: data.stats[5].base_stat,
    dream_team: false,
  };
  console.log(pokemon);
  console.log(data);
  return pokemon;
}

export async function obtenerPokemonDescripcion(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const englishEntry = data.flavor_text_entries.find(
    (entry: FlavorTextEntry) => entry.language.name === "en",
  );
  return englishEntry.flavor_text.replace(/[\n\f]/g, " ");
}

export async function obtenerPokemonTipos(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const pokemon_tipos = {
    tipos: data.types.map((t: TipoPokemon) => t.type.name),
    tipos_url: data.types.map((t: TipoPokemon) => t.type.url),
  };
  return pokemon_tipos;
}

export async function obtenerEficaciaPokemon(url: string) {
  const res = await fetch(url);
  const data = await res.json();

  return {
    doble_dano: data.damage_relations.double_damage_from as DanoPokemon[],
    mitad_dano: data.damage_relations.half_damage_from as DanoPokemon[],
    no_dano: data.damage_relations.no_damage_from as DanoPokemon[],
  };
}

export async function obtenerDebilidadPokemon(
  id: string,
): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let dobleDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    dobleDanoTotales = dobleDanoTotales.concat(debilidades.doble_dano);
  }

  const unique = Array.from(
    new Map(dobleDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unique;
}

export async function obtenerResistenciaPokemon(
  id: string,
): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let mitadDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    mitadDanoTotales = mitadDanoTotales.concat(debilidades.mitad_dano);
  }

  const unique = Array.from(
    new Map(mitadDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unique;
}

export async function obtenerInmunidadPokemon(id: string): Promise<DanoPokemon[]> {
  const tiposData = await obtenerPokemonTipos(id);
  let noDanoTotales: DanoPokemon[] = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerEficaciaPokemon(url);
    noDanoTotales = noDanoTotales.concat(debilidades.no_dano);
  }

  const unique = Array.from(
    new Map(noDanoTotales.map((d) => [d.name, d])).values(),
  );
  return unique;
}

export async function obtenerPokemonEvolucionesLink(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.evolution_chain.url;
}

export async function obtenerPokemonEvoluciones(
  url: string,
): Promise<Pokemon[]> {
  const res = await fetch(url);
  const data = await res.json();

  const evoluciones = await extraerEvoluciones(data.chain);
  return evoluciones;
}

export async function extraerEvoluciones(
  chain: EvolutionNode,
): Promise<Pokemon[]> {
  const resultado: Pokemon[] = [];

  async function recorrer(nodo: EvolutionNode) {
    const pokemon = await obtenerPokemon(nodo.species.name);
    resultado.push(pokemon);

    for (const evo of nodo.evolves_to) {
      await recorrer(evo);
    }
  }

  await recorrer(chain);
  return resultado;
}
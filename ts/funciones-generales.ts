import type { Pokemon } from "./tipos";
import type { TipoPokemon } from "./tipos";
import type { DanoPokemon } from "./tipos";
import { tiposPokemon } from "./pokedex.js"; 

export async function obtenerPokemon(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const pokemon = {
    nombre: data.name,
    numero: data.id,
    imagen: data.sprites.other["official-artwork"].front_default,
    tipos: data.types.map((t: TipoPokemon) => t.type.nombre),
    peso: data.weight,
    altura: data.height,
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    sat: data.stats[3].base_stat,
    sdf: data.stats[4].base_stat,
    spd: data.stats[5].base_stat,
  };
  console.log(pokemon);
  console.log(data);
  return pokemon;
}

export async function obtenerPokemonTipos(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const pokemon_tipos = {
    tipos: data.types.map((t: TipoPokemon) => t.type.nombre),
    tipos_url: data.types.map((t: TipoPokemon) => t.type.url),
  };
  return pokemon_tipos;
}

export async function obtenerPokemonDebilidades(url: string) {
  const res = await fetch(url);
  const data = await res.json();

  const pokemon_debilidades = {
    doble_dano: data.damage_relations.double_damage_from.map(
      (d: DanoPokemon) => d.nombre,
    ),
    mitad_dano: data.damage_relations.half_damage_from.map(
      (d: DanoPokemon) => d.nombre,
    ),
    no_dano: data.damage_relations.no_damage_from.map(
      (d: DanoPokemon) => d.nombre,
    ),
  };
  return pokemon_debilidades;
}

export async function obtenerDobleDanoPokemon(id:string) {
  const tiposData = await obtenerPokemonTipos(id);

  let dobleDanoTotales: Array<DanoPokemon> = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerPokemonDebilidades(url);

    dobleDanoTotales = dobleDanoTotales.concat(debilidades.doble_dano);
  }

  return [...new Set(dobleDanoTotales)];
}

export async function obtenerMitadDanoPokemon(id:string) {
  const tiposData = await obtenerPokemonTipos(id);

  let mitadDanoTotales: Array<DanoPokemon> = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerPokemonDebilidades(url);

    mitadDanoTotales = mitadDanoTotales.concat(debilidades.mitad_dano);
  }

  return [...new Set(mitadDanoTotales)];
}

export async function obtenerNoDanoPokemon(id:string) {
  const tiposData = await obtenerPokemonTipos(id);

  let noDanoTotales: Array<DanoPokemon> = [];

  for (const url of tiposData.tipos_url) {
    const debilidades = await obtenerPokemonDebilidades(url);

    noDanoTotales = noDanoTotales.concat(debilidades.no_dano);
  }

  return [...new Set(noDanoTotales)];
}

export async function obtenerPokemonDescripcion(id:string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const englishEntry = data.flavor_text_entries.find(
    (entry:any) => entry.language.name === "en",
  );
  return englishEntry.flavor_text.replace(/[\n\f]/g, " ");
}
export async function obtenerPokemonEvolucionesLink(id:string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.evolution_chain.url;
}

export async function obtenerPokemonEvoluciones(url:string) {
  const res = await fetch(url);
  const data = await res.json();

  return extraerEvoluciones(data.chain);
}

export function extraerEvoluciones(chain:any) {
  const resultado:Array<Pokemon> = [];

  function recorrer(nodo:any) {
    resultado.push(nodo.species.name);
    nodo.evolves_to.forEach((evo:any) => recorrer(evo));
  }

  recorrer(chain);
  return resultado;
}

export function sacarTipoDato(value:string) {
  value = value.toLowerCase().trim();

  if (tiposPokemon.includes(value)) {
    return "tipo";
  }
  if (/^#?\d+$/.test(value)) {
    return "numero";
  }
  return "nombre";
}

export function formatearNumero(numero:number) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
}

export function mostrarCartasVacias() {
  const container = document.getElementById("resultado-busqueda");

  if (container != null) {
    container.innerHTML = "";

    let vaciasHtml = "";

    for (let i = 0; i < 9; i++) {
      vaciasHtml += `
      <div class="carta-pokemon-vacia">
        <div class="carta-pokemon-vacia-interior"> 
          <div class="carta-pokemon-vacia-icono-interior">
            <div class="carta-pokemon-vacia-icono-interior-circulo-fuera"></div>
            <div class="carta-pokemon-vacia-icono-interior-circulo-dentro"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-derecha"></div>
            <div class="carta-pokemon-vacia-icono-interior-linea-izquierda"></div>
          </div>
        </div>
      </div>
      `;
    }

    container.innerHTML = vaciasHtml;
  }
}

export function mostrarPokemonSinLink(pokemon: Pokemon, lugar: string) {
  const container = document.getElementById(lugar);

  if (container != null)
    container.innerHTML += `
            <div class="carta-pokemon ${pokemon.tipos[0]}">
              <header>
              <p class="pokemon-name">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</p>
              <p class="pokemon-number">${formatearNumero(pokemon.numero)}</p>
            </header>
            <img
              class="pokemon-image"
              src="${pokemon.imagen}"
              alt="Imagen ${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}"
            />
            <div class="pokemon-info">
              <div class="tipo-pokemon">
                ${pokemon.tipos
                  .map(
                    (tipo) => `
                  <div class="icono-tipo ${tipo}">
                    <p class="texto-tipo">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                  </div>`,
                  )
                  .join("")}
              </div>
              <div class="medidas-pokemon">
                <div class="icono-peso"></div>
                <p>${pokemon.peso} Kg</p>
                <div class="separador-tipos"></div>
                <div class="icono-altura"></div>
                <p>${pokemon.altura} m</p>
              </div>
              <div class="estadisticas-pokemon">
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">HP</p>
                    <p class="estadistica-valor">${pokemon.hp}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.hp / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">ATK</p>
                    <p class="estadistica-valor">${pokemon.atk}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.atk / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">DEF</p>
                    <p class="estadistica-valor">${pokemon.def}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.def / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SAT</p>
                    <p class="estadistica-valor">${pokemon.sat}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sat / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SDF</p>
                    <p class="estadistica-valor">${pokemon.sdf}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sdf / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SPD</p>
                    <p class="estadistica-valor">${pokemon.spd}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.spd / 255) - 16 + "px"}"></div>
                </div>
              </div>
            </div>
            `;
}
export function mostrarPokemonConLink(pokemon: Pokemon, lugar: string) {
  const container = document.getElementById(lugar);
  if (container != null)
    container.innerHTML += `
      <a class="carta-pokemon ${pokemon.tipos[0]}" href="panel-pokemon.html?pokemon=${pokemon.nombre}">
            <header>
              <p class="pokemon-name">${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}</p>
              <p class="pokemon-number">${formatearNumero(pokemon.numero)}</p>
            </header>
            <img
              class="pokemon-image"
              src="${pokemon.imagen}"
              alt="Imagen ${pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1)}"
            />
            <div class="pokemon-info">
              <div class="tipo-pokemon">
                ${pokemon.tipos
                  .map(
                    (tipo) => `
                  <div class="icono-tipo ${tipo}">
                    <p class="texto-tipo">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</p>
                  </div>`,
                  )
                  .join("")}
              </div>
              <div class="medidas-pokemon">
                <div class="icono-peso"></div>
                <p>${pokemon.peso} Kg</p>
                <div class="separador-tipos"></div>
                <div class="icono-altura"></div>
                <p>${pokemon.altura} m</p>
              </div>
              <div class="estadisticas-pokemon">
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">HP</p>
                    <p class="estadistica-valor">${pokemon.hp}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.hp / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">ATK</p>
                    <p class="estadistica-valor">${pokemon.atk}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.atk / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">DEF</p>
                    <p class="estadistica-valor">${pokemon.def}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.def / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SAT</p>
                    <p class="estadistica-valor">${pokemon.sat}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sat / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SDF</p>
                    <p class="estadistica-valor">${pokemon.sdf}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.sdf / 255) - 16 + "px"}"></div>
                </div>
                <div class="estadistica">
                  <div class="estadistica-datos">
                    <p class="estadistica-nombre">SPD</p>
                    <p class="estadistica-valor">${pokemon.spd}</p>
                  </div>
                  <div class="barra-estadistica-total"></div>
                  <div class="barra-estadistica-llena" style="width: ${270 * (pokemon.spd / 255) - 16 + "px"}"></div>
                </div>
              </div>
            </div>
          </a>
      `;
}

export function ensenarNoHayResultado() {
  const container = document.getElementById("resultado-busqueda");
  const input = document.getElementById("mi-input") as HTMLInputElement;

  if (container != null && input != null)
    container.innerHTML += `
    <div class="no-hay-resultado">
      <div class="icono-no-hay-resultado">
        <div class="icono-no-hay-resultado-interior"></div>
        <div class="icono-no-hay-resultado-vector1"></div>
        <div class="icono-no-hay-resultado-vector2"></div>
        <div class="icono-no-hay-resultado-vector3"></div>
        <div class="icono-no-hay-resultado-vector4"></div>
        <div class="icono-no-hay-resultado-vector5"></div>
      </div>
      <p> There is no results for "${input}" </p>
    </div>
    `;
}

export function ensenarErrorAPI() {
  const container = document.getElementById("resultado-busqueda");
  if(container != null)
  container.innerHTML += `
  <div class="error-api-pokemon">
    <div class="icono-error-api-pokemon">
      <div class="icono-error-api-pokemon-interior"></div>
      <div class="icono-error-api-pokemon-vector1"></div>
      <div class="icono-error-api-pokemon-vector2"></div>
      <div class="icono-error-api-pokemon-vector3"></div>
      <div class="icono-error-api-pokemon-vector4"></div>
    </div>
    <p> An error ocurred getting Pokemons.</p>
    <p> <br>Please try later</p>
  </div>
  `;
}

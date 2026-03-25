async function obtenerPokemon(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const pokemon = {
    nombre: data.name,
    numero: data.id,
    imagen: data.sprites.other["official-artwork"].front_default,
    tipos: data.types.map((t) => t.type.name),
    peso: data.weight,
    altura: data.height,
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    sat: data.stats[3].base_stat,
    sdf: data.stats[4].base_stat,
    spd: data.stats[5].base_stat,
  };
  return pokemon;
}

async function obtenerPokemonDescripcion(id) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

  const res = await fetch(url);
  const data = await res.json();

  const englishEntry = data.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  );
  return englishEntry.flavor_text.replace(/[\n\f]/g, " ");
}

function sacarTipoDato(value) {
  value = value.toLowerCase().trim();

  if (tiposPokemon.includes(value)) {
    return "tipo";
  }
  if (/^#?\d+$/.test(value)) {
    return "numero";
  }
  return "nombre";
}

function formatearNumero(numero) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
}

function mostrarPokemonSinLink(pokemon, lugar) {
  document.getElementById(lugar).innerHTML += `
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

function mostrarPokemonConLink(pokemon, lugar) {
  document.getElementById(lugar).innerHTML += `
    <a class="carta-pokemon ${pokemon.tipos[0]}" href="panel-pokemon.html?pokemon=${pokemon.numero}">
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

function enseñarNoHayResultado() {
  document.getElementById("resultado-busqueda").innerHTML += `
  <div class="no-hay-resultado">
    <div class="icono-no-hay-resultado">
      <div class="icono-no-hay-resultado-interior"></div>
      <div class="icono-no-hay-resultado-vector1"></div>
      <div class="icono-no-hay-resultado-vector2"></div>
      <div class="icono-no-hay-resultado-vector3"></div>
      <div class="icono-no-hay-resultado-vector4"></div>
      <div class="icono-no-hay-resultado-vector5"></div>
    </div>
    <p> There is no results for "${document.getElementById("input-busqueda").value}" </p>
  </div>
  `;
}

function enseñarErrorAPI() {
  document.getElementById("resultado-busqueda").innerHTML += `
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

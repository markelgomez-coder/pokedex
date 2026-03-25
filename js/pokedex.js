const tiposPokemon = [
  "grass",
  "bug",
  "electric",
  "fire",
  "water",
  "normal",
  "poison",
  "ground",
  "flying",
  "fairy",
  "fighting",
  "psychic",
  "rock",
  "ghost",
  "ice",
  "dragon",
  "dark",
  "steel",
];

let listaPokemon = [];
let timeoutId;

async function obtenerPrimeraGeneracion() {
  const promesas = [];
  try {
    for (let i = 1; i <= 151; i++) {
      promesas.push(obtenerPokemon(i));
    }

    const pokemons = await Promise.all(promesas);
    enseñarCartas(pokemons);

    listaPokemon = pokemons;
  } catch (error) {
    enseñarErrorAPI();
  }
}

obtenerPrimeraGeneracion();

function formatearNumero(numero) {
  if (numero < 10) {
    return "#00" + numero;
  }
  if (numero < 100) {
    return "#0" + numero;
  }
  return "#" + numero;
}

document.addEventListener("keyup", (e) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (e.target.matches("#input-busqueda")) {
      const value = e.target.value;

      if (value === "") {
        enseñarCartas(listaPokemon);
      } else {
        const tipoDato = sacarTipoDato(value);
        document.getElementById("resultado-busqueda").innerHTML += "";
        switch (tipoDato) {
          case "tipo":
            filtraPorTipo(value);
            break;
          case "numero":
            filtraPorNumero(value);
            break;
          case "nombre":
            filtraPorNombre(value);
            break;
        }
      }
    }
  }, 1000);
});

function filtraPorTipo(value) {
  const filtrados = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.tipos.includes(value)) {
      filtrados.push(pokemon);
    }
  });
  enseñarCartas(filtrados);
}

function filtraPorNumero(value) {
  const filtrados = [];
  listaPokemon.forEach((pokemon) => {
    if (value.charAt(0) === "#") {
      value = value.slice(1);
    }

    if (pokemon.numero.toString().includes(value)) {
      filtrados.push(pokemon);
    }
    enseñarCartas(filtrados);
  });
}

function filtraPorNombre(value) {
  const filtrados = [];
  listaPokemon.forEach((pokemon) => {
    if (pokemon.nombre.includes(value)) {
      filtrados.push(pokemon);
    }
    enseñarCartas(filtrados);
  });
}

function enseñarCartas(pokemons) {
  document.getElementById("resultado-busqueda").innerHTML = "";
  if (pokemons.length === 0) {
    enseñarNoHayResultado();
  } else {
    pokemons.forEach((pokemon) => {
      mostrarPokemonConLink(pokemon,"resultado-busqueda");
    });
  }
}

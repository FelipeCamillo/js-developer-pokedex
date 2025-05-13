const pokemonCache = {}
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
        
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
        
    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    const id = pokemon.url.split('/')[6]

    if (pokemonCache[id]) {
        return Promise.resolve(pokemonCache[id])
    }

    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
            const converted = convertPokeApiDetailToPokemon(data)
            pokemonCache[id] = converted
            return converted
        })
}

pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    const response = await fetch(url)
    const jsonBody = await response.json()
    const pokemons = jsonBody.results

    const pokemonsDetails = []

    for (let i = 0; i < pokemons.length; i++) {
        const detail = await pokeApi.getPokemonDetail(pokemons[i])
        pokemonsDetails.push(detail)
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    return pokemonsDetails
} 

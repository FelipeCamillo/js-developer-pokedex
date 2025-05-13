const cardPokemon = document.getElementById('cardPokemon')
const urlParams = new URLSearchParams(location.search)
const pokemonId = urlParams.get('id')

   
Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).then(res => res.json()),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`).then(res => res.json())
])
.then(([pokeDetail, speciesDetail]) => {
    const pokemon = convertPokeApiDetailToPokemon(pokeDetail)

    const typesHtml = pokemon.types
        .map(type => `<li class="type ${type}">${type}</li>`)
        .join('')

    const abilities = pokeDetail.abilities
        .map(item => item.ability.name)
        .join(', ')

    const weightKg = pokeDetail.weight / 10
    const heightM = pokeDetail.height / 10

    const speciesTextEntry = speciesDetail.genera.find(entry => entry.language.name === 'en')
    const speciesName = speciesTextEntry.genus
    
    const newHtml = `
        <div class="pokemonDetails ${pokemon.type}">
            <div class="headerPokemon">
                <h1 class="name">${pokemon.name}</h1>
                <span class="number">#${pokemon.number}</span>
            </div>
            <div class="detail">
                <ol class="types">
                    ${typesHtml}
                </ol>
            </div>
            <img class="photo" src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <div class="aboutPokemon">
            <h2 class="aboutTitle">About</h2>
            <span class="itens" id="species">Species: <b>${speciesName}</b></span>
            <span class="itens" id="abilities">Abilities: <b>${abilities}</b></span>
            <span class="itens" id="weight">Weight: <b>${weightKg} kg</b></span>
            <span class="itens" id="height">Height: <b>${heightM} m</b></span>
        </div>
    `

    cardPokemon.innerHTML = newHtml
})
.catch(error => {
    console.error('Erro ao buscar detalhes do Pokémon', error)
})    
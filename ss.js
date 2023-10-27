const pokeTypeURL = 'https://pokeapi.co/api/v2/type/';
const pokeQueryParams = new URLSearchParams(window.location.search);
// console.log(pokeQueryParams);
const typeParams = new URLSearchParams(window.location.search);
const typeSearch = typeParams.get('type');
// console.log(typesearch);

const pokedex = document.getElementById('pokedex');
const pokemonSearchForm  = document.querySelector('#pokemon-search-form');
const pokemonTypeFilter = document.querySelector('.type-filter');

let pokemonArray = [];
let uniqueTypes = new Set();

const fetchPokemon = () => {
    const promises = [];
    for(let i=1; i<= 151; i++){
        const pokemonURL = `https://pokeapi.co/api/v2/pokemon/${i}`;
        console.log(pokemonURL);
        promises.push(fetch(pokemonURL).then(response => response.json()))
    }

    Promise.all(promises)
    .then(allPokemon =>{
        const firstGenPokemon = allPokemon.map(pokemon=>({
            frontImage: pokemon.sprites['front_default'],
            pokemon_id:pokemon.id,
            name:pokemon.name,
            type:pokemon.types[0].type.name,
            abilities:pokemon.abilities.map(ability=>ability.ability.name).join(', '),
            description:pokemon.species.url
        }))
        pokemonArray = firstGenPokemon;
        // console.log(promises);
        console.log(firstGenPokemon);
        createPokemonCards(firstGenPokemon);
    })
    .then(generateTypes);
}

fetchPokemon()

pokemonSearchForm.addEventListener('input',(event)=>{
    const filterPokemon = pokemonArray.filter(pokemon => pokemon.name.includes(event.target.value.toLowerCase()))
    clearPokedex()
    createPokemonCards(filterPokemon)
})

function clearPokedex(){
    let section = document.querySelector('#pokedex');
    section.innerHTML = ''
}

function createPokemonCards(pokemons){
    let currentPokemon = pokemons;
    if(typeSearch){
        currentPokemon = pokemons.filter(pokemon => pokemon.type.includes(typeSearch.toLowerCase()))
    }
    currentPokemon.forEach(pokemon=>{
        createPokemonCard(pokemon)
    })
}

function createPokemonCard(pokemon) {
    // total card
    const flipCard = document.createElement("div")
    flipCard.classList.add("flip-card")
    flipCard.id = `${pokemon.name}`
    pokedex.append(flipCard)
    
    // front & back container
    const flipCardInner = document.createElement("div")
    flipCardInner.classList.add("flip-card-inner")
    flipCardInner.id = `${pokemon.type}`
    flipCard.append(flipCardInner)

    // front of card
    const frontCard = document.createElement("div")
    frontCard.classList.add('front-pokemon-card')

    const frontImage = document.createElement('img')
    frontImage.src = `${pokemon.frontImage}`
    frontImage.classList.add("front-pokemon-image")

    const frontPokeName = document.createElement('h2')
    frontPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`

    const frontPokeID = document.createElement('p')
    frontPokeID.textContent = `#${pokemon.pokemon_id}`
    frontPokeID.classList.add("front-poke-id")

    const frontDescription = document.createElement("p")
    
    
    const frontPokeType = document.createElement('p')
    frontPokeType.textContent = `${pokemon.type.toUpperCase()}`
    frontPokeType.classList.add("front-pokemon-type")

    frontCard.append(frontImage, frontPokeID, frontPokeName, frontDescription, frontPokeType)
    
    // back of card
    const backCard = document.createElement("div")
    backCard.classList.add('back-pokemon-card')

    const backImage = document.createElement('img')
    backImage.src = `${pokemon.backImage}`
    backImage.classList.add("back-pokemon-image")

    const backPokeID = document.createElement('p')
    backPokeID.textContent = `#${pokemon.pokemon_id}`
    backPokeID.classList.add("back-poke-id")

    const backPokeName = document.createElement('h2')
    backPokeName.innerHTML = `<a href="/pokemon.html?pokemon_id=${pokemon.pokemon_id}">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</a>`
    backPokeName.classList.add("back-pokemon-name")

    const backPokeAbilities = document.createElement("p")
    backPokeAbilities.innerHTML = `<p>Abilities:<br>${pokemon.abilities}<p>`
    backPokeAbilities.classList.add("back-pokemon-abilities")

    backCard.append(backImage, backPokeID, backPokeName, backPokeAbilities)
    flipCardInner.append(frontCard, backCard);
    uniqueTypes.add(pokemon.type);
}

function generateTypes(){
    uniqueTypes.forEach(type=>{
        const typeOption = document.createElement('option');
        typeOption.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        typeOption.value = type;

        pokemonTypeFilter.append(typeOption)
    })
}

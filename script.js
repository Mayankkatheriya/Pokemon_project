let fetchPokemons = ()=>{
    let pokeArr = []
    for(let i=1; i<=151; i++){
        pokeArr.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
        .then(res=>res.json()))
    }
    // console.log(pokeArr)
    Promise.all(pokeArr)
    .then(currPokemon=>{
        let updatedPokeArr = currPokemon.map(pokemon=>{
            return {
            id: pokemon.id,
            image: pokemon.sprites.front_default,
            name: pokemon.name,
            type: pokemon.types[0].type.name,
            }
        })
        console.log(updatedPokeArr);
    })

}
fetchPokemons()

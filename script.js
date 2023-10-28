let colors = {
  grass: "#A0CF59",
  fire: "#FD842F",
  water: "#4E98C7",
  bug: "#79A449",
  normal: "#A9B0B3",
  poison: "#BD86CC",
  electric: "#EFD73F",
  ground: "#F7E049",
  fairy: "#FDBDEA",
  fighting: "#D76F2E",
  psychic: "#F46EBD",
  rock: "#A8922C",
  ghost: "#826AA8",
  dragon: "#DCAA2B",
  ice: "#5AC7E8",
};

let pokemonContainer = document.querySelector("#pokemon-container");
let fetchPokemons = () => {
  let pokeArr = [];
  for (let i = 1; i <= 151; i++) {
    pokeArr.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json())
    );
  }
  // console.log(pokeArr)
  Promise.all(pokeArr).then((currPokemon) => {
    let updatedPokeArr = currPokemon.map((pokemon) => {
      return {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: pokemon.name,
        type: pokemon.types[0].type.name,
        backImage: pokemon.sprites.back_default,
        ability: pokemon.abilities.map(ability=>ability.ability.name).join(', '),
      };
    });
    console.log(updatedPokeArr);
    updatedPokeArr.forEach((poke) => {
      console.log(poke);
      const div = document.createElement("div");
      div.classList.add(`box`);
      let poketype = poke.type;
      let pokecolor = colors[poketype] || "#A0CF59";
      div.innerHTML = `
            <div class="box-content">
                <div class="box-front" style='background-color: ${pokecolor}'>
                    <p class="pokeId">#${poke.id}</p>
                    <img src="${poke.image}" alt="${poke.name}" class="pokeImg" />
                    <h2 class="pokeName">${poke.name}</h2>
                    <span class="pokeType">${poke.type}</span>
                </div>
                <div class="box-back" style='background-color: ${pokecolor}'>
                    <p class="pokeBackId">#${poke.id}</p>
                    <img src="${poke.backImage}" alt="${poke.name}" class="pokeBackImg" />
                    <span class="pokeAbility">Abilities:<br>${poke.ability}</span>
                </div>
            </div>
            `;
      pokemonContainer.appendChild(div);
      
    });
    
  });
};
fetchPokemons();

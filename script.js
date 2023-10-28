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

let pokemonTypes = [];
let updatedPokeArr = [];
let pokemonContainer = document.querySelector("#pokemon-container");
let selectTypes = document.querySelector("select");
let searchBar = document.querySelector("#searchBar")
let filterBtn = document.querySelector("#filterButton")

//TODO Append cards and options
function appendCards(finalArr) {
    pokemonContainer.innerHTML = ""
    selectTypes.innerHTML = `
    <option value="" selected disabled>--Type--</option>
    `
    finalArr.forEach((poke) => {
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
                      <span class="pokeAbility">Abilities:<br><span>${poke.ability}</span></span>
                  </div>
              </div>
              `;
        pokemonContainer.appendChild(div);
        const option = document.createElement("option");
        if(!(pokemonTypes.includes(`${poke.type}`))){
          pokemonTypes.push(`${poke.type}`)
          option.value = `${poke.type}`;
          option.innerHTML = `${poke.type}`
          selectTypes.appendChild(option)
        }
      });
}

//TODO search Event
searchBar.addEventListener("keyup", (e)=>{
    e.preventDefault();
    let newArr = updatedPokeArr.filter((ele)=>{
        return ele.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ? true : false ;
    })
    console.log(newArr);
    appendCards(newArr)
})

//TODO Filter Button Event
filterBtn.addEventListener("click", (e)=>{
    e.preventDefault()
    let filterValue = selectTypes.value
    // console.log(filterValue);
    let filteredArray = updatedPokeArr.filter((ele)=>{
        return ele.type === filterValue ? true : false ;
    })
    appendCards(filteredArray)
})

//TODO fetch items from API
let fetchPokemons = () => {
  let pokeArr = [];
  for (let i = 1; i <= 151; i++) {
    pokeArr.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((res) => res.json())
    );
  }
  // console.log(pokeArr)
  Promise.all(pokeArr).then((currPokemon) => {
    updatedPokeArr = currPokemon.map((pokemon) => {
      return {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: pokemon.name,
        type: pokemon.types[0].type.name,
        backImage: pokemon.sprites.back_default,
        ability: pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(", "),
      };
    });
    // console.log(updatedPokeArr);
    appendCards(updatedPokeArr);
  });
};
fetchPokemons();

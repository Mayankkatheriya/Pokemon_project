let divColors = {
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
let searchBar = document.querySelector("#searchBar");
let filterBtn = document.querySelector("#filterButton");
let sortBtn = document.querySelector("#sortButton");
let modal = document.querySelector(".modal");
let dialog = document.querySelector("#myDialog");
let toggle = document.querySelector("#toggle");

//TODO dialog box close
function closeDialog() {
  dialog.close();
}

//TODO Dialog box open
function openDetails(
  name,
  img,
  move1,
  move2,
  move3,
  move4,
  height,
  weight,
  order
) {
  modal.innerHTML = `
  <svg onclick = "closeDialog()" id = "closeBtn" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#7d7a78" d="M3 16.74L7.76 12L3 7.26L7.26 3L12 7.76L16.74 3L21 7.26L16.24 12L21 16.74L16.74 21L12 16.24L7.26 21L3 16.74m9-3.33l4.74 4.75l1.42-1.42L13.41 12l4.75-4.74l-1.42-1.42L12 10.59L7.26 5.84L5.84 7.26L10.59 12l-4.75 4.74l1.42 1.42L12 13.41Z"/>
  </svg>
  <h1 class="model_Name">${name}</h1>
  <img src="${img}" alt="" class="model_Image" />
  <h3 class = modal_Moves>Moves</h3>
  <ul>
    <div class = "list">
      <li>${move1}</li>
      <li>${move2}</li>
    </div>
    <div class = "list">
      <li>${move3}</li>
      <li>${move4}</li>
    </div>
  </ul>
  <div class="specs">
    <h4>height: ${height}</h4>
    <h4>order: ${order}</h4>
    <h4>weight: ${weight}</h4>
  </div>
  `;
  dialog.show();
}

//TODO Append cards
function appendCards(finalArr) {
  pokemonContainer.innerHTML = "";
  selectTypes.innerHTML = `
    <option value="" selected disabled>--Type--</option>
    `;
  finalArr.forEach((poke) => {
    const div = document.createElement("div");
    let move1 = poke.moves[0],
      move2 = poke.moves[1],
      move3 = poke.moves[2],
      move4 = poke.moves[3];
    div.classList.add(`box`);
    div.setAttribute("data-id", "flip-up");
    let poketype = poke.type;
    let pokecolor = divColors[poketype] || "#A0CF59";
    div.innerHTML = `
              <div class="box-content" onclick = "openDetails('${poke.name}', '${poke.largeImg}', '${move1}', '${move2}', '${move3}', '${move4}', '${poke.height}', '${poke.weight}', '${poke.order}')">
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
  });
}

//TODO Add Options for filter
function appendOptions(finalArr) {
  selectTypes.innerHTML = `
    <option value="" selected disabled>--Type--</option>
    `;
  pokemonTypes = [];
  finalArr.forEach((poke) => {
    const option = document.createElement("option");
    if (!pokemonTypes.includes(`${poke.type}`)) {
      pokemonTypes.push(`${poke.type}`);
      option.value = `${poke.type}`;
      option.innerHTML = `${poke.type}`;
      selectTypes.appendChild(option);
    }
  });
}

//TODO search Event
searchBar.addEventListener("keyup", (e) => {
  e.preventDefault();
  let newArr = updatedPokeArr.filter((ele) => {
    return ele.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
      ? true
      : false;
  });
  // console.log(newArr);
  appendCards(newArr);
  appendOptions(newArr);
});

//TODO Filter Button Event
//! Adding toastr for error
filterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let filterValue = selectTypes.value;
  // console.log(filterValue);
  if (filterValue == "") {
    toastr.options.closeMethod = "fadeOut";
    toastr.options.closeDuration = 100;
    toastr.options.closeEasing = "swing";
    toastr.options.closeButton = true;
    toastr.options.closeHtml = '<button><i class="icon-off"></i></button>';
    toastr.error("Select a Type");
    return;
  }
  let filteredArray = updatedPokeArr.filter((ele) => {
    return ele.type === filterValue ? true : false;
  });
  appendCards(filteredArray);
  appendOptions(updatedPokeArr);
});

//TODO Sort Button Event
let sort = "asc";
sortBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let sortedArr = [];
  if (sort == "asc") {
    sortedArr = updatedPokeArr.sort((a, b) => a.height - b.height);
    sort = "desc";
    sortBtn.innerText = "Sort By Height ⬇";
  } else {
    sortedArr = updatedPokeArr.sort((a, b) => b.height - a.height);
    sort = "asc";
    sortBtn.innerText = "Sort By Height ⬆";
  }
  appendCards(sortedArr);
  appendOptions(sortedArr);
});

//TODO fetch items from API
let fetchPokemons = () => {
  let pokeArr = [];
  for (let i = 1; i <= 201; i++) {
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
        backImage: pokemon.sprites.back_shiny,
        largeImg: pokemon.sprites.other.home.front_shiny,
        moves: pokemon.moves.map((moves) => moves.move.name),
        ability: pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(", "),
        height: pokemon.height,
        weight: pokemon.weight,
        order: pokemon.order,
      };
    });
    // console.log(updatedPokeArr);
    appendCards(updatedPokeArr);
    appendOptions(updatedPokeArr);
  });
};
fetchPokemons();

//TODO Dark theme
let flag = false;
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (flag == false) {
    toggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm8 24a64 64 0 1 0 64 64a64.07 64.07 0 0 0-64-64Zm-69.66 5.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68l-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z"/>
      </svg>
      `;
    flag = true;
  } else {
    toggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path fill="#000000" d="M235.54 150.21a104.84 104.84 0 0 1-37 52.91A104 104 0 0 1 32 120a103.09 103.09 0 0 1 20.88-62.52a104.84 104.84 0 0 1 52.91-37a8 8 0 0 1 10 10a88.08 88.08 0 0 0 109.8 109.8a8 8 0 0 1 10 10Z"/>
      </svg>
      `;
    flag = false;
  }
});

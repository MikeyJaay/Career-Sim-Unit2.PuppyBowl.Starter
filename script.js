const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "MikeyJaay";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

let state = {
  playerList: [],
};

// Step 1: Fetch All Players
const fetchAllPlayers = async () => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}/players`);
    const json = await response.json();
    state.playerList = json.data;
    renderAllPlayers();
    // Provided
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

// Step 2: Fetch Single Player Details
const fetchSinglePlayer = async (playerId) => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const json = await response.json();
    const singlePlayer = json.data.player;

    renderSinglePlayer(singlePlayer);
    // Provided
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

// Step 3: Add New Player
const addNewPlayer = async (playerObj) => {
  try {
    // MJ Input: Add a new player using the APIURL
    const name = form.name.value;
    const breed = form.breed.value;
    const imageUrl = form.imageURL.value;

    await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        breed: breed,
        imageUrl: imageUrl,
      }),
    });

    await fetchAllPlayers();
    renderNewPlayerForm();
    renderAllPlayers();
    // Provided
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

// Step 4: Remove Player
const removePlayer = async (playerId) => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });

    await response.json();
    await fetchAllPlayers();
    renderAllPlayers();
    // Provided
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

// Step 5: Render All Players
const renderAllPlayers = (playerList) => {
  try {
    // MJ Input: Loop through playerList and display each player in playerContainer
    const playerCards = state.playerList.players.map((player) => {
      const playerCard = document.createElement("div");
      playerCard.classList.add("player");
      playerCard.innerHTML = `
      <h3>ID#:  ${player.id}</h3>
      <h1>Name:  ${player.name}</h1>
      <h2>Breed:  ${player.breed}</h2>
      <h2>Status:  ${player.status}</h2>
      <img src="${player.imageUrl}">
  `;

      const seeDetailsButton = document.createElement("button");
      seeDetailsButton.innerText = "More Details";
      seeDetailsButton.classList.add("button1");
      seeDetailsButton.addEventListener("click", () =>
        fetchSinglePlayer(player.id)
      );
      playerCard.append(seeDetailsButton);

      const removePlayerButton = document.createElement("button");
      removePlayerButton.innerText = "Remove Player";
      removePlayerButton.classList.add("button2");
      removePlayerButton.addEventListener("click", () =>
        removePlayer(player.id)
      );
      playerCard.append(removePlayerButton);

      return playerCard;
    });

    playerContainer.replaceChildren(...playerCards);
    // Provided
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

// Step 6: Render New Player Form
const renderNewPlayerForm = () => {
  try {
    // MJ Input
    form.reset();
    // Provided
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const renderSinglePlayer = (player) => {
  const playerCard = document.createElement("div");
  playerCard.classList.add("player");
  playerCard.innerHTML = `
      <h3>ID#:  ${player.id}</h3>
      <h1>Name:  ${player.name}</h1>
      <h2>Breed:  ${player.breed}</h2>
      <h2>Status:  ${player.status}</h2>
      <img src="${player.imageUrl}">
  `;

  const backToAllPlayersBtn = document.createElement("button");
  backToAllPlayersBtn.innerText = "Back To All Players";
  backToAllPlayersBtn.classList.add("button3");
  backToAllPlayersBtn.addEventListener("click", () => renderAllPlayers());
  playerCard.append(backToAllPlayersBtn);

  playerContainer.replaceChildren(playerCard);
};

// Provided: Initialize the Application
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};

init();

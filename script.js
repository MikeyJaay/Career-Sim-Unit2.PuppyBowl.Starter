const playerContainer = document.getElementById("all-players-container");
const addPlayerForm = document.querySelector("#addPlayer");
const cohortName = "mikeyjaay";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const state = {
  playerList: [],
  selectedPlayers: [],
};

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + "players");
    const { data } = await response.json();
    state.playerList = data.players;
  } catch (err) {
    console.error("Error fetching players:", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + "players/" + playerId);
    const { data } = await response.json();
    state.playerList = [data.player];
    renderSinglePlayer();
  } catch (err) {
    console.error(`Error fetching player #${playerId}:`, err);
  }
};

const addNewPlayer = async (event) => {
  event.preventDefault();
  const { name, breed, imageUrl } = addPlayerForm.elements;
  const playerObj = {
    name: name.value,
    breed: breed.value,
    imageUrl: imageUrl.value,
  };
  try {
    await fetch(APIURL + "players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    await init(); // Re-fetch and re-render player list
    addPlayerForm.reset();
  } catch (error) {
    console.error("Error adding player:", error);
  }
};

addPlayerForm.addEventListener("submit", addNewPlayer);

const removePlayer = async (playerId) => {
  try {
    await fetch(APIURL + "players/" + playerId, {
      method: "DELETE",
    });
    await init(); // Re-fetch and re-render player list
  } catch (error) {
    console.error(`Error removing player #${playerId}:`, error);
  }
};

const renderAllPlayers = () => {
  const { playerList } = state;
  if (!playerList.length) {
    playerContainer.innerHTML = "<li>No Players</li>";
    return;
  }
  try {
    const playerCards = playerList.map((player) => {
      const playerCard = document.createElement("div");
      playerCard.classList.add("player");
      playerCard.innerHTML = `
        <img src="${player.imageUrl}"> 
        <h2>${player.name}</h2>
      `;
      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("buttonDiv");

      // See Details Button
      const detailsButton = document.createElement("button");
      detailsButton.innerText = "See Details";
      detailsButton.addEventListener("click", () => fetchSinglePlayer(player.id));
      buttonDiv.appendChild(detailsButton);

      // Delete Player Button
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete Player";
      deleteButton.addEventListener("click", () => {
        if (confirm("Do you want to delete?")) {
          removePlayer(player.id);
        }
      });
      buttonDiv.appendChild(deleteButton);

      playerCard.appendChild(buttonDiv);
      return playerCard;
    });
    playerContainer.innerHTML = ""; // Clear existing content
    playerCards.forEach((card) => playerContainer.appendChild(card));
  } catch (err) {
    console.error("Error rendering players:", err);
  }
};

const renderSinglePlayer = () => {
  try {
    const player = state.playerList[0]; // Get the single player from the array
    const playerCard = document.createElement("div");
    playerCard.classList.add("player");
    playerCard.innerHTML = `
      <img src="${player.imageUrl}">
      <h2>${player.name}</h2>
      <h3>Breed: ${player.breed}</h3>
      <h3>Status: ${player.status}</h3>
      <p>Created at: ${new Date(player.createdAt).toLocaleString()}</p>
      <p>Updated at: ${new Date(player.updatedAt).toLocaleString()}</p>
      <p>Team Id: ${player.teamId}</p>
      <p>Cohort Id: ${player.cohortId}</p>
    `;
    const detailsButton = document.createElement("button");
    detailsButton.innerText = "Back to all players";
    detailsButton.addEventListener("click", () => init());
    playerCard.appendChild(detailsButton);
    playerContainer.innerHTML = ""; // Clear existing content
    playerContainer.appendChild(playerCard);
  } catch (err) {
    console.error("Error rendering player:", err);
  }
};

const init = async () => {
  await fetchAllPlayers();
  renderAllPlayers();
};

init();

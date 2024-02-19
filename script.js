const playerContainer = document.getElementById("all-players-container");
const addPlayerForm = document.querySelector("#addPlayer");
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/mikeyjaay/`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + "players");
    return await response.json();
  } catch (err) {
    console.error("Error fetching players:", err);
    return { data: [] }; 
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + "players/" + playerId);
    const { data } = await response.json();
    renderSinglePlayer(data.player); 
  } catch (err) {
    console.error(`Error fetching player #${playerId}:`, err);
  }
};

const addNewPlayer = async (event) => {
  event.preventDefault();
  const formData = new FormData(addPlayerForm);
  const playerObj = Object.fromEntries(formData);
  try {
    await fetch(APIURL + "players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerObj),
    });
    await init(); 
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
    await init(); 
  } catch (error) {
    console.error(`Error removing player #${playerId}:`, error);
  }
};

const renderAllPlayers = (players) => {
  playerContainer.innerHTML = players.length ?
    players.map(player => `
      <div class="player">
        <img src="${player.imageUrl}">
        <h2>${player.name}</h2>
        <button onclick="fetchSinglePlayer(${player.id})">See Details</button>
        <button onclick="removePlayer(${player.id})">Delete Player</button>
      </div>
    `).join('') :
    "<li>No Players</li>";
};

const renderSinglePlayer = (player) => {
  playerContainer.innerHTML = `
    <div class="player">
      <img src="${player.imageUrl}">
      <h2>${player.name}</h2>
      <h3>Breed: ${player.breed}</h3>
      <h3>Status: ${player.status}</h3>
      <p>Created at: ${new Date(player.createdAt).toLocaleString()}</p>
      <p>Updated at: ${new Date(player.updatedAt).toLocaleString()}</p>
      <p>Team Id: ${player.teamId}</p>
      <p>Cohort Id: ${player.cohortId}</p>
      <button onclick="init()">Back to all players</button>
    </div>
  `;
};

const init = async () => {
  const { data } = await fetchAllPlayers();
  renderAllPlayers(data.players);
};

init();

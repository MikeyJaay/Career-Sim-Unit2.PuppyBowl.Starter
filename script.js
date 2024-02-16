const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "MikeyJaay";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

// MJ Input

// Provided

// Fetch players from API
const fetchAllPlayers = async () => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}players`);
    const players = await response.json();
    return players;
    // Provided
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

// Placeholder for fetching single player detials
const fetchSinglePlayer = async (playerId) => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}players/${playerId}`);
    const player = await response.json();
    renderSinglePlayer(player);
    // Provided
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

// Placeholder for render a sinlge player

const renderSinglePlayer = (player) => {
  const playerHTML = `
  <div class="player-card">
    <h2>${player.name}</h2>
    <p>ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <img src="${player.imageUrl}" alt="${player.name}" />
    <p>Team: ${
      player.teamId || "Unassigned"
    }</p> <!-- Assuming you handle teamId display -->
    <button id="back-to-all-players">Back to all players</button>
  </div>
`;
  playerContainer.innerHTML = playerHTML;
  document
    .getElementById("back-to-all-players")
    .addEventListener("click", async () => {
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
};

// Placeholder for adding a new player
const addNewPlayer = async (playerObj) => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}players`, {
      method: "POST", // Method is POST because we're adding a new player
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj), // Convert the playerObj object to a JSON string
    });
    const newPlayer = await response.json();
    console.log("New player added:", newPlayer);
    // refetches and renders all players to update the list
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    // Provided
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

// Placeholder for removing a player
const removePlayer = async (playerId) => {
  try {
    // MJ Input
    const response = await fetch(`${APIURL}players/${playerId}`, {
      method: "DELETE", // Method is DELETE because we're removing a player
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Player #${playerId} removed from the roster.`);
    // Optionally, re-fetch and render all players to update the list
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    // Provided
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */

// Render all players to the DOM
const renderAllPlayers = (playerList) => {
  try {
    let allPlayersHTML = "";
    playerList.forEach((player) => {
      allPlayersHTML += `
  <div class="player-card">
    <h3>${player.name}</h3>
    <p>ID: ${player.id}</p>
    <img src="${player.imageUrl}" alt="Image of ${player.name}" />
    <button onclick="fetchSinglePlayer(${player.id})">See Details</button>
    <button onclick="removePlayer(${player.id})">Remove from Roster</button>
  </div>
`;
    });
    playerContainer.innerHTML = allPlayersHTML;

    // Provided
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */

// Render the form for adding a new player
const renderNewPlayerForm = () => {
  try {
    // MJ Input
    newPlayerFormContainer.innerHTML = `
    <form id="new-player-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="position">Position:</label>
        <input type="text" id="position" name="position" required>
        <button type="submit">Add Player</button>
    </form>
`;

    document
      .getElementById("new-player-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const newPlayer = {
          name: e.target.name.value,
          position: e.target.position.value,
        };
        await addNewPlayer(newPlayer);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      });
    // Provided
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

// Provided Initialize the Application.
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();

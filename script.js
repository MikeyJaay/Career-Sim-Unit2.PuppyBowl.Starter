const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "mikeyjaay";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

const state = {
  playerList: [],
};

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const json = await response.json();

    state.playerList = json.data;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const json = await response.json();
    const singlePlayer = json.data.player;

    renderSinglePlayer(singlePlayer);
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  playerObj.preventDefault();

  try {
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
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const form = document.getElementById("addPlayer");
form.addEventListener("submit", addNewPlayer);

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });

    await response.json();
    await fetchAllPlayers();
    renderAllPlayers();
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

const renderAllPlayers = () => {
  try {
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
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    form.reset();
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

const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();

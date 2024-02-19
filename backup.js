// Get DOM elements and define constants
const playerContainer = document.getElementById("all-players-container"); // DOM element to display players
const newPlayerFormContainer = document.getElementById("new-player-form"); // Form container element (not used here)
const addPlayerForm = document.querySelector("#addPlayer"); // Form used to add a new player
const cohortName = "mikeyjaay"; // Cohort name used in API URL
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`; // Base URL for API requests

// Define application state
state = {
  playerList: [], // Array to store fetched players
  selectedPlayers: [], // Array for selected players (not used here)
};

// Function to fetch all players from API
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + "players"); // Fetch players data
    const json = await response.json(); // Parse JSON response
    state.playerList = json.data; // Update player list in state
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err); // Handle fetch errors
  }
};

// Function to fetch data for a single player by ID
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + "players/" + playerId); // Fetch single player data
    const json = await response.json(); // Parse JSON response
    state.playerList = json.data; // Update player list in state with single player data
    renderSinglePlayer(); // Render details for the single player
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err); // Handle fetch errors
  }
};

// Function to add a new player
const addNewPlayer = async (playerObj) => {
  playerObj.preventDefault(); // Prevent default form submission behavior
  try {
    // Send POST request to API to add new player
    await fetch(APIURL + "players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPlayerForm.name.value, // Get player name from form input
        breed: addPlayerForm.breed.value, // Get player breed from form input
        imageUrl: addPlayerForm.imageUrl.value, // Get player image URL from form input
      }),
    });
    init(); // Refresh player list after adding new player
    addPlayerForm.reset(); // Reset form fields after submission
  } catch (error) {
    console.error("Oops, something went wrong with adding that player!", error); // Handle errors
  }
};

// Event listener for form submission to add a new player
addPlayerForm.addEventListener("submit", addNewPlayer);

// Function to remove a player by ID
const removePlayer = async (playerId) => {
  try {
    // Send DELETE request to API to remove player
    await fetch(APIURL + "players/" + playerId, {
      method: "DELETE",
    });
    init(); // Refresh player list after removing player
  } catch (error) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      error
    ); // Handle errors
  }
};

// Function to render all players
const renderAllPlayers = () => {
  if (!state.playerList.players.length) {
    playerContainer.innerHTML = "<li>No Players</li>"; // Display message if no players
    return;
  }
  try {
    // Map through player list and create DOM elements for each player
    let playerCards = state.playerList.players.map((player) => {
      const playerCard = document.createElement("div"); // Create player card container
      playerCard.classList.add("player"); // Add player card class
      playerCard.innerHTML = `<img src=${player.imageUrl}>`; // Add player image
      const dogName = `<h2>${player.name}</h2>`; // Create player name element
      const buttonDiv = document.createElement("div"); // Create button container
      buttonDiv.classList.add("buttonDiv"); // Add button container class

      // Details Button
      const detailsButton = document.createElement("button"); // Create details button
      detailsButton.innerText = "See Details"; // Set button text
      detailsButton.addEventListener("click", () => // Add event listener to fetch details
        fetchSinglePlayer(player.id)
      );

      buttonDiv.innerHTML = dogName; // Add player name to button container
      buttonDiv.append(detailsButton); // Append details button to button container

      // Delete Player Button
      const deleteButton = document.createElement("button"); // Create delete button
      deleteButton.innerText = "Delete Player"; // Set button text
      deleteButton.addEventListener("click", () => { // Add event listener to delete player
        if (confirm("Do you want

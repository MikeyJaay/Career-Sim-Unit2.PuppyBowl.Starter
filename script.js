const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const addPlayerForm = document.querySelector('#addPlayer');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = 'MikeyJaay';

// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

state = {
  playerList: [],
};

// Fetch All Players 
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(APIURL + 'players');
    const json = await response.json();
    state.playerList = json.data;
  } catch (err) {
    console.error('Uh oh, trouble fetching players!', err);
  }
};

// Fetch Single Player 
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(APIURL + 'players/' + playerId);
    const json = await response.json();
    state.playerList = json.data;
    renderSinglePlayer();
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

// Add New Player
const addNewPlayer = async (playerObj) => {
  playerObj.preventDefault();
  try {
    await fetch(APIURL + 'players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: addPlayerForm.name.value,
        breed: addPlayerForm.breed.value,
        imageUrl: addPlayerForm.imageUrl.value,
      }),
    });
    init();
    addPlayerForm.reset();
  } catch (error) {
    console.error('Oops, something went wrong with adding that player!', error);
  }
};

// Event Listener for Form Submission
addPlayerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewPlayer(event);
});

// Remove Player
const removePlayer = async (playerId) => {
  try {
    await fetch(APIURL + 'players/' + playerId, {
      method: 'DELETE',
    });
    init();
  } catch (error) {
    console.error(`Whoops, trouble removing player #${playerId} from the roster!`, error);
  }
};

// Render All Players
const renderAllPlayers = () => {
  if (!state.playerList.players.length) {
    playerContainer.innerHTML = '<li>No Players</li>';
    return;
  }
  try {
    let playerCards = state.playerList.players.map((player) => {
      const playerCard = document.createElement('div');
      playerCard.classList.add('player');
      playerCard.innerHTML = `
        <img src=${player.imageUrl}> 
      `;
      const dogName = `<h2>${player.name}</h2>`;
      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('buttonDiv');
      
      // See Details Button
      const detailsButton = document.createElement('button');
      detailsButton.innerText = 'See Details';
      detailsButton.addEventListener('click', () =>
        fetchSinglePlayer(player.id)
      );

      buttonDiv.innerHTML = dogName;
      buttonDiv.append(detailsButton);

      // Delete Player Button
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete Player';
      deleteButton.addEventListener('click', () => {
        if(confirm('Do you want to delete?')){
          removePlayer(player.id)
        } else {
          return false;
        }
      });

      buttonDiv.append(deleteButton);
      playerCard.append(buttonDiv);
      return playerCard;
    });
    playerContainer.replaceChildren(...playerCards);
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

// Render Single Player
const renderSinglePlayer = () => {
  try {
    let player = state.playerList.player;
    const playerCard = document.createElement('div');
    playerCard.classList.add('player');
    playerCard.innerHTML = `
      <img src=${player.imageUrl}>
      <h2>${player.name}</h2>
      <h3>Breed: ${player.breed}</h3>
      <h3>Status: ${player.status}</h3>
      <p>Created at: ${new Date(player.createdAt).toLocaleString()}</p>
      <p>Updated at: ${new Date(player.updatedAt).toLocaleString()}</p>
      <p>Team Id: ${player.teamId}</p>
      <p>Cohort Id: ${player.cohortId}</p>
    `;
    const detailsButton = document.createElement('button');
    detailsButton.innerText = 'Back to all players';
    detailsButton.addEventListener(
      'click',
      () => {
        fetchAllPlayers();
        init();
      }
    );
    playerCard.append(detailsButton);
    playerContainer.replaceChildren(playerCard);
  } catch (err) {
    console.error('Uh oh, trouble rendering players!', err);
  }
};

// Initialize
const init = async () => {
  await fetchAllPlayers();
  renderAllPlayers();
};
init();

const API_KEY = 'ed7f0021-9abe-4d9e-82b8-95d77df78fb5'; // Replace with your CoinMarketCap API Key
const API_URL = 'https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const FAVORITES_KEY = 'favorites';

let allCoins = [];

// Fetch coins using a proxy service to avoid CORS issues
async function fetchCoins() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': API_KEY,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    allCoins = data.data;

    console.log('Fetched coins:', allCoins); // Check if coins are fetched successfully

    if (allCoins.length > 0) {
      renderCoins(allCoins); // Render the fetched coins
    } else {
      console.error('No coins found');
    }
  } catch (error) {
    console.error('Error fetching coins:', error);
  }
}

// Render coins on the page
function renderCoins(coins) {
  const coinsList = document.getElementById('coins-list');
  coinsList.innerHTML = '';

  coins.forEach(coin => {
    const coinCard = document.createElement('div');
    coinCard.classList.add('coin-card');

    coinCard.innerHTML = `
      <h3>${coin.name}</h3>
      <p>${coin.symbol}</p>
      <p>Price: $${coin.quote.USD.price.toFixed(2)}</p>
      <button class="favorite-btn" onclick="addToFavorites('${coin.id}')">Add to Favorites</button>
    `;

    coinsList.appendChild(coinCard);
  });
}

// Add a coin to the favorites list (store the full coin object)
function addToFavorites(coinId) {
  const coin = allCoins.find(c => c.id === coinId);
  console.log('Selected coin for favorites:', coin);  // Log selected coin to verify

  if (coin) {
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    console.log('Current favorites:', favorites);  // Log current favorites to verify

    // Check if coin is already in favorites to avoid duplicates
    if (!favorites.some(fav => fav.id === coin.id)) {
      favorites.push(coin);  // Store the entire coin object
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      renderFavorites();  // Update the favorites list on UI
    }
  }
}

// Render the list of favorite coins with name and symbol
function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  console.log('Rendering favorites:', favorites);  // Log favorites being rendered

  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  favorites.forEach(coin => {
    const favoriteItem = document.createElement('li');
    favoriteItem.textContent = `${coin.name} (${coin.symbol})`;  // Display name and symbol
    favoritesList.appendChild(favoriteItem);
  });
}

// Initialize the app
function init() {
  fetchCoins();  // Fetch coins on page load
  renderFavorites();  // Render favorites on page load
}

// Call init on page load
init();

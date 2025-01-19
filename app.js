const API_KEY = 'ed7f0021-9abe-4d9e-82b8-95d77df78fb5';
const API_URL = 'https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const FAVORITES_KEY = 'favorites';

let allCoins = [];

// Fetch coins using a proxy service to avoid CORS issues
async function fetchCoins() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
      'Accept': 'application/json',
    },
  });
  
  const data = await response.json();
  allCoins = data.data;
  renderCoins(allCoins); // Render the fetched coins
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
  // Find the coin by ID in the allCoins array
  const coin = allCoins.find(c => c.id === coinId);
  
  if (coin) {
    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    
    // Check if coin is already in favorites to avoid duplicates
    if (!favorites.some(fav => fav.id === coin.id)) {
      favorites.push(coin);  // Store the entire coin object
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      renderFavorites();
    }
  }
}

// Render the list of favorite coins with name and symbol
function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const favoritesList = document.getElementById('favorites-list');
  
  favoritesList.innerHTML = '';
  
  favorites.forEach(coin => {
    const favoriteItem = document.createElement('li');
    favoriteItem.textContent = `${coin.name} (${coin.symbol})`;  // Display name and symbol
    favoritesList.appendChild(favoriteItem);
  });
}

// Filter coins based on search input
function filterCoins() {
  const searchValue = document.getElementById('search-bar').value.toLowerCase();
  const filteredCoins = allCoins.filter(coin => 
    coin.name.toLowerCase().includes(searchValue) || 
    coin.symbol.toLowerCase().includes(searchValue)
  );
  renderCoins(filteredCoins); // Re-render the filtered list of coins
}

// Chart rendering for historical data (sample code)
function renderChart() {
  const ctx = document.getElementById('chart-container').getContext('2d');
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [{
        label: 'Price History',
        data: [12, 19, 3, 5], // Example data
        borderColor: '#ffcb00',
        fill: false,
      }],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Months',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Price (USD)',
          },
        },
      },
    },
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  fetchCoins(); // Fetch coins on page load
  renderFavorites();
  renderChart();
});

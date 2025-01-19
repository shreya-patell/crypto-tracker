const API_KEY = 'ed7f0021-9abe-4d9e-82b8-95d77df78fb5';
const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const FAVORITES_KEY = 'favorites';

// Helper to fetch coin data
async function fetchCoins() {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': API_KEY,
      'Accept': 'application/json',
    },
  });
  
  const data = await response.json();
  return data.data;
}

// Render coins on the page
async function renderCoins() {
  const coins = await fetchCoins();
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

// Add a coin to the favorites list
function addToFavorites(coinId) {
  let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  if (!favorites.includes(coinId)) {
    favorites.push(coinId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    renderFavorites();
  }
}

// Render favorites list
function renderFavorites() {
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const favoritesList = document.getElementById('favorites-list');
  
  favoritesList.innerHTML = '';
  
  favorites.forEach(coinId => {
    const favoriteItem = document.createElement('li');
    favoriteItem.textContent = coinId;
    favoritesList.appendChild(favoriteItem);
  });
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
  renderCoins();
  renderFavorites();
  renderChart();
});

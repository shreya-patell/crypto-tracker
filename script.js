const apiUrl = 'http://localhost:3000/cryptos'; // Backend proxy URL

const cryptoList = document.getElementById('crypto-list');
const favoritesList = document.getElementById('favorites');
const searchInput = document.getElementById('search');

let favorites = [];

// Fetch data from the API
async function fetchCryptoData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayCryptos(data.data);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
}

// Display cryptocurrencies
function displayCryptos(cryptos) {
  cryptoList.innerHTML = '';
  cryptos.forEach((crypto) => {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    card.innerHTML = `
      <div>
        <h3>${crypto.name} (${crypto.symbol})</h3>
        <p>Price: $${crypto.quote.USD.price.toFixed(2)}</p>
        <p>Change (24h): ${crypto.quote.USD.percent_change_24h.toFixed(2)}%</p>
      </div>
      <button onclick="toggleFavorite('${crypto.id}', '${crypto.name}')">
        ${favorites.includes(crypto.id) ? 'Unfavorite' : 'Favorite'}
      </button>
    `;
    cryptoList.appendChild(card);
  });
}

// Toggle favorite
function toggleFavorite(id, name) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  updateFavorites();
}

// Update favorites list
function updateFavorites() {
  favoritesList.innerHTML = favorites.map((id) => `<p>${id}</p>`).join('');
  fetchCryptoData();
}

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const cryptoCards = document.querySelectorAll('.crypto-card');
  cryptoCards.forEach((card) => {
    const cryptoName = card.querySelector('h3').textContent.toLowerCase();
    if (cryptoName.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});

// Initialize the app
fetchCryptoData();

const RAPIDAPI_KEY = "28a27d171cmshaf83c1ee30544cdp1fce09jsn5ed2bb0c382d";
const RAPIDAPI_HOST = "api-football-v1.p.rapidapi.com";

const matchesContainer = document.getElementById("matches");
const hoursFilter = document.getElementById("hoursFilter");

// Fetch upcoming matches (using headtohead example here)
async function fetchMatches(hours = 72) {
  matchesContainer.innerHTML = "Loading matches...";

  try {
    // Example: headtohead between two team IDs
    // For general upcoming matches, we can use fixtures endpoint instead
    const response = await fetch(
      `https://api-football-v1.p.rapidapi.com/v3/fixtures?next=50`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST
        }
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

    if (!data.response || data.response.length === 0) {
      matchesContainer.innerHTML = "No matches found in this time range.";
      return;
    }

    // Filter by hours (from now)
    const now = new Date();
    const filteredMatches = data.response.filter(match => {
      const matchTime = new Date(match.fixture.date);
      const diffHours = (matchTime - now) / (1000 * 60 * 60);
      return diffHours >= 0 && diffHours <= hours;
    });

    displayMatches(filteredMatches);

  } catch (error) {
    console.error("Error fetching matches:", error);
    matchesContainer.innerHTML = "Failed to load matches.";
  }
}

function displayMatches(matches) {
  matchesContainer.innerHTML = "";

  matches.forEach(match => {
    const div = document.createElement("div");
    div.className = "match";

    div.innerHTML = `
      <div class="league">
        ${match.league.name} • ${match.league.country}
      </div>
      <strong>
        ${match.teams.home.name} vs ${match.teams.away.name}
      </strong>
      <div>
        🕒 ${new Date(match.fixture.date).toLocaleString()}
      </div>
    `;

    matchesContainer.appendChild(div);
  });

  if (matches.length === 0) {
    matchesContainer.innerHTML = "No matches in this time range.";
  }
}

// Event listener for hours filter
hoursFilter.addEventListener("change", () => {
  fetchMatches(Number(hoursFilter.value));
});

// Initial load (next 72 hours)
fetchMatches(72);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed', err));
}

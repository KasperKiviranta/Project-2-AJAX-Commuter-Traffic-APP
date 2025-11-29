/* File: app.js | Author: Kasper Kiviranta | Date: 29.11.2025 | Purpose: Handles AJAX calls, station autocomplete, and UI updates */

// Digitraffic API URLs
const STATIONS_URL = "https://rata.digitraffic.fi/api/v1/metadata/stations";
const LIVE_TRAINS_URL = "https://rata.digitraffic.fi/api/v1/live-trains";

// DOM elements
const stationInput = document.getElementById("station-input");
const searchBtn = document.getElementById("search-btn");
const trainList = document.getElementById("train-list");
const stationDropdown = document.getElementById("station-dropdown");

let allStations = []; // Cache for station objects {name, shortCode}

/* Fetch all passenger stations once */
async function fetchStations() {
    try {
        const response = await fetch(STATIONS_URL);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        allStations = data
            .filter(st => st.passengerTraffic)
            .map(st => ({ name: st.stationName, shortCode: st.stationShortCode }));
    } catch (error) {
        console.error("Error fetching stations:", error);
    }
}

/* Show dropdown suggestions */
function showDropdown(filteredStations) {
    stationDropdown.innerHTML = ""; // Clear previous dropdown
    if (filteredStations.length === 0) {
        stationDropdown.style.display = "none";
        return;
    }

    filteredStations.forEach(st => {
        const div = document.createElement("div");
        div.textContent = st.name;
        div.addEventListener("click", () => {
            stationInput.value = st.name;
            stationInput.dataset.code = st.shortCode; // Save short code
            stationDropdown.style.display = "none";
        });
        stationDropdown.appendChild(div);
    });

    stationDropdown.style.display = "block";
}

/* Filter stations dynamically as user types */
stationInput.addEventListener("input", () => {
    const query = stationInput.value.toLowerCase();
    if (!query) {
        stationDropdown.style.display = "none";
        return;
    }

    const filtered = allStations.filter(st => st.name.toLowerCase().includes(query));
    showDropdown(filtered.slice(0, 10)); // Show top 10 matches
});

/* Hide dropdown if click outside */
document.addEventListener("click", (event) => {
    if (!stationDropdown.contains(event.target) && event.target !== stationInput) {
        stationDropdown.style.display = "none";
    }
});

/* Fetch live trains for a station short code */
async function fetchTrains(stationShortCode) {
    try {
        const response = await fetch(`${LIVE_TRAINS_URL}?station=${stationShortCode}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

/* Render train timetable in UI */
function renderTrains(trains) {
    trainList.innerHTML = "";
    if (trains.length === 0) {
        trainList.innerHTML = "<li>No trains found for this station.</li>";
        return;
    }

    trains.forEach(train => {
        // Find the timetable row for this station
        const stationRow = train.timeTableRows.find(r => r.stationShortCode === stationInput.dataset.code && r.type === "ARRIVAL");
        if (!stationRow) return;

        const scheduledTime = new Date(stationRow.scheduledTime);
        const liveTime = stationRow.liveEstimateTime ? new Date(stationRow.liveEstimateTime) : null;
        const delay = liveTime ? Math.round((liveTime - scheduledTime)/60000) : 0;

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>Train ${train.commuterLineID}</strong> (${train.trainType})<br>
            Scheduled: ${scheduledTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}<br>
            ${delay ? `<span style="color:red;">Delay: ${delay} min</span>` : 'On time'}
        `;
        trainList.appendChild(li);
    });
}

/* Handle search button click */
searchBtn.addEventListener("click", async () => {
    const code = stationInput.dataset.code; // Use short code
    if (!code) return alert("Please select a station from the dropdown.");
    const trains = await fetchTrains(code);
    renderTrains(trains);
});

/* Initialize stations on page load */
fetchStations();

async function init() {
    await fetchStations();

    // Set default station to Helsinki
    const helsinkiStation = allStations.find(st => st.shortCode === "HKI");
    if (helsinkiStation) {
        stationInput.value = helsinkiStation.name;   // Display in input
        stationInput.dataset.code = helsinkiStation.shortCode; // Save short code

        // Fetch and render Helsinki trains immediately
        const trains = await fetchTrains(helsinkiStation.shortCode);
        renderTrains(trains);
    }
}

init();
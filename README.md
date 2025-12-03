# Commuter Traffic App (Project 2)

A web application designed to help commuters in Finland check real-time train schedules and status updates. This project focuses on using **AJAX** and **Asynchronous JavaScript** to fetch and display data dynamically from the Digitraffic API without reloading the page.

### 🚀 **Live Demo**
**[View the Live Site Here](https://kasperkiviranta.github.io/Project-2-AJAX-Commuter-Traffic-APP/)**

---

## ✨ Features

* **Real-time Data Fetching:** Uses the browser's `fetch` API to retrieve live train data and station metadata directly from Fintraffic.
* **Smart Station Search:** Includes a dynamic autocomplete dropdown. As users type, the app filters through cached station data to suggest valid stops (limited to top 10 matches for performance).
* **Live Schedule & Delays:** Displays the scheduled arrival time and calculates delays in real-time. If a train is late, the UI highlights the delay in red (e.g., "Delay: 5 min").
* **Instant Updates:** The DOM is manipulated dynamically to render list items for every train found.
* **Default State:** Automatically initializes with the "Helsinki" station schedule so the user sees data immediately upon loading.

---

## 📡 API Used

This project relies on the open data provided by Fintraffic via the Digitraffic Rata-API:

* **API Provider:** [Digitraffic API (Fintraffic)](https://www.digitraffic.fi/railway-traffic/)
* **Endpoints Used:**
    * `GET /api/v1/metadata/stations`: Used to fetch the master list of all passenger stations (names and short codes).
    * `GET /api/v1/live-trains?station={shortCode}`: Used to retrieve specific schedules and live estimates for the selected station.

---

## ⚙️ Setup and Run Instructions

This is a client-side web application using vanilla JavaScript, so no backend server installation is required.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/kasperkiviranta/Project-2-AJAX-Commuter-Traffic-APP.git](https://github.com/kasperkiviranta/Project-2-AJAX-Commuter-Traffic-APP.git)
    ```

2.  **Navigate to the project folder:**
    ```bash
    cd Project-2-AJAX-Commuter-Traffic-APP
    ```

3.  **Run the project:**
    * Open the `index.html` file in your preferred web browser.
    * *Note:* For the most stable experience (and to prevent potential CORS warnings in some browsers), it is recommended to run the file using a local server, such as the "Live Server" extension in VS Code.

---

## 📝 Reflection & Known Limitations

### What was learned
Building this project provided practical experience with **Asynchronous JavaScript**. Key learning points included:
* **Async/Await:** Managing the flow of data by fetching station metadata first (`await fetchStations()`) before allowing users to search for train times.
* **Data Parsing:** The Digitraffic API returns complex JSON. I learned how to filter the `timeTableRows` array to find the specific "ARRIVAL" entry for the current station and compare `scheduledTime` vs `liveEstimateTime` to calculate delays.
* **DOM Manipulation:** Creating a custom dropdown UI from scratch and managing its visibility states (showing on input, hiding on outside click).

### Known Limitations / Current State
* **Selection Logic:** Users must click an option from the dropdown menu to trigger the search. Simply typing "Helsinki" and pressing Enter without clicking the dropdown item may not map the name to the required `stationShortCode`.
* **Arrivals Only:** The current logic filters specifically for `type === "ARRIVAL"`. Trains that originate from the station (departures) might not be displayed in the current list view.
* **No Pagination:** The app renders all available trains returned by the API for a specific station, which can result in a long list during peak hours.

---

**Author:** Kasper Kiviranta
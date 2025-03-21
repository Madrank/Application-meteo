const apiKey = "TA_CLE_API_OPENWEATHERMAP"; // Remplace par ta clé API

// Sélectionner les éléments du DOM
const searchButton = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");
const forecastContainer = document.getElementById("forecastContainer");
const loader = document.createElement("div");
loader.classList.add("loader");

// Fonction pour récupérer les données météo
async function getWeatherData(city) {
  // Afficher le loader
  document.body.appendChild(loader);

  try {
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`
    );
    const currentWeatherData = await currentWeatherResponse.json();

    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${apiKey}`
    );
    const forecastData = await forecastResponse.json();

    if (currentWeatherData.cod === "404") {
      alert("Ville non trouvée");
      removeLoader();
      return;
    }

    // Mise à jour des informations sur la page
    updateWeatherInfo(currentWeatherData);
    updateForecast(forecastData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo", error);
    alert("Erreur lors du chargement des données météo.");
    removeLoader();
  }
}

// Fonction pour mettre à jour les informations météo actuelles
function updateWeatherInfo(data) {
  cityName.textContent = data.name;
  const date = new Date();
  currentDate.textContent = date.toLocaleDateString();
  temperature.textContent = `${Math.round(data.main.temp)} °C`;
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="icon">`;
  removeLoader();
}

// Fonction pour afficher les prévisions à 7 jours
function updateForecast(data) {
  forecastContainer.innerHTML = ""; // Réinitialiser l'affichage des prévisions
  for (let i = 0; i < data.list.length; i += 8) {
    // Afficher une prévision tous les 3h (donne 7 jours de prévisions)
    const forecast = data.list[i];
    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    forecastElement.innerHTML = `
            <h4>${new Date(forecast.dt * 1000).toLocaleDateString()}</h4>
            <img src="http://openweathermap.org/img/wn/${
              forecast.weather[0].icon
            }.png" alt="icon">
            <p>${Math.round(forecast.main.temp)} °C</p>
            <p>${forecast.weather[0].description}</p>
        `;
    forecastContainer.appendChild(forecastElement);
  }
}

// Fonction pour enlever le loader
function removeLoader() {
  loader.remove();
}

// Fonction pour basculer en mode sombre
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Événements
searchButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
  }
});

// Option de mode sombre (ajouter un bouton pour ça)
const darkModeButton = document.createElement("button");
darkModeButton.textContent = "Mode Sombre";
darkModeButton.addEventListener("click", toggleDarkMode);
document.body.appendChild(darkModeButton);

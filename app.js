const apiKey = "fa83c57487084c50b3e175048252103 "; // Remplacez par votre propre clé d'API
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";

// Récupérer les éléments du DOM
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDesc = document.getElementById("weatherDesc");
const forecastContainer = document.querySelector(".forecast-container");

// Fonction pour afficher la météo actuelle
const displayWeather = (data) => {
  cityName.textContent = data.location.name;
  temperature.textContent = `${data.current.temp_c}°C`;
  weatherDesc.textContent = data.current.condition.text;
  weatherIcon.src = data.current.condition.icon;

  // Afficher les prévisions sur 7 jours
  forecastContainer.innerHTML = ""; // Vider le conteneur avant d'ajouter les nouveaux éléments
  data.forecast.forecastday.forEach((day) => {
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forecast-item");
    forecastItem.innerHTML = `
            <img src="${day.day.condition.icon}" alt="Day Forecast">
            <h4>${new Date(day.date).toLocaleDateString("fr-FR", {
              weekday: "long",
            })}</h4>
            <p>${day.day.avgtemp_c}°C</p>
        `;
    forecastContainer.appendChild(forecastItem);
  });
};

// Fonction pour rechercher la météo d'une ville
const searchWeather = async () => {
  const city = cityInput.value;
  if (!city) return;

  const url = `${baseUrl}?key=${apiKey}&q=${city}&days=7`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Erreur:", error);
  }
};

// Ajouter un événement au bouton de recherche
searchBtn.addEventListener("click", searchWeather);

// Vous pouvez également activer la recherche lorsque l'utilisateur appuie sur "Entrée"
cityInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchWeather();
  }
});

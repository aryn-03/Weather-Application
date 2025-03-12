async function getWeather() {  
    const city = document.getElementById('city').value.trim();
    const apiKey = "bd5e378503939ddaee76f12ad7a97608"; // Replace with a secure storage method
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    if (!city) {
        document.getElementById('weather-info').innerHTML = `<p>Please enter a city name!</p>`;
        return;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById('weather-info').innerHTML = `<p>${data.message}</p>`;
            return;
        }

        if (!data.main) {
            document.getElementById('weather-info').innerHTML = `<p>Weather data not available!</p>`;
            return;
        }

        document.getElementById('weather-info').innerHTML = `
            <h3>${data.name}, ${data.sys.country}</h3>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;

        // Update weather icon
        const weatherIcon = document.getElementById('weather-icon');
        if (weatherIcon) {
            const iconCode = data.weather[0].icon;
            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
            weatherIcon.style.display = "block"; 
        }

        // Update background based on weather condition
        updateBackground(data.weather[0].description);
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('weather-info').innerHTML = `<p>Could not retrieve weather data. Try again later.</p>`;
    }
}

// Function to change background based on weather condition
function updateBackground(weather) {
    const body = document.body;
    const condition = weather.toLowerCase();

    let bgImage = "default.jpg"; // Default background
    if (condition.includes("rain")) {
        bgImage = "rainy.jpg";
    } else if (condition.includes("cloud")) {
        bgImage = "cloudy.jpg";
    } else if (condition.includes("clear")) {
        bgImage = "sunny.jpg";
    }

    body.style.backgroundImage = `url('${bgImage}')`;

    // Store the last background in localStorage
    localStorage.setItem("weatherBg", bgImage);
}

// Restore the last background on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedBg = localStorage.getItem("weatherBg");
    if (savedBg) {
        document.body.style.backgroundImage = `url('${savedBg}')`;
    }
});

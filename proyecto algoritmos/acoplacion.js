const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const getForecastBtn = document.getElementById('getForecastBtn');
const weatherInfo = document.getElementById('weatherInfo');
const forecastContainer = document.getElementById('forecastContainer');

let mostrandoClimaActual = true;
// La función mostrarClimaActual se utiliza para mostrar información del clima actual en una página web
function mostrarClimaActual(datos) {
    const weatherInfoHTML = `
    <div class="weather-grid">
        <div class="weather-item">
            <img src="temperatura.png" alt="Temperatura">
            <p>Temperatura actual: ${datos.main.temp} °C</p>
        </div>
        <div class="weather-item">
            <img src="max_temp.png" alt="Temperatura Máxima">
            <p>Temperatura máxima: ${datos.main.temp_max} °C</p>
        </div>
        <div class="weather-item">
            <img src="min_temp.png" alt="Temperatura Mínima">
            <p>Temperatura mínima: ${datos.main.temp_min} °C</p>
        </div>
        <div class="weather-item">
            <img src="presion.png" alt="Presión">
            <p>Presión: ${datos.main.pressure} hPa</p>
        </div>
        <div class="weather-item">
            <img src="humedad.png" alt="Humedad">
            <p>Humedad: ${datos.main.humidity}%</p>
        </div>
        <div class="weather-item">
            <img src="velocidad_viento.png" alt="Velocidad del Viento">
            <p>Velocidad del viento: ${datos.wind.speed} m/s</p>
        </div>
    </div>
    `;
    weatherInfo.innerHTML = weatherInfoHTML;
    weatherInfo.style.display = 'block';

    // Mostrar el botón de pronóstico después de obtener los datos del clima actual
    getForecastBtn.style.display = 'block';
    mostrandoClimaActual = true;
}
// La función mostrarPronóstico se utiliza para mostrar el pronóstico del clima en una página web.
function mostrarPronostico(pronostico) {

    forecastContainer.innerHTML = ''; // Limpiar el contenido del contenedor antes de mostrar el pronóstico

    let filaHTML = '<div class="forecast-row">';

    pronostico.forEach(dia => {
        const fechaHora = new Date(dia.dt_txt);
        const fechaFormato = formatoFecha(fechaHora);
        const tempMax = dia.main.temp_max;
        const tempMin = dia.main.temp_min;
        const presion = dia.main.pressure;
        const humedad = dia.main.humidity;
        const velocidadViento = dia.wind.speed;

        const pronosticoItemHTML = `
            <div class="forecast-item">
                <p class="fecha-hora">${formatoFechaHora(fechaHora)}</p>
                <img src="temperatura.png" alt="Temperatura Máxima">
                <p>Temp Máx: ${tempMax} °C</p>
                <img src="temperatura.png" alt="Temperatura Mínima">
                <p>Temp Mín: ${tempMin} °C</p>
                <img src="presion.png" alt="Presión">
                <p>Presión: ${presion} hPa</p>
                <img src="humedad.png" alt="Humedad">
                <p>Humedad: ${humedad}%</p>
                <img src="velocidad_viento.png" alt="Velocidad del Viento">
                <p>Viento: ${velocidadViento} m/s</p>
            </div>
        `;

        forecastContainer.insertAdjacentHTML('beforeend', pronosticoItemHTML);
    });

    if (filaHTML !== '') {
        forecastContainer.insertAdjacentHTML('beforeend', `<div class="forecast-grid">${filaHTML}</div>`);
    }

    forecastContainer.style.display = 'block'; // Mostrar el contenedor del pronóstico
    mostrandoClimaActual = false;
}

//se utilizan para dar formato a las fechas y horas en un estilo legible para los usuarios.
function formatoFecha(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
}
function formatoFechaHora(fecha) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
}

// se utiliza para ocultar la información del clima actual en la interfaz.
function ocultarClimaActual() {
    weatherInfo.style.display = 'none';
}


// genera un fragmento de HTML que representa un elemento de pronóstico climático.
function crearElementoPronostico(fechaHora, tempMax, tempMin, presion, humedad, velocidadViento) {
    return `
        <div class="weather-item">
            <p>Fecha y hora: ${fechaHora}</p>
            <img src="temperatura.png" alt="Temperatura Máxima">
            <p>Temperatura máxima: ${tempMax} °C</p>
            <img src="temperatura.png" alt="Temperatura Mínima">
            <p>Temperatura mínima: ${tempMin} °C</p>
            <img src="presion.png" alt="Presión">
            <p>Presión: ${presion} hPa</p>
            <img src="humedad.png" alt="Humedad">
            <p>Humedad: ${humedad}%</p>
            <img src="velocidad_viento.png" alt="Velocidad del Viento">
            <p>Viento: ${velocidadViento} m/s</p>
        </div>
    `;
}

//permite a los usuarios ingresar el nombre de una ciudad, obtener datos climáticos actuales de esa ciudad desde la API de OpenWeather
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value;
    const api_key = '88b6734f5a84e549f6701904dd412611';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            ocultarPronostico(); // Ocultar el pronóstico al mostrar los datos actuales
            mostrarClimaActual(data);
        })
        .catch(error => {
            console.error('Error al obtener los datos del clima:', error);
        });
});

//ocultar el contenedor que muestra el pronóstico del clima en la interfaz de la aplicación
function ocultarPronostico() {
    forecastContainer.style.display = 'none'; 
}

// está diseñado para obtener el pronóstico del clima para una ciudad ingresada por el usuario cuando hacen clic en un botón
getForecastBtn.addEventListener('click', () => {
    const city = cityInput.value;
    const api_key = '88b6734f5a84e549f6701904dd412611';
    obtenerPronostico(city, api_key);
    ocultarClimaActual();
});

// esta función se utiliza para obtener datos de pronóstico del clima de OpenWeather para una ciudad específica, procesar los datos y mostrarlos
function obtenerPronostico(ciudad, api_key) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=${api_key}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(pronostico => {
            console.log(pronostico);
            mostrarPronostico(pronostico.list);
            analizarTendencias(pronostico.list);
        })
        .catch(error => {
            console.error('Error al obtener el pronóstico del clima:', error);
        });
}

// Función analizarTendencias y otros códigos relacionados siguen igual...

function analizarTendencias(pronostico) {
    console.log("Análisis de tendencias climáticas:");

    let humedadPromedio = 0;
    let velocidadVientoPromedio = 0;
    let presionPromedio = 0;

    pronostico.forEach(dia => {
        humedadPromedio += dia.main.humidity;
        velocidadVientoPromedio += dia.wind.speed;
        presionPromedio += dia.main.pressure;
    });

    const numRegistros = pronostico.length;

    humedadPromedio /= numRegistros;
    velocidadVientoPromedio /= numRegistros;
    presionPromedio /= numRegistros;

    console.log(`Humedad promedio: ${humedadPromedio}%`);
    console.log(`Velocidad del viento promedio: ${velocidadVientoPromedio} m/s`);
    console.log(`Presión atmosférica promedio: ${presionPromedio} hPa`);
    mostrarTendencias(humedadPromedio, velocidadVientoPromedio, presionPromedio);
    const trendsContainer = document.getElementById('trendsContainer');
    trendsContainer.style.display = 'block';

    const closeTrendsBtn = document.getElementById('closeTrendsBtn');
    closeTrendsBtn.addEventListener('click', () => {
        trendsContainer.style.display = 'none';
    });
}
function mostrarTendencias(humedadPromedio, velocidadVientoPromedio, presionPromedio) {
    const humedadPromedioElement = document.getElementById('humedadPromedio');
    const velocidadVientoPromedioElement = document.getElementById('velocidadVientoPromedio');
    const presionPromedioElement = document.getElementById('presionPromedio');

    humedadPromedioElement.textContent = `Humedad promedio: ${humedadPromedio.toFixed(2)}%`;
    velocidadVientoPromedioElement.textContent = `Velocidad del viento promedio: ${velocidadVientoPromedio.toFixed(5)} m/s`;
    presionPromedioElement.textContent = `Presión atmosférica promedio: ${presionPromedio.toFixed(1)} hPa`;

    const trendsContainer = document.getElementById('trendsContainer');
    trendsContainer.style.display = 'block';
}

// Agrega el botón de calidad del aire
const getAirQualityBtn = document.getElementById('getAirQualityBtn');
getAirQualityBtn.addEventListener('click', obtenerCalidadDelAire);

// se encarga de obtener datos de calidad del aire para una ciudad específica y mostrarlos en la interfaz de usuario
function obtenerCalidadDelAire() {
    const city = cityInput.value;
    const api_key = '88b6734f5a84e549f6701904dd412611'; // Reemplaza con tu clave API

// Obtener las coordenadas de la ciudad
const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${api_key}`;

fetch(geocodingApiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const coordinates = data[0];
            const lat = coordinates.lat;
            const lon = coordinates.lon;

            // Obtener la calidad del aire utilizando las coordenadas
            const airQualityApiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

            fetch(airQualityApiUrl)
                .then(response => response.json())
                .then(airQualityData => {
                    if (airQualityData.list && airQualityData.list.length > 0) {
                        const airComponents = airQualityData.list[0].components;

                        const so2 = airComponents.so2; // Dióxido de azufre (SO2)
                        const no2 = airComponents.no2; // Dióxido de nitrógeno (NO2)
                        const pm10 = airComponents.pm10; // Partículas PM10
                        const pm25 = airComponents.pm2_5; // Partículas PM2.5
                        const o3 = airComponents.o3; // Ozono (O3)
                        const co = airComponents.co; // Monóxido de carbono (CO)

                        mostrarCalidadDelAire(so2, no2, pm10, pm25, o3, co);
                    } else {
                        console.error('No se encontraron datos de calidad del aire para la ciudad.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los datos de calidad del aire:', error);
                });
        } else {
            console.error('No se encontraron coordenadas para la ciudad.');
        }
    })
    .catch(error => {
        console.error('Error al obtener las coordenadas de la ciudad:', error);
    });

}

//  se encarga de obtener datos de calidad del aire para una ciudad específica y mostrarlos en la interfaz de usuario.
function mostrarCalidadDelAire(so2, no2, pm10, pm25, o3, co) {
    const calidadAireInfo = document.getElementById('calidadAireInfo');
    calidadAireInfo.innerHTML = `
        Dióxido de azufre (SO2): ${so2} µg/m³<br>
        Dióxido de nitrógeno (NO2): ${no2} µg/m³<br>
        Partículas PM10: ${pm10} µg/m³<br>
        Partículas PM2.5: ${pm25} µg/m³<br>
        Ozono (O3): ${o3} µg/m³<br>
        Monóxido de carbono (CO): ${co} µg/m³
    `;
    calidadAireInfo.style.display = 'block';
    ocultarPronostico(); // Ocultar el pronóstico al mostrar los datos actuales
    ocultarClimaActual()
}

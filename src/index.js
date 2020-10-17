
// I vari riferimenti agli elementi della DOM utilizzati per il progetto 
const forecastDisplay = document.querySelector(".forecastDisplay");
const searchBtn = document.querySelector("[aria-label='SearchBtn']");
const searchBox = document.querySelector("[aria-label='Search']");
const geoLoc = document.querySelector("[aria-label='geoLoc']");
const iconLabel = document.querySelectorAll(".icon-label")
const media = document.querySelectorAll(".media");
const home = document.querySelector(".home");
const dayBg = document.querySelectorAll("img");
const footer = document.querySelector("footer");
const suggestions = document.querySelector(".suggestions");
const cityAlert = document.querySelector(".cityAlert");

//Array dei giorni della settimana 

const dayName = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

// creazione degli array necessari a storare le informazioni

const forecast = new Array();
const tempMax = new Array();
const tempMin = new Array();
const dateMeasured = new Array();
const daysIndex = new Array();
const daysOfWeek = new Array();
const wind = new Array();

const baseURL = "http://api.openweathermap.org/data/2.5/";
const apiKey = process.env.API_KEY;
/*La funzione si occupa di fare la richiesta all'API sottoforma di if...else per poter
individuare gli errori piu comuni: quando accidentalmente si preme enter e la barra di 
ricerca risulta vuota e quando si sbaglia a digitare un luogo o questo non esiste*/

function getWeather(query) {
    if (searchBox.value === "") {
        alert("Please Search For A Valid Place");
    }
    else {
        fetch(`${baseURL}forecast?q=${query}&units=metric&appid=${apiKey}`)
            .then(weather => {
                return weather.json();
            }).then(extractInfo).catch(function (e) {
                e = "I cannot find this place, maybe a bad request? :(";
                alert(e);
            });

    };
}

/*La funzione estrae le informazioni di cui abbiamo bisogno e le assegna ai rispettivi array che
ad ogni richiamo vengo azzerati per poter ospitare i nuovi dati si occupa anche di tenere sempre aggiornati i giorni della settimana che visualizza attraverso
il secondo ciclo for*/

function extractInfo(weather) {
    forecast.length = 0;
    tempMax.length = 0;
    tempMin.length = 0;
    dateMeasured.length = 0;
    daysIndex.length = 0;
    daysOfWeek.length = 0;
    wind.length = 0;
    cityAlert.textContent = weather.city.name;
    for (let i = 0; i < weather.list.length; i += 8) {
        forecast.push(weather.list[i].weather[0].main);
        tempMax.push(weather.list[i].main.temp_max);
        tempMin.push(weather.list[i].main.temp_min);
        dateMeasured.push(weather.list[i].dt_txt);
        wind.push(weather.list[i].wind.speed);
    }
    for (let i = 0; i < dateMeasured.length; i++) {
        let d = new Date(dateMeasured[i]);
        daysIndex.push(d.getDay());
        daysOfWeek.push(dayName[daysIndex[i]]);
    }
    displayWeather();
}

//La funziokne che si occupa di visualizzare il meteo e al contempo di gestire le animazioni ingresso/uscita tramite la rimozione e l aggiunta di classi

function displayWeather() {
    home.classList.add("animate__fadeOutLeft");
    forecastDisplay.style.display = "inherit";
    forecastDisplay.classList.add("animate__fadeInUp");
    geoLoc.classList.add("animate__fadeInUp");
    footer.classList.remove("fixed-bottom");
    footer.classList.add("animate_fadeInUps")
    home.style.height = "0px";
    for (let i = 0; i < forecast.length; i++) {
        if (forecast[i] === "Clear") {
            dayBg[i].src = "img/sun.svg";
            media[i].style.backgroundImage = "linear-gradient(to bottom right,#E2BB29,#FAB03C 80%)";
            iconLabel[i].textContent = "Clear";
        } else if (forecast[i] === "Rain") {
            dayBg[i].src = "img/rain.svg";
            media[i].style.backgroundImage = "linear-gradient(to bottom right, #597DC5 30%,#258CF1)";
            iconLabel[i].textContent = "Rain";
        } else if (forecast[i] === "Clouds") {
            dayBg[i].src = "img/cloud.svg";
            media[i].style.backgroundImage = "linear-gradient(to bottom right ,#AECCEA, #EDEDED 90%)";
            iconLabel[i].textContent = "Clouds";
        }
        else if (forecast[i] === "Snow"){
            dayBg[i].src = "img/snow.svg";
            media[i].style.backgroundImage = "linear-gradient(to bottom right ,#2f8db3, #5ba5c2 90%)";
            iconLabel[i].textContent = "Snow";
        }
        document.getElementsByClassName("day")[i].textContent = daysOfWeek[i];
        document.getElementsByClassName("day")[0].textContent = "TODAY";
        document.getElementsByClassName("max_temp_display")[i].textContent = Math.floor(tempMax[i]) + "C°";
        document.getElementsByClassName("min_temp_display")[i].textContent = Math.floor(tempMin[i]) + "C°";
        document.getElementsByClassName("wind_display")[i].textContent = wind[i].toFixed(2);
    }
    window.scrollTo(0, 0); //Scroll on top if u are displain another city then u active geoLoc
}

//Richiama la funzione getWather() quando il pulsante "Find Me" viene premuto
//Inserisce come parametro di getWeather la geolocalizzazione
//Rimuove le classi di animazione che verranno re-inserite con displayWeather


geoLoc.addEventListener("click", () =>
    navigator.geolocation.getCurrentPosition(function (position) {
        fetch(`${baseURL}forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`)
            .then(weather => {
                return weather.json();
            }).then(extractInfo);
            forecastDisplay.classList.remove("animate__fadeInUp");
            geoLoc.classList.remove("animate__fadeInUp");
        })

);

//Richiama la funzione getWather() quando il tasto enter viene premuto 
//Inserisce come parametro di getWeather il valore all interno della barra di ricerca
//Rimuove le classi di animazione che verranno re-inserite con displayWeather


searchBox.addEventListener("keypress", function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        getWeather(searchBox.value);
        searchBox.value = "";
    }
    forecastDisplay.classList.remove("animate__fadeInUp");
    geoLoc.classList.remove("animate__fadeInUp");

});

//Richiama la funzione getWather() quando il pulsante submit viene premuto
//Inserisce come parametro di getWeather il valore all interno della barra di ricerca
//Rimuove le classi di animazione che verranno re-inserite con displayWeather


searchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    getWeather(searchBox.value);
    searchBox.value = "";
    forecastDisplay.classList.remove("animate__fadeInUp");
    geoLoc.classList.remove("animate__fadeInUp");

});

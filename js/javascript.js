// PEGAR VARIAVEIS DO HTML
const ELEMENTO_ICONE = document.querySelector("#CLIMA_ICONE");
const ELEMENTO_TEMPERATURA_VALOR = document.querySelector("#MAIN_TEMPERATURA_VALOR p");
const ELEMENTO_TEMPERATURA_DESCRICAO = document.querySelector("#MAIN_TEMPERATURA_DESCRICAO p");
const ELEMENTO_LOCALIZACAO = document.querySelector("#MAIN_LOCALIZACAO p");
const ELEMENTO_NOTIFICACAO = document.querySelector("#MAIN_NOTIFICACAO");

// CRIAR OBJETO COM AS VARIÁVEIS QUE VIRÃO DO API
const weather = {};

// DEFINIR A UNIDADE DA TEMPERATURA
weather.temperature = {
    unit : "celsius"
}

// VARIAVEL PARA CONVERSAO
const KELVIN = 273;

// CHAVE DA API
const key = "5588d52c31aff9e566b8b99ce0042dcc";

// SE O BROWSER SUPORTAR GEOLOCALIZAÇÃO...
if('geolocation' in navigator){

    // PEGA POSIÇÃO ATUAL DO USUÁRIO
    navigator.geolocation.getCurrentPosition(setPosition, showError);

// SE O BROWSER NÃO SUPORTAR GEOLOCALIZAÇÃO...
}else{
    ELEMENTO_NOTIFICACAO.style.display = "block";
    ELEMENTO_NOTIFICACAO.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// DESCOBRIR POSIÇÃO ATUAL DO USUÁRIO
function setPosition(position){

    // PEGA LATITUDE
    let latitude = position.coords.latitude;
    // PEGA LONGITUDE
    let longitude = position.coords.longitude;
    // BUSCAR CLIMA
    getWeather(latitude, longitude);
}

// SE HOUVER ALGUM PROBLEMA COM O SERVIÇO DE LOCALIZAÇÃO...
function showError(error){
    ELEMENTO_NOTIFICACAO.style.display = "block";
    ELEMENTO_NOTIFICACAO.innerHTML = `<p> ${error.message} </p>`;
}

// PEGAR CLIMA DO API EXTERNO
function getWeather(latitude, longitude){

    // CRIAR LINK PARA O API
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    
    // DEPOIS DE CONSEGUIR UM RETORNO DO API...
    fetch(api)
        .then(function(response){
            let data = response.json();
            return data;
        })

        // ATUALIZAR O CLIMA
        .then(function(data){

            // CONVERTER O VALOR
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            // TRANSFORMAR VALOR EM INTEGER
            weather.description = data.weather[0].description;
            // ICONE
            weather.iconId = data.weather[0].icon;
            // CIDADE
            weather.city = data.name;
            // PAIS
            weather.country = data.sys.country;
        })
        .then(function(){

            // CHAMAR FUNCAO
            MOSTRAR_CLIMA();
        });
}

// DISPLAY WEATHER TO UI
function MOSTRAR_CLIMA(){
    ELEMENTO_ICONE.innerHTML = `<img src="icones/${weather.iconId}.png"/>`;
    ELEMENTO_TEMPERATURA_VALOR.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    ELEMENTO_TEMPERATURA_DESCRICAO.innerHTML = weather.description;
    ELEMENTO_LOCALIZACAO.innerHTML = `${weather.city}, ${weather.country}`;
}

// CONVERTER EM FAHRENHEIT
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// QUANDO O USUÁRIO CLICAR NA TEMPERATURA
ELEMENTO_TEMPERATURA_VALOR.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        ELEMENTO_TEMPERATURA_VALOR.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        ELEMENTO_TEMPERATURA_VALOR.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});
var key = "4010f19181a054df4e43fad094631122"
var lat = []
var lon = []
var localSaveCities=[]
var retreiveFromLocal = JSON.parse(localStorage.getItem("cities"))
var savedCity = document.querySelector(".savedCity")
var savedCities = document.querySelector("#savedCities")
var search = document.querySelector("#search")
var requestUrl = "https:api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=imperial&cnt=5&appid=" + key;
var coorUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + search.value + "&limit=1&appid=" + key

//added the days of the week twice so the new date().getDay()+"i" can always find the right day
var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var currentMonth = new Date().getMonth()+1

//starting search 
search.value = "Denver"

//pulling from the local save to populate the previous search area
if(retreiveFromLocal !== null){
for(i=0; i<retreiveFromLocal.length; i++){
  savingCity = document.createElement("li")
    savingCity.innerHTML = retreiveFromLocal[i]
    savingCity.classList.add("savedCity")
    savingCity.addEventListener("click", previousCity)
    localSaveCities.push(search.value)
    savedCities.appendChild(savingCity)
}}

//fetching the city name and extracting the coordinates then plugging them into the weather API
function getWeather(){
fetch("http:api.openweathermap.org/geo/1.0/direct?q=" + search.value + "&limit=1&appid=" + key)
  .then(function (response) {
    if (response.status === 400) {
    clearInput(search)
    search.setAttribute("placeholder", "enter valid city")
    console.log("FETCH ERROR: " + response.status)}
    return response.json();
  })
  .then(function (data) {
    var lat2 = data[0].lat
    var lon2 = data[0].lon
    lat.pop(lat2)
    lat.push(lat2)
    lon.pop(lon2)
    lon.push(lon2)
    return data
  })
  .then(function () {
    fetch("http:api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=imperial&cnt=6&appid=" + key)
    .then(function (response) {
        if (response.status === 400) {
        console.log("FETCH ERROR: " + response.status);}
        return response.json();
    })
  .then(function (data) {
    console.log(data);
    console.log(data.list[1].main.temp)
    document.getElementById("currentCity").innerHTML = search.value + "<br>" + "<span class=currentMonth>" + currentMonth + "/" + new Date().getDate() + "/" + new Date().getFullYear() + "<br>" + "<br>" +  "Five Day Weather Forecast" + "</span>"

    function removeAllChildNodes(parent) {
      while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
      }}
    removeAllChildNodes(document.querySelector("#forecast"))
    day1 = document.createElement("li")
    day1.classList.add("individualForecast")
    if(data.list[0].main.temp < 40){
      var emoji = "&#x1F9CA"
    } else if(data.list[0].main.temp < 60){
      emoji = "&#9925"
    } else { emoji = "&#x2600"}
    day1.innerHTML = "Today " + "<span class=emoji>" + emoji + "</span>" + "<br>" + "Temperature: " + data.list[0].main.temp + "<br>" + "WindSpeed: " + data.list[0].wind.speed + "<br>" + "Humidity: " + data.list[0].main.humidity + "%"
    document.getElementById("forecast").appendChild(day1)
    for(i=1; i<data.list.length; i++){
      if(data.list[0].main.temp < 40){
        var emoji = "&#x1F9CA"
      } else if(data.list[0].main.temp < 60){
        emoji = "&#9925"
      } else { emoji = "&#x2600"}
        day = document.createElement("li")
        day.classList.add("individualForecast")
        day.innerHTML = dayOfWeek[new Date().getDay()+i] + " <span class=emoji>" + emoji + "</span>" + "<br>" + "Temperature: " + data.list[i].main.temp + "<br>" + "WindSpeed: " + data.list[i].wind.speed + "<br>" + "Humidity: " + data.list[i].main.humidity + "%"
        document.getElementById("forecast").appendChild(day)
    }
 } )});
};

//calling the function to populate the page with Denver apon open
getWeather()
// saving the city to both the page, and locaal storage
function saveCity(){
    savingCity = document.createElement("li")
    savingCity.innerHTML = search.value
    savingCity.classList.add("savedCity")
    savingCity.addEventListener("click", previousCity)
    localSaveCities.push(search.value)
    localStorage.setItem("cities", JSON.stringify(localSaveCities))
    savedCities.appendChild(savingCity)
 }

 //when clicking a previous city, calls it to be searched
 function previousCity(){
  search.value=this.innerHTML
  getWeather()
 }

 //a bubbling function to call a city search and save the city name
 function getAndLogWeather(){
  getWeather()
  saveCity()
  }

document.getElementById("searchBtn").addEventListener("click", getAndLogWeather)

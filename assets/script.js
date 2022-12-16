var key = "4010f19181a054df4e43fad094631122"
var lat = []
var lon = []
var savedCity = document.querySelector(".savedCity")
var savedCities = document.querySelector("#savedCities")
var search = document.querySelector("#search")
var requestUrl = "https:api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=imperial&cnt=5&appid=" + key;
var coorUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + search.value + "&limit=1&appid=" + key
var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
search.value = "Denver"
function test3(){
fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + search.value + "&limit=1&appid=" + key)
  .then(function (response) {
    if (response.status === 400) {
    clearInput(search)
    search.setAttribute("placeholder", "enter valid city")
    console.log("FETCH ERROR: " + response.status)}
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    var lat2 = data[0].lat
    var lon2 = data[0].lon
    lat.pop(lat2)
    lat.push(lat2)
    lon.pop(lon2)
    lon.push(lon2)
    console.log("success")
    return data
  })
  .then(function () {
    fetch("https:api.openweathermap.org/data/2.5/forecast?lat=" + lat[0] + "&lon=" + lon[0] + "&units=imperial&cnt=6&appid=" + key)
    .then(function (response) {
        if (response.status === 400) {
        console.log("FETCH ERROR: " + response.status);}
        return response.json();
    })
  .then(function (data) {
    console.log(data);
    console.log(data.list[1].main.temp)
    document.getElementById("currentWeather").innerHTML = data.list[0].main.temp
    document.getElementById("currentCity").innerHTML = search.value + " " + new Date().getMonth() + "/" + new Date().getDay() + "/" + new Date().getFullYear()

    function removeAllChildNodes(parent) {
      while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
      }}
    removeAllChildNodes(document.querySelector("#forecast"))
    day1 = document.createElement("li")
    day1.classList.add("individualForecast")
    day1.innerHTML = "Today" + "<br>" + "Temperature: " + data.list[0].main.temp + "<br>" + "WindSpeed: " + data.list[0].wind.speed + "<br>" + "Humidity: " + data.list[0].main.humidity + "%"
    document.getElementById("forecast").appendChild(day1)
    for(i=1; i<data.list.length; i++){
        day = document.createElement("li")
        day.classList.add("individualForecast")
        day.innerHTML = dayOfWeek[new Date().getDay()+i] + "<br>" + "Temperature: " + data.list[i].main.temp + "<br>" + "WindSpeed: " + data.list[i].wind.speed + "<br>" + "Humidity: " + data.list[i].main.humidity + "%"
        document.getElementById("forecast").appendChild(day)
    }
 } )});
};
function saveCity(){
    savingCity = document.createElement("li")
    savingCity.innerHTML = search.value
    savingCity.classList.add("savedCity")
    savingCity.addEventListener("click", previousCity)
    savedCities.appendChild(savingCity)
 }

 function previousCity(){
  search.value=this.innerHTML
  console.log(search.value)
  test3()
 }

function functions(){
  saveCity();
  test3();
 }
function test2(){
    console.log(search.value)
    console.log(coorUrl)
    console.log(lat)
    console.log(lon)
}
test3()
document.getElementById("searchBtn").addEventListener("click", functions)

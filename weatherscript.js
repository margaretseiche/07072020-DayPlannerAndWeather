$(document).ready(function() {   
    var search = $(".search");
    var listHistory = $(".list-group");
    var today = $("#today");
    var forecast = $("#forecast");
    var cityInput = $("#search-value");    
    var citySearch = "";  //set as empty string here so that whole script can access citySearch
    var cityArray = [];   //set as empty array here so that whole script can access cityArray

    init();

    function init() {
        // Get stored todos from localStorage
        // Parse the JSON string to an object
        var storedCities = JSON.parse(localStorage.getItem("cityArray"));
        var storedLastSearch = JSON.parse(localStorage.getItem("citySearch"));
    
        // If todos were retrieved from localStorage, update the todos array to it
        if (storedCities !== null) {
        cityArray = storedCities;
        }
        if (storedLastSearch !== null) {
            citySearch = storedLastSearch;
        }
        renderList();
        startSearch();
    }

    function storeSearchHistory() {
        // Stringify and set "todos" key in localStorage to todos array
        localStorage.setItem("cityArray", JSON.stringify(cityArray));
    }

    function renderList() {
        listHistory.empty(); 

        for (var i = 0; i < cityArray.length; i++) { 
            var city = cityArray[i];           
            var li = $("<li>").attr("data-index", i).attr("class","weatherCity").appendTo(listHistory);
            var cityItem = $("<span id='cityListItem'>").text(city).appendTo(li);
            var button = $("<button>").text("Remove").addClass("history-button").appendTo(li);
        } 
    }

    search.on("submit",setArray);

    function setArray(event) {    
        event.preventDefault();
        citySearch = $("#search-value").val().trim();
        if (citySearch === "") {
    		return;
        }
        citySearch = citySearch.toLowerCase();
                 
        var arr = citySearch.split(" ");    //splits the string at the spaces to group into separate words
        newArr = [];
        
        for (var k = 0; k < arr.length;k++) {
            var ele = arr[k].split("");
            ele[0] = ele[0].toUpperCase();
            newArr.push(ele.join(""));
        }
        var cityString = newArr.join(" ");
        citySearch = cityString;  
        
        if ((cityArray.indexOf(citySearch) == -1)){
            cityArray.push(citySearch);
        } 
        
        //cityInput.empty();      //no change (still searches but won't clear input field after search)
        //cityInput.val() = "";   //no longer searches

        renderList();
        storeSearchHistory();
        startSearch();
        //cityInput.val() = "";   //searches but does not clear
    }      
   
    function startSearch() {
        $("#today").empty();
        $("#forecast").empty();

        var apiKey = "9a44300c45b75aea6daff91cc878fd61";
        var todayURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial" + "&appid=" + apiKey;

            $.ajax({
                method: "GET",
                url: todayURL
            }).then(function(response) {
                console.log(response);   

            var cityTodayHeadline = $("<h2 id='todayHeadline'>").text(citySearch);
        
            var todayIconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
            var weatherIcon = $("<img id='todayImg'>").attr("src",todayIconURL);   

            var currentTime = $("<h4>").text(moment().format('h:mm a')); 
            var current = $("<h4>").text("Current");
            var currentTemp = $("<h4 id='temp'>").text(Math.round((response.main.temp)) + "\u2109");   
            var todayHighTemp = $("<p>").text("High: " + Math.round((response.main.temp_max)) + "\u2109").addClass("class","tempdetail");   
            var todayLowTemp = $("<p>").text("Low: " + Math.round((response.main.temp_min)) + "\u2109").addClass("class","tempdetail");       
            var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
            var windspeed = $("<p>").text("Wind: " + response.wind.speed + "MPH");  

            today.append(cityTodayHeadline);   
            var todayCardText = $("<div class='col-sm-6 card-body todayCard'>").appendTo(today);
            // var todayCardBlank = $("<div class='col-sm-2 card-body todayCard'>").appendTo(today);
            // var todayCardHumidity = $("<div class='col-sm-4 card-body todayCard'>").appendTo(today);
            //var todayCardImage = $("<div class='col-sm-4 card-body todayCard'>").appendTo(currentTemp);
            var todayCardDetails = $("<div class='col-sm-6 card-body todayCard'>").appendTo(today);

            todayCardText.append(current,currentTemp,weatherIcon);          
            todayCardDetails.append(todayHighTemp,todayLowTemp,humidity,windspeed);      
        
            var latitude = response.coord.lat;
            var longitude = response.coord.lon;        

            var apiKey = "9a44300c45b75aea6daff91cc878fd61";
            var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi?" + "appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;    
        
            $.ajax({
                method: "GET",
                url: uvIndexURL
            }).then(function(response) {
                console.log(response);     
        
            var uvIndexOutput = $("<p>").text("UV Index:  ").appendTo(todayCardDetails);
            var uvText = $("<span id='uv'>").text(response.value).appendTo(uvIndexOutput);   
            });    
              
        });
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySearch + "&units=imperial" + "&appid=" + apiKey;
        
                $.ajax({
                    method: "GET",
                    url: forecastURL
                }).then(function(response) {
                    console.log(response);

                    var cityForecastHeadline = $("<h4>").text("Forecast (for 12:00 noon daily)").appendTo(forecast);

                    for ( var m = 0; m < 24; m++) {

                        var dateNoon = response.list[m].dt_txt;
                        if (dateNoon.includes("12:00:00")) {
                        
                            if (response.list[m].dt_txt[5] === "0") {
                                var forecastMonth = response.list[m].dt_txt[6];
                            } else {
                                var forecastMonth = response.list[m].dt_txt[5] + response.list[m].dt_txt[6]; 
                            }
                            if (response.list[m].dt_txt[8] === "0") {
                                var forecastDay = response.list[m].dt_txt[9];
                            } else {
                                var forecastDay = response.list[m].dt_txt[8] + response.list[m].dt_txt[9]; 
                            }
                            
                            var forecastYear = response.list[m].dt_txt[0] + response.list[m].dt_txt[1] + response.list[m].dt_txt[2] + response.list[m].dt_txt[3];   
                            var forecastDateText = $("<p id='forecastDate'>").text(forecastMonth + "/" + forecastDay + "/" + forecastYear);
                            var forecastTemp = $("<p>").text(Math.round(response.list[m].main.temp) + "\u2109");   
                            var forecastHumidity = $("<p>").text("Humidity: " + response.list[m].main.humidity + "%");  
                            
                            var forecastIconURL = "https://openweathermap.org/img/wn/" + response.list[m].weather[0].icon + "@2x.png";
                            var weatherIcon = $("<img id='forecastImg'>").attr("src",forecastIconURL);   

                            var card = $("<div class='card-body card'>").appendTo(forecast);

                            card.append(forecastDateText,weatherIcon,forecastTemp,forecastHumidity);
                        } 
                    }
                });  
               localStorage.setItem("citySearch", JSON.stringify(citySearch));  

            /*   if (today !== "") {         //does not search and remove buttons no longer work
                cityInput.val() = "";
               }      */
            //   cityInput.val() = "";       //clears input field but does not search
    }

    // When a element inside of the city search history is clicked...
    $(".list-group").on("click", function(event) {
        var element = event.target;

            // If that element is a button...
            if (element.matches("button") === true) {

            // Get its data-index value and remove that city from the list
            var indexRemove = element.parentElement.getAttribute("data-index");  
            cityArray.splice(indexRemove, 1);
            
            // Store updated todos in localStorage, re-render the list
            storeSearchHistory();
            renderList();  
            } else {
                var indexClick = element.parentElement.getAttribute("data-index");
                citySearch = cityArray[indexClick]; 
                startSearch();
            }     
    });                        
}); 
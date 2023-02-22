$(window).on('load', function () {
    currentLocation();
    checkLocalStorage();
});
// API Key 
var APIKey = "f4e255f6ee90a015c4ab5d473e591015";
var q = "";
var now = moment();
//Date
var currentDate = now.format('YYYY-MM-DD');
$("#currentDay").text(currentDate);

//Setting the click 
$("#search-button").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();

    q = $("#city-input").val();
    if (q === '') {
        return alert('Please Enter Valid City Name ! ');
    }
    getWeather(q);

    saveToLocalStorage(q);
});
// Function to create Button for searched city 
function createRecentSearchBtn(q) {
    var newLi = $("<li>")
    var newBtn = $('<button>');
    //Adding Extra ID for Button to stop Creating Duplicate Button on Click
    newBtn.attr('id', 'extraBtn');
    newBtn.addClass("button is-small recentSearch");
    newBtn.text(q);
    newLi.append(newBtn)
    $("#historyList").prepend(newLi);
    //setting click function to prevent duplicate button
    $("#extraBtn").on("click", function () {
        var newQ = $(this).text();
        getWeather(newQ);
    });
}
//Function to get weather details 
// still working on this 
function getWeather(q) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + q + "&units=metric&appid=" + APIKey;
    $.ajax({
        // gets the current weather info
        url: queryURL,
        method: "GET",
        error: (err => { //If API through error then alert 
            alert("Your city was not found. Check your spelling or enter a city code")
            return;
          })
    }).then(function (response) {
        console.log(response)
        //to avoid repeating city information on button click 
        $(".cityList").empty()
        $("#days").empty()
        var cityMain1 = $("<div col-12>").append($("<p><h2>" + response.name + ' (' + currentDate + ')' + "</h2><p>"));
        var image = $('<img class="imgsize">').attr('src', 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png');        
    var degreeMain = $('<p>').text('Temp : ' + response.main.temp + ' °C ');
        var windMain = $('<p>').text('Wind : ' + response.wind.speed + 'KPH');  
        var humidityMain = $('<p>').text('Humidity : ' + response.main.humidity + '%');
        var cityId = response.id;
        displayForecast(cityId);
        cityMain1.append(image).append(degreeMain).append(windMain).append(humidityMain);
        $('#cityList').empty();
        $('#cityList').append(cityMain1);
    });
}
//function to Display 5 Day forecast
function displayForecast(c) {
    $.ajax({ // gets the 5 day forecast API
        url: "https://api.openweathermap.org/data/2.5/forecast?id=" + c + "&units=metric&APPID=" + APIKey,
        method: "GET",
    }).then(function (response) {
        //  Parse response to display forecast for next 5 days underneath current conditions
        var arrayList = response.list;
        for (var i = 0; i < arrayList.length; i++) {
            if (arrayList[i].dt_txt.split(' ')[1] === '12:00:00') {
                console.log(arrayList[i]);
                var cityMain = $('<div>');
                cityMain.addClass('col forecast bg-primary text-white ml-3 mb-3 rounded>');
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp : ' + arrayList[i].main.temp + ' °C');  
                var windMain = $('<p>').text('Wind : ' + arrayList[i].wind.speed + ' KPH');
                var humidityMain = $('<p>').text('Humidity : ' + arrayList[i].main.humidity + '%');                
            cityMain.append(date5).append(image).append(degreeMain).append(windMain).append(humidityMain);
                $('#days').append(cityMain);
            }
        }
    });
};
// Display automatic Current Locaion 
function currentLocation() {
    $.ajax({
        url: "https://freegeoip.app/json/",
        method: "GET",
    }).then(function (response) {
        q = response.city || 'exton';
        console.log(q);
        getWeather(q);
    });
};

// Function to get data store in local Storage 
function checkLocalStorage() {
    var storedData = localStorage.getItem('queries');
    var dataArray = [];
    if (!storedData) {
        console.log("no data stored");
    } else {
        storedData.trim();
        dataArray = storedData.split(',');
        for (var i = 0; i < dataArray.length; i++) {
            createRecentSearchBtn(dataArray[i]);
        }
    }
};
// Function to Set data in Local storage
function saveToLocalStorage(q) {
    var data = localStorage.getItem('queries');
    if (data) {
        console.log(data, q)

    } else {
        data = q;
        localStorage.setItem('queries', data);
    }
    if (data.indexOf(q) === -1) {
        data = data + ',' + q;
        localStorage.setItem('queries', data);
        createRecentSearchBtn(q);
    }
}
//added clear histor fuction to clear searched city list
$("#clear-history").on("click", function (event) {
    $("#historyList").empty();
});
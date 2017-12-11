$(document).ready(() => {
    // Foursquare API Info
    const clientId = 'WYDNPZAIEV2O53YMY1ULLGE1XVW0KHI35WZDABPBCIQULQ00';
    const clientSecret = 'G1LNRJ5F4VGXLHUNWQ3J2MCXUVXRGROORGKZ1SEJUZTPIZLE';
    const url = 'https://api.foursquare.com/v2/venues/explore?near=';
    const imgPrefix = 'https://igx.4sqi.net/img/general/150x200';

    // APIXU Info
    const apiKey = '6c0d4cc4e7c2437584b221503170112';
    const forecastUrl = 'https://api.apixu.com/v1/forecast.json?key=6c0d4cc4e7c2437584b221503170112';

    // Page Elements
    const $input = $('#city');
    const $submit = $('#submit');
    const $destination = $('#destination');
    const $container = $('.container');
    const $weather = $('#weather');
    const $place = $('#venue');
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    

    // AJAX Functions
    async function getVenues() {
        const city = $input.val();
        const urlToGet = url + city + '&venuePhotos=1&limit=3&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=20170305';
        
        try {
            let response = await fetch(urlToGet);
            if (response.ok) {
                let jsonResponse = await response.json();
                console.log(jsonResponse);
                let venues = jsonResponse.response.groups[0].items.map(location => location.venue);
                console.log(venues);
                return venues;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    async function getForecast() {
        const urlToGet = forecastUrl + '&q=' + $input.val() + '&days=4&hour=11';
        
        try {
            let response = await fetch(urlToGet);
            if(response.ok) {
                let jsonResponse = await response.json();
                console.log(jsonResponse);
                
                let days = jsonResponse.forecast.forecastday;
                console.log(days);
                
                return days;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    // Render Functions
    function renderForecast(days) {
        days.forEach(($day, index) => {
            $weather.append('<div class="weatherrow">' + '<h2>High: ' + days[index].day.maxtemp_f + '</h2>' + '<h2>Low: ' + days[index].day.mintemp_f + '</h2>' + '<img src="http://' + days[index].hour[0].condition.icon + '"class="weathericon" />' + '<h2>' + weekDays[(new Date(days[index].date)).getDay()] + '</h2></div>');
        })
    }
    
    function renderVenues(venues) {
        venues.forEach(($venue, index) => {
            $place.append('<div class="venuerow">' + '<h2 class="text-center">' + venues[index].name + '</h2>' + '<img class="venueimage" src="' + imgPrefix +
             venues[index].photos.groups[0].items[0].suffix + '"/>' + '<h6 class="addresstext">Address:</h6>' + '<p>' + venues[index].location.address + '<br>' + venues[index].location.city + '<br>' + venues[index].location.country + '</p>' + '</div>');
        })
        $destination.append('<h1>' + venues[0].location.city + '</h1>');
    }
    
    function excecuteSearch(e) {
        e.preventDefault();
        $place.empty();
        $weather.empty();
        $destination.empty();
        $container.css("visibility", "visible");
        getForecast().then(days =>
        renderForecast(days));
        getVenues().then(venues =>
        renderVenues(venues));
        
        
    }
    
    $submit.click(excecuteSearch);

});

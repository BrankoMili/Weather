const submitButton = document.getElementById("submit");
let cityName = document.getElementsByTagName("input")[0];
let temperature;
let mintemp;
let maxtemp;
const getcurrentLocation = document.getElementById("location");
let countryName = document.getElementById("namecountry");

// Get weather info by input city/country name
let submitInfo = (cityparameter, errorarg) => {
  fetch(
    "http://api.weatherapi.com/v1/forecast.json?key=ee7e71946cf34d04bc1191945220307&q=" +
      cityparameter +
      "&days=3&aqi=no&alerts=no"
  )
    .then((response) => response.json())
    .then((data) => {
      let cityname = data.location.name;
      let countryname = data.location.country;
      let citycountry = cityname + ", " + countryname;
      document.getElementById("locationcitycountry").innerHTML = citycountry;
      // console.log(data);
      // current temperature (fahrenheit and celsius options)
      document.getElementById("forecast").style.display = "flex";
      if (document.getElementById("scale").value === "Celsius") {
        temperature = data.current.temp_c + "°C";
        document.getElementById("temperature").innerHTML = temperature;
        document.getElementById("wrong").innerHTML = "";
      } else {
        temperature = data.current.temp_f + "°F";
        document.getElementById("temperature").innerHTML = temperature;
        document.getElementById("wrong").innerHTML = "";
      }

      // minimum temperature (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        mintemp = data.forecast.forecastday[0].day.mintemp_c + "°C";
        document.getElementById("mintemp").innerHTML = mintemp;
      } else {
        mintemp = data.forecast.forecastday[0].day.mintemp_f + "°F";
        document.getElementById("mintemp").innerHTML = mintemp;
      }

      // maximum temperature (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        maxtemp = data.forecast.forecastday[0].day.maxtemp_c + "°C";
        document.getElementById("maxtemp").innerHTML = maxtemp;
      } else {
        maxtemp = data.forecast.forecastday[0].day.maxtemp_f + "°F";
        document.getElementById("maxtemp").innerHTML = maxtemp;
      }

      // weather description
      let description = data.current.condition.text;
      document.getElementById("description").innerHTML = description;

      //weather icons
      let iconnumber = data.current.condition.icon;
      // If currently is day
      if ((data.current.condition.is_day = 1)) {
        let partof = iconnumber.substring(iconnumber.length - 7);
        let code = "./weather/64x64/day/" + partof;
        document.getElementById("icons").src = code;
        document.getElementById("icons").style.width = "7.2rem";
      }
      // If currently is night
      else {
        let partof = iconnumber.substring(iconnumber.length - 7);
        let code = "./weather/64x64/night/" + partof;
        document.getElementById("icons").src = code;
      }

      // minimum and maximum temperature tommorrow (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        let mintemptomorrow =
          data.forecast.forecastday[1].day.mintemp_c + "°C / ";
        document.getElementById("mintemptomorrow").innerHTML = mintemptomorrow;
        let maxtemptomorrow = data.forecast.forecastday[1].day.maxtemp_c + "°C";
        document.getElementById("maxtemptomorrow").innerHTML = maxtemptomorrow;
      } else {
        let mintemptomorrow =
          data.forecast.forecastday[1].day.mintemp_f + "°F / ";
        document.getElementById("mintemptomorrow").innerHTML = mintemptomorrow;
        let maxtemptomorrow = data.forecast.forecastday[1].day.maxtemp_f + "°F";
        document.getElementById("maxtemptomorrow").innerHTML = maxtemptomorrow;
      }

      //weather icons tomorrow
      let iconnumbertomorrow = data.forecast.forecastday[1].day.condition.icon;
      let partoftom = iconnumbertomorrow.substring(
        iconnumbertomorrow.length - 7
      );
      let codetom = "./weather/64x64/day/" + partoftom;
      document.getElementById("icontomorrow").src = codetom;

      // minimum and maximum temperature for day after tomorrow (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        let mintempdat = data.forecast.forecastday[2].day.mintemp_c + "°C / ";
        document.getElementById("mintempdat").innerHTML = mintempdat;
        let maxtempdat = data.forecast.forecastday[2].day.maxtemp_c + "°C";
        document.getElementById("maxtempdat").innerHTML = maxtempdat;
      } else {
        let mintempdat = data.forecast.forecastday[2].day.mintemp_f + "°F / ";
        document.getElementById("mintempdat").innerHTML = mintempdat;
        let maxtempdat = data.forecast.forecastday[2].day.maxtemp_f + "°F";
        document.getElementById("maxtempdat").innerHTML = maxtempdat;
      }

      // Date of weather tomorrow and for day afer tomorrow
      let dateTomorrow = data.forecast.forecastday[1].date;
      let dateDayaftertomorrow = data.forecast.forecastday[2].date;
      document.getElementById("datetomorrow").innerHTML = dateTomorrow;
      document.getElementById("datedayaftertomorrow").innerHTML =
        dateDayaftertomorrow;

      //weather icons for day after tomorrow
      let iconnumberdat = data.forecast.forecastday[2].day.condition.icon;
      let partofdat = iconnumberdat.substring(iconnumberdat.length - 7);
      let codedat = "./weather/64x64/day/" + partofdat;
      document.getElementById("icondat").src = codedat;
    })

    // if error
    .catch((error) => {
      console.error(error);
      if (!errorarg) {
        document.getElementById("wrong").innerHTML = "No result found";
      } else {
        document.getElementById("wrong").innerHTML = "Something went wrong :(";
      }
      document.getElementById("temperature").innerHTML = "?°C";
      document.getElementById("mintemp").innerHTML = "";
      document.getElementById("maxtemp").innerHTML = "";
      document.getElementById("forecast").style.display = "none";
      document.getElementById("locationcitycountry").innerHTML = "";
    });
};

// Submit on click/enter button
submitButton.addEventListener("click", () => {
  if (document.getElementById("advanced").checked === false) {
    let cityNamevalue = cityName.value;
    submitInfo(cityNamevalue);
  } else {
    let citycountryName = cityName.value + "," + countryName.value;
    submitInfo(citycountryName);
  }
});

window.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    if (document.getElementById("advanced").checked === false) {
      let cityNamevalue = cityName.value;
      submitInfo(cityNamevalue);
    } else {
      let citycountryName = cityName.value + "," + countryName.value;
      submitInfo(citycountryName);
    }
  }
});

// Get location functions
// Get weather info by find current location
function getCoordintes() {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;
    var lat = crd.latitude.toString();
    var lng = crd.longitude.toString();
    let latlngstring = lat + "," + lng;
    // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    getCityname = latlngstring;
    submitInfo(getCityname, true);
    return;
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    document.getElementById("wrong").innerHTML =
      "Please allow the browser to access your location";
  }

  navigator.geolocation.getCurrentPosition(success, error, options);
}

// Button to get location
getcurrentLocation.addEventListener("click", getCoordintes);

// Advanced search button toggle
let advancedSearch = document.getElementById("advanced");

advancedSearch.addEventListener("click", () => {
  if (document.getElementById("advanced").checked === true) {
    document.getElementById("countryname").style.display = "block";
    document.getElementById("tempscale").style.display = "block";
    document.getElementsByTagName("input")[0].placeholder = "City name";
  } else {
    document.getElementById("countryname").style.display = "none";
    document.getElementById("tempscale").style.display = "none";
    document.getElementsByTagName("input")[0].placeholder = "City/country";
  }
});

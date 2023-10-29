const submitButton = document.getElementById("submit");
const cityName = document.getElementsByTagName("input")[0];
const getcurrentLocation = document.getElementById("location");
const countryName = document.getElementById("namecountry");
let temperature;
let mintemp;
let maxtemp;
let mintemptomorrow;
let maxtemptomorrow;
let mintempdat;
let maxtempdat;

// Check if name contain numbers or special characters
function containsNumberSpecialCharacter(str) {
  return /[0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(str);
}

// Get weather info by input city/country name
const submitInfo = (cityparameter, errorarg) => {
  fetch(
    "http://api.weatherapi.com/v1/forecast.json?key=ee7e71946cf34d04bc1191945220307&q=" +
      cityparameter +
      "&days=3&aqi=no&alerts=no"
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("forecast").style.display = "flex";
      const cityname = data.location.name;
      const countryname = data.location.country;
      const citycountry = cityname + ", " + countryname;
      document.getElementById("locationcitycountry").innerHTML = citycountry;
      // current temperature (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        temperature = data.current.temp_c + "°C";
      } else {
        temperature = data.current.temp_f + "°F";
      }
      document.getElementById("temperature").innerHTML = temperature;
      document.getElementById("wrong").innerHTML = "";

      // minimum temperature (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        mintemp = data.forecast.forecastday[0].day.mintemp_c + "°C";
      } else {
        mintemp = data.forecast.forecastday[0].day.mintemp_f + "°F";
      }
      document.getElementById("mintemp").innerHTML = mintemp;

      // maximum temperature (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        maxtemp = data.forecast.forecastday[0].day.maxtemp_c + "°C";
      } else {
        maxtemp = data.forecast.forecastday[0].day.maxtemp_f + "°F";
      }
      document.getElementById("maxtemp").innerHTML = maxtemp;

      // weather description
      const description = data.current.condition.text;
      document.getElementById("description").innerHTML = description;

      //weather icons
      const iconnumber = data.current.condition.icon;
      // If currently is day
      if ((data.current.condition.is_day = 1)) {
        const partof = iconnumber.substring(iconnumber.length - 7);
        const code = "./weather/64x64/day/" + partof;
        document.getElementById("icons").src = code;
        document.getElementById("icons").style.width = "7.2rem";
      }
      // If currently is night
      else {
        const partof = iconnumber.substring(iconnumber.length - 7);
        const code = "./weather/64x64/night/" + partof;
        document.getElementById("icons").src = code;
      }

      // minimum and maximum temperature tommorrow (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        mintemptomorrow = data.forecast.forecastday[1].day.mintemp_c + "°C / ";
        maxtemptomorrow = data.forecast.forecastday[1].day.maxtemp_c + "°C";
      } else {
        mintemptomorrow = data.forecast.forecastday[1].day.mintemp_f + "°F / ";
        maxtemptomorrow = data.forecast.forecastday[1].day.maxtemp_f + "°F";
      }
      document.getElementById("mintemptomorrow").innerHTML = mintemptomorrow;
      document.getElementById("maxtemptomorrow").innerHTML = maxtemptomorrow;

      //weather icons tomorrow
      const iconnumbertomorrow =
        data.forecast.forecastday[1].day.condition.icon;
      const partoftom = iconnumbertomorrow.substring(
        iconnumbertomorrow.length - 7
      );
      const codetom = "./weather/64x64/day/" + partoftom;
      document.getElementById("icontomorrow").src = codetom;

      // minimum and maximum temperature for day after tomorrow (fahrenheit and celsius options)
      if (document.getElementById("scale").value === "Celsius") {
        mintempdat = data.forecast.forecastday[2].day.mintemp_c + "°C / ";
        maxtempdat = data.forecast.forecastday[2].day.maxtemp_c + "°C";
      } else {
        mintempdat = data.forecast.forecastday[2].day.mintemp_f + "°F / ";
        maxtempdat = data.forecast.forecastday[2].day.maxtemp_f + "°F";
      }
      document.getElementById("mintempdat").innerHTML = mintempdat;
      document.getElementById("maxtempdat").innerHTML = maxtempdat;

      // Date of weather tomorrow and for day afer tomorrow
      const dateTomorrow = data.forecast.forecastday[1].date;
      const dateDayaftertomorrow = data.forecast.forecastday[2].date;
      document.getElementById("datetomorrow").innerHTML = dateTomorrow;
      document.getElementById("datedayaftertomorrow").innerHTML =
        dateDayaftertomorrow;

      //weather icons for day after tomorrow
      const iconnumberdat = data.forecast.forecastday[2].day.condition.icon;
      const partofdat = iconnumberdat.substring(iconnumberdat.length - 7);
      const codedat = "./weather/64x64/day/" + partofdat;
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
const submitFunction = () => {
  if (document.getElementById("advanced").checked === false) {
    submitInfo(cityName.value);
  } else {
    if (
      !isNaN(countryName.value) ||
      containsNumberSpecialCharacter(countryName.value)
    ) {
      document.getElementById("wrong").innerHTML =
        "Country name can't contain numbers or special characters";
    } else {
      const citycountryName = cityName.value + "," + countryName.value;
      submitInfo(citycountryName);
    }
  }
};

submitButton.addEventListener("click", () => submitFunction());

window.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    submitFunction();
  }
});

// Get location functions
// Get weather info by find current location
function getCoordintes() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const crd = pos.coords;
    const lat = crd.latitude.toString();
    const lng = crd.longitude.toString();
    const latlngstring = lat + "," + lng;
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

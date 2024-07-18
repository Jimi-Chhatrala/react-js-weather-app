import { useEffect, useState } from "react";
import Search from "../search";

export default function Weather() {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

  const [search, setSearch] = useState("Bengaluru");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchWeatherData(param) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=${apiKey}`
      );
      const data = await response.json();

      if (data.cod == 404) {
        setError(true);
        setErrorMessage(data.message);
        setLoading(false);
      } else if (data.cod === 200) {
        setError(false);
        setWeatherData(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (search.trim() == "") {
      setError(true);
      setLoading(false);
      setErrorMessage("Enter location to search.");
    } else {
      fetchWeatherData(search);
    }
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("bengaluru");
  }, []);

  return (
    <div>
      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      {error ? <div className="error">{errorMessage}</div> : null}
      {loading ? <div className="loading">Loading...</div> : null}
      {!error && !loading ? (
        <div>
          <div className="city-name">
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="temperature">{weatherData?.main?.temp}</div>
          <p className="description">
            {weatherData && weatherData?.weather && weatherData?.weather[0]
              ? weatherData?.weather[0]?.description
              : ""}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <p className="wind">{weatherData?.wind?.speed}</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="column">
              <div>
                <p className="humidity">{weatherData?.main?.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

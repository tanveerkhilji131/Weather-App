import React, { createContext, useState } from "react";
import WeatherCard from "./WeatherCard";

export let userInputContxt = createContext("");

function Searchbar() {
    const [Searchbar, setSearchbar] = useState("");
    const [darkMode, setDarkMode] = useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchbar(event.target.value);
    };

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

  return (
    <section className={`weather-app ${darkMode ? "dark" : "light"}`}>

        <div className="topbar">
            <div>
                <span className="eyebrow">WEATHER NOW</span>
                <h1>Check the weather</h1>
            </div>

            <button className="theme-toggle" onClick={toggleTheme}>
                {darkMode ? "☀" : "☾"}
            </button>
        </div>

        <p className="subtitle">
            Search any city to get the latest weather conditions.
        </p>

        <div className="weather-stage">

            <div className="search-box">
                <input
                    type="text"
                    value={Searchbar}
                    placeholder="Enter city name..."
                    onChange={handleChange}
                />

                <userInputContxt.Provider value={Searchbar}>
                    <WeatherCard />
                </userInputContxt.Provider>
            </div>

        </div>
    </section>
);
}

export default Searchbar;
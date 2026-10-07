import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { userInputContxt } from "./Searchbar";

interface Cards {
    city: string;
    temprature: number | string;
    Wcondition: string;
    Humidity: string;
    Windspeed: number | string;
}

const initialState: Cards = {
    city: "",
    temprature: "",
    Wcondition: "",
    Humidity: "",
    Windspeed: ""
};

type Loading = {
    isCheck: boolean | null;
};

const lodingState: Loading = {
    isCheck: true
};

type Err = {
    err: string;
};

const ErrorState: Err = {
    err: ""
};

interface Main {
    temp: number;
    humidity: number;
}

interface Weather {
    main: string;
}

interface Wind {
    speed: number;
}

interface ApiResponse {
    name: string;
    main: Main;
    weather: Weather[];
    wind: Wind;
}

function WeatherCard() {
    const API_KEY = import.meta.env.VITE_MY_KEY;

    const [Card, setCards] = useState<Cards>(initialState);
    const [Loading, setLoading] = useState<Loading>(lodingState);
    const [Error, setError] = useState<Err>(ErrorState);

    const { city, temprature, Wcondition, Humidity, Windspeed } = Card;

    const inputvalue = useContext(userInputContxt);
    const cityValue = useRef<typeof inputvalue>(null);

    cityValue.current = inputvalue;

    useEffect(() => {
        if (city === "") {
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

        async function fn(urls: string) {
            try {
                const response = await axios.get<ApiResponse>(urls);
                const res = response.data;

                setLoading({
                    ...Loading,
                    isCheck: true
                });

                setCards({
                    ...Card,
                    temprature: res?.main?.temp + "°C",
                    Humidity: "Humidity: " + res?.main?.humidity + "%",
                    Wcondition: res?.weather[0].main,
                    Windspeed: "Wind : " + res?.wind.speed + "m/s",
                    city: res?.name
                });
            } catch (err) {
                setError({
                    err: "City not found"
                });

                setCards({
                    temprature: "",
                    Humidity: "",
                    Wcondition: "",
                    Windspeed: "",
                    city: ""
                });
            }
        }

        fn(url);
    }, [Card.city]);

    const check = () => {
        if (!cityValue.current || !cityValue.current.trim()) {
        alert("Write a city Name First")
            return;
        }

        setLoading({
            ...Loading,
            isCheck: false
        });

        setError({
            err: ""
        });

        setCards({
            ...Card,
            city: cityValue.current
        });
    };

  return (
    <section className="weather-card">

        <button className="search-button" onClick={check}>
            Search
        </button>

        {!!Loading.isCheck === false && Error.err === "" && (
            <div className="state loading">
                <span></span>
                Checking weather...
            </div>
        )}

        {Error.err && (
            <div className="state error">
                {Error.err}
            </div>
        )}

        {!Error.err && temprature && (
            <>
                <div className="weather-header">
                    <div>
                        <span className="label">CURRENT WEATHER</span>
                        <h2>{city}</h2>
                    </div>

                    <span className="condition">
                        {Wcondition}
                    </span>
                </div>

                <div className="temperature">
                    {temprature}
                </div>

                <div className="weather-details">
                    <div className="detail">
                        <span>Humidity</span>
                        <strong>{Humidity.replace("Humidity: ", "")}</strong>
                    </div>

                    <div className="detail">
                        <span>Wind</span>
                        <strong>{Windspeed.replace("Wind : ", "")}</strong>
                    </div>
                </div>
            </>
        )}

        {!Error.err && !temprature && Loading.isCheck && (
            <div className="empty-state">
                <span>☁</span>
                <p>Search for a city to see its weather.</p>
            </div>
        )}

    </section>
);
}

export default WeatherCard;
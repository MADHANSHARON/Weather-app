import { useState, useEffect } from 'react';
import './App.css'
import PropTypes from "prop-types";
//images:
import cloudIcon from './assets/cloud.png';
import rainIcon from './assets/rain.png';
import sunIcon from './assets/sun.png';
import search from './assets/search.png';
import windIcon from './assets/wind.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/icons8-moisture-32.png'


const WeatherDetails=({icon,temp,cityname,country,lat,lon,humidity,wind})=>{
  return(
  <>
    <div className='image'>
      <img src={icon}  alt="rain" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="city">{cityname}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div >
        <span className='lat'>Latitude</span>
        <span>{lat}</span>
      </div>
      <div >
        <span className='log'>Longitude</span>
        <span>{lon}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img src={humidityIcon} alt="humidity-icon" className='humidity'/>
        <div className="data">
        <div className="text">Humidity</div>
          <div className="humidity-percentage">{humidity}%</div>
        </div>
      </div>
      <div className="element">
        <img src={windIcon} alt="Wind" className='humidity'/>
        <div className="data">
          <div className="text">Wind speed</div>
          <div className="wind-percentage">{wind} km/h</div>  
        </div>
      </div>
      
    </div>
  </>
  );
};
WeatherDetails.propTypes ={
  icon:PropTypes.string.isRequired,
  city:PropTypes.string.isRequired,
  country:PropTypes.string.isRequired,
  temp:PropTypes.number.isRequired,
  humidity:PropTypes.number.isRequired,
  wind:PropTypes.number.isRequired,
  lat:PropTypes.number.isRequired,
  lon:PropTypes.number.isRequired,
}

function App() {
  let api_key="389aaf275ba0d1c84a5af1599756d60b";

  
  const [text,setText]=useState("chennai");
  const [icon,setIcon]=useState(rainIcon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("Chennai");
  const [country,setCountry]=useState("IN");
  const [lat,setLat]=useState(0);
  const [lon,setLon]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setwind]=useState(0);
  const [loading,setLoading]=useState(false);
  const [citynotfound,setCitynotfound]=useState(false);
  const [error,setError]=useState(null);

  const weatherIconMap = {
    "01d":sunIcon,
    "01n":sunIcon,
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":cloudIcon,
    "03n":cloudIcon,
    "04d":cloudIcon,
    "04n":cloudIcon,
    "09d":rainIcon,
    "09n":rainIcon,
    "010d":rainIcon,
    "010n":rainIcon,
    "013d":snowIcon,
    "013n":snowIcon,
  };

  const Search = async () =>{
    setLoading(true);
    let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res=await fetch(url);
      let data=await res.json();
      if(data.cod === "404"){
        console.error("city not found");
        setCitynotfound(true);
        setLoading(false);
        return;
      }

      setCity(data.name)
      setHumidity(data.main.humidity);
      setwind(data.wind.speed);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      setCountry(data.sys.country);
      setTemp(Math.floor(data.main.temp));
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode]|| sunIcon);
      setCitynotfound(false);

    } 
    catch (error) {
      console.error("error:",error.message);
      setError("An Error occured while fetching data");
    }
    finally{
      setLoading(false);
    }
  }
 const handlecity =(e)=>{
    setText(e.target.value)
 }
 const handlekeydown =(e) =>{
  if (e.key === "Enter"){
    Search();
  }
 };

 useEffect(function(){
  Search();
 },[]);

  return (
    <>
      <div className='container'>
         <div className='input-container'>
              <input type="text" 
              className='input' 
              onChange={handlecity}  
              value={text} 
              placeholder='Enter the city'
              onKeyDown={handlekeydown}/>
              <div className='search' onClick={() =>{
                Search()
              }}>
              <img src={search}  alt="search" />
              </div>
         </div>
       
{loading &&<div className="loading">Loading...</div>}
{error &&<div className="errormessage">{error}</div>}
{citynotfound &&<div className="city-not-found">City not found</div>}

{!loading && !citynotfound &&<WeatherDetails icon={icon} temp={temp} cityname={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind}/>}

         <p className='copy-right'>Designed by <span>Madhan_v</span></p>
      </div>
    </>
  )
}

export default App
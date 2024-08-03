const apikey="12478ddaf6555e01ed6e420ea0a3246f";
const searchButton = document.querySelector(".searchBtn");
const cityInput=document.querySelector(".inputCity");
const weatherCardsDiv=document.querySelector(".weatherCards");
const mainCard=document.querySelector(".currentWeather");
const locationButton = document.querySelector(".locationBtn");
const cardDetails=(name,weatherElement,index)=>
{
	if(index===0)
	{
		return `<div class="details">
                    <h2>${name} (${weatherElement.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature : ${(weatherElement.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind : ${weatherElement.wind.speed} M/S</h4>
                    <h4>Humidity : ${weatherElement.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img  src="https://openweathermap.org/img/wn/${weatherElement.weather[0].icon}@4x.png" alt="weather icon"> 
                    <h4>${weatherElement.weather[0].description}</h4>
                </div>`;
	}
	else{
		return `<li class="card">
                        <h3>${weatherElement.dt_txt.split(" ")[0]}</h3>
                        <img  src="https://openweathermap.org/img/wn/${weatherElement.weather[0].icon}@2x.png" alt="weather icon">
                        <h4>Temp : ${(weatherElement.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind : ${weatherElement.wind.speed} M/S</h4>
                        <h4>Humidity : ${weatherElement.main.humidity}%</h4>
                    </li>`;
	}
};
const getWeather=(name,lat,lon)=>{
	let weatherURL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}`;
	fetch(weatherURL).then(res => res.json()).then(data =>{
		const uniqueDays = [];
		const fivedaysForecast=data.list.filter(forecast =>{
			const forecastDate=new Date(forecast.dt_txt).getDate();
			if(!uniqueDays.includes(forecastDate))
			{
				return uniqueDays.push(forecastDate);
			}
		});
		cityInput.value="";
		weatherCardsDiv.innerHTML="";
		mainCard.innerHTML="";
		fivedaysForecast.forEach((weatherElement,index)=> {
			if(index===0)
			{
				mainCard.insertAdjacentHTML("beforeend",cardDetails(name,weatherElement,index));
			}
			else
			{
				weatherCardsDiv.insertAdjacentHTML("beforeend",cardDetails(name,weatherElement,index));
			}
		});
	}).catch((err)=>{
		console.log(err);
	});
};
const getCityCoordinates=()=>{
	const city=cityInput.value.trim();
	if(!city)return;
	let geoCoordinatesURL=`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`;
	fetch(geoCoordinatesURL).then(res => res.json()).then(data =>{
		if(!data.length)return alert(`No "${city}" named city found.`);
		const {name,lat,lon}=data[0];
		getWeather(name,lat,lon);
	}).catch((err)=>{
		console.log("An error occured while fetching your coordinates.");
	});
};
const getUserCoordinates=()=>{
	navigator.geolocation.getCurrentPosition(
		position=>{
			const {latitude,longitude}=position.coords;
			const cityNameURL=`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apikey}`;
			fetch(cityNameURL).then(res => res.json()).then(data =>{
				cityName=data[0].name;
				getWeather(cityName,latitude,longitude)
			}).catch((err)=>{
				console.log("An error occured while fetching your city.");
			});
		},
		error=>{
			if(error.code === error.PERMISSION_DENIED){
				alert("Geolocation request denied. Please reset location to grant access again.");
			}
		}
	);
}
searchButton.addEventListener("click",getCityCoordinates);
locationButton.addEventListener("click",getUserCoordinates);
cityInput.addEventListener("keyup",(e)=>{
	if(e.key === "Enter")
	{
		getCityCoordinates();
	}
});
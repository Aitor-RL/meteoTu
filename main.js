import './style.css'

const cityStorage = localStorage.getItem('city')
if(cityStorage){
  document.getElementById('city').value=cityStorage
  getData(cityStorage)
} 

document.getElementById('city').addEventListener('change', handleChangeCity)
document.getElementById('geo').addEventListener('click', handleClickGeo)

function handleClickGeo(event){
  if(!navigator.geolocation){
    console.log('No esta soportada la geolocación')
    return 
  }

  navigator.geolocation.getCurrentPosition(async position => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    getData(lat+','+lon)
  })
}
async function handleChangeCity(event){
  const city = event.target.value
  localStorage.setItem('city',city)
  getData(city)
}

async function getData(city){
  const data = await getForecastFromApi(city)
  try{
  document.getElementById('actTemp').innerHTML=data.current.temp_c + 'º'
  document.getElementById('actState').innerHTML=data.current.condition.text
  document.getElementById('todayTemp').innerHTML=data.forecast.forecastday[0].day.avgtemp_c
  document.getElementById('todayState').innerHTML=data.forecast.forecastday[0].day.condition.text
  
  document.getElementById('tomorrowTemp').innerHTML=data.forecast.forecastday[1].day.avgtemp_c
  document.getElementById('tomorrowState').innerHTML=data.forecast.forecastday[1].day.condition.text
  
  document.getElementById('tomorrow2Temp').innerHTML=data.forecast.forecastday[2].day.avgtemp_c
  document.getElementById('tomorrow2State').innerHTML=data.forecast.forecastday[2].day.condition.text
  }catch(error){
    document.getElementById('actTemp').innerHTML='ERROR al obtener los datos.'
  }

}

async function getForecastFromApi(location){
  // https://rapidapi.com/weatherapi/api/weatherapi-com/
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '71e59e906dmshfdc9ed284df2469p1b599cjsn0355f0f200d5',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };
  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`
  const response = await fetch(url, options)
  const data= await response.json()
  console.log(data)
  document.getElementById('city').value=data.location.name
  return data
}
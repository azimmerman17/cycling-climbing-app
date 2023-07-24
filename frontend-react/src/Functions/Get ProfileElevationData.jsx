import GetDistanceFromLatLonInKm from "./GetDistanceFromLatLonInKm"

const GetProfileElevationData = async (route) => {
  let polyline_distance = 0
  let polyline_route = []
  
  const fetchElevationData = async (lat, lon) => {
    const BASE_URL = 'https://api.open-meteo.com/v1/elevation?'
    const location = `latitude=${lat}&longitude=${lon}`
    const url = BASE_URL + location
    const response = await fetch(url)     
    const data = await response.json()
    return data.elevation[0]
  }  

  route.map( async (point, i) => {
    let elevation = await fetchElevationData(point[0], point[1])
    let pointData = {
      elevation,
      polyline_distance
    }

    polyline_route[i] = pointData
    
    if (i < route.length - 1) {
      polyline_distance += GetDistanceFromLatLonInKm(route[i][0],route[i][1],route[i+1][0], route[i+1][1])
    }
  })
  return polyline_route
}

export default GetProfileElevationData
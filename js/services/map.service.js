export const mapService = {
  initMap,
  addMarker,
  panTo,
  setCurrPosition,
}

var gMap, gInfoWindow
function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    gInfoWindow = new google.maps.InfoWindow()
    return gMap
  })
}

function setCurrPosition(position) {
  console.log('hi')
  const pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  }
  gInfoWindow.setPosition(pos)
  gInfoWindow.setContent('Location found.')
  gInfoWindow.open(gMap)
  gMap.setCenter(pos)
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyAZeW6x69JDcxYkCYh9QbNsTtiEW15Vuvk' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

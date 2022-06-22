import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos

window.onGo = onGo;
window.onDelete = onDelete;

function onInit() {
  mapService
    .initMap()
    .then((map) => {
      map.addListener('click', (mapClickEv) => {
        const pos = getPositionFromClick(mapClickEv)
        locService.addLoc(pos)
        onGetPlaces()
      })
    })
    .catch(() => console.log('Error: cannot init map')) 
    onGetPlaces()
}

function onGetPlaces() {
    locService.getLocs()
        .then((places) => renderPlaces(places))
}

function renderPlaces(places) {
    console.log(places);

    let strHtml = places.map((place) => {
        return ` <tr>
                  <td>${place.name}</td>
                  <td><button onclick="onDelete('${place.id}')">Delete</button></td>
                  <td><button onclick="onGo('${place.id}')">Go</button></td>
                </tr>`
    })

    document.querySelector('.locs-container').innerHTML = strHtml.join('')
}

function onDelete(id){
    console.log(id);
    locService.deleteLoc(id)
    onGetPlaces()
}

function onGo(id){
    console.log(id);
    locService.setLocToGo(id)
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => mapService.setCurrPosition(position))
      }
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
}

function getPositionFromClick(ev) {
  const pos = ev.latLng
  return { lat: pos.lat(), lng: pos.lng() }
}

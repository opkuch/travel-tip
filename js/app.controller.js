import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetInputLocation = onGetInputLocation


function onInit() {
  mapService
    .initMap()
    .then((map) => {
      map.addListener('click', (mapClickEv) => {
        const pos = locService.getPositionFromClick(mapClickEv)
        locService.addLoc(pos)
      })
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
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
        navigator.geolocation.getCurrentPosition((position) =>
          mapService.setCurrPosition(position)
        )
      }
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo(lat, lng) {
  console.log('Panning the Map')
  mapService.panTo(lat, lng)
}

function onGetInputLocation(ev) {
  ev.preventDefault()
  const address = document.querySelector('.loc-search').value
  const pos = locService.getInputPos(address)
    pos.then(pos => {
        if(pos) onPanTo(pos.lat, pos.lng)
        else alert('No such location!')
    })
  
}

function onCopyToClipboard(){
    navigator.clipboard.writeText(window.location.href);
}
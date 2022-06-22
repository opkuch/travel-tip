import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetInputLocation = onGetInputLocation

window.onGo = onGo
window.onDelete = onDelete
window.onCopyToClipboard = onCopyToClipboard

function onInit() {
  mapService
    .initMap()
    .then((map) => {
      renderQueryStringParams()
      map.addListener('click', (mapClickEv) => {
        const pos = locService.getPositionFromClick(mapClickEv)
        const locName = prompt('Enter location name')
        locService.addLoc(pos, locName)
        onGetPlaces()
      })
    })
    .catch(() => console.log('Error: cannot init map'))
  onGetPlaces()
}

function onGetPlaces() {
  locService.getLocs().then((places) => renderPlaces(places))
}

function renderPlaces(places) {
  let strHtml = places.map((place) => {
    return `    <article class="loc-card">
                  <span class="loc-name">${place.name}</span>
                  <div class="card-btns">
                    <button class="btn delete-btn" onclick="onDelete('${place.id}')">Delete</button>
                    <button class="btn go-btn" onclick="onGo('${place.id}')">Go</button>
                  </div>  
                </article>
                `
  })

  document.querySelector('.locs-container').innerHTML = strHtml.join('')
}

function renderQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const pos = {
    lat: +queryStringParams.get('lat') || 31.78,
    lng: +queryStringParams.get('lng') || 35.19,
  }
  onPanTo(pos.lat, pos.lng)
}

function onDelete(id) {
  locService.deleteLoc(id)
  onGetPlaces()
}

function onGo(id) {
  locService.setLocToGo(id)
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(pos) {
  console.log('Adding a marker')
  mapService.addMarker({ lat: pos.lat, lng: pos.lng })
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
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          mapService.setCurrPosition(position)
          onAddMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        })
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
        if (pos) {
            onPanTo(pos.lat, pos.lng)
            onAddMarker(pos)
        }
        else alert('No such location!')
    })

}

function onCopyToClipboard() {
    navigator.clipboard.writeText(window.location.href);
}

function renderCurrLocation(id) {
    const currLoc = locService.getLocById(id)
    document.querySelector('.locs').innerText = currLoc.name
}



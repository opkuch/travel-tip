import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilService } from './services/util.service.js'
window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGetInputLocation = onGetInputLocation


window.onGo = onGo;
window.onDelete = onDelete;

function onInit() {
    mapService
        .initMap()
        .then((map) => {
            map.addListener('click', (mapClickEv) => {
                const pos = locService.getPositionFromClick(mapClickEv)
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
                  <td><button class="btn delete-btn" onclick="onDelete('${place.id}')">Delete</button></td>
                  <td><button class="btn go-btn" onclick="onGo('${place.id}')">Go</button></td>
                </tr>`
    })

    document.querySelector('.locs-table').innerHTML = strHtml.join('')
}

function onDelete(id) {
    console.log(id);
    locService.deleteLoc(id)
    onGetPlaces()
}

function onGo(id) {
    console.log(id);
    locService.setLocToGo(id)
    renderCurrLocation(id)
    // onSetQueryStringParams(id)
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
        if (pos) onPanTo(pos.lat, pos.lng)
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


// function onSetQueryStringParams(id) {
//     const currLoc = locService.getLocById(id)

//     const queryStringParams = `?lat=${currLoc.lat}&lng=${currLoc.lng}`
//     const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
//     window.history.pushState({ path: newUrl }, '', newUrl)
// }

// function renderMapByQueryStringParams(id) {
//     // Retrieve data from the current query-params
//     const currLoc = locService.getLocById(id)
//     const queryStringParams = new URLSearchParams(window.location.search)

//     ///להפעיל את הגו ךפי האיידי

//     const filterBy = {
//         vendor: queryStringParams.get('vendor') || '',
//         minSpeed: +queryStringParams.get('minSpeed') || 0,
//     }

//     if (!filterBy.vendor && !filterBy.minSpeed) return

//     document.querySelector('.filter-vendor-select').value = filterBy.vendor
//     document.querySelector('.filter-speed-range').value = filterBy.minSpeed
//     setCarFilter(filterBy)
// }


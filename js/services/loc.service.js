export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    centerMap,
}

// import {utilService} from './services/util.service.js'

const locs = [
    { id: makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function deleteLoc(id) {
    var loc = getLocById(id)
    console.log(loc);
    gPlaces.splice(placeIdx, 1)
    // _savePlacesToStorage()
}

function centerMap(id) {
    const loc = getLocById(id)
    const pos = { lat: loc.lat, lng: loc.lng }
    console.log(pos);
    gMap.setCenter(pos)
}

function getLocById(locId) {
    var loc = locs.find((loc) => loc.id = locId)
    return loc
}

function addLoc(pos) {
    const locName = prompt('Name your place')
    const loc = {
        id: makeId(),
        name: locName,
        lat: pos.lat,
        lng: pos.lng,
    }
    locs.push(loc)
    console.log(locs)
}


function makeId(length = 6) {
    const possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
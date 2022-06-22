import { storageService } from "./storage.service.js";
import { mapService } from './map.service.js'
export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    setLocToGo,
}

// import {utilService} from './services/util.service.js'
const LOC_KEY = 'locDB'

let locs = [
    { id: makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    locs = storageService.loadFromStorage(LOC_KEY) || locs
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function deleteLoc(id) {
    var locIdx = getLocIdx(id)
    locs.splice(locIdx, 1)
    storageService.saveToStorage(LOC_KEY, locs)

}

function setLocToGo(id) {
    const loc = getLocById(id)
    const pos = { lat: loc.lat, lng: loc.lng }
    mapService.centerMap(pos)
}

function getLocById(locId) {
    var loc = locs.find((loc) => loc.id === locId)
    return loc
}

function getLocIdx(locId) {
    var loc = locs.findIndex((loc) => loc.id === locId)
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
    storageService.saveToStorage(LOC_KEY, locs)
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
import { storageService } from "./storage.service.js";
import { mapService } from './map.service.js'
import { utilService } from './util.service.js'

export const locService = {
    getLocs,
    addLoc,
    deleteLoc,
    setLocToGo,
    getPositionFromClick,
    getLocById,
}

const LOC_KEY = 'locDB'

let locs = [
    { id: utilService.makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: utilService.makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
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
        id: utilService.makeId(),
        name: locName,
        lat: pos.lat,
        lng: pos.lng,
    }
    locs.push(loc)
    storageService.saveToStorage(LOC_KEY, locs)
}

function getPositionFromClick(ev) {
    const pos = ev.latLng
    return { lat: pos.lat(), lng: pos.lng() }
}

function getInputPos(address) {
    const formatAddress = address.replaceAll(' ', '+')
    return _connectToGeoloc(formatAddress).then((data) => {
        if (data.results.length) return data.results[0].geometry.location


    })
}

function _connectToGeoloc(address) {
    const API_KEY = 'AIzaSyAZeW6x69JDcxYkCYh9QbNsTtiEW15Vuvk'
    return fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
    ).then((res) => {
        return res.json()
    })
}

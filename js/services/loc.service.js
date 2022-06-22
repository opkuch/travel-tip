export const locService = {
  getLocs,
  addLoc,
  getInputPos,
}

import { utilService } from './util.service.js'

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
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
  console.log(locs)
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

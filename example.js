'use strict'

const createHafas = require('bvg-hafas')
const createFetchAlternatives = require('.')

const hafas = createHafas('hafas-find-alternative-legs example')
const fetchAlternatives = createFetchAlternatives(hafas)

const friedrichstr = '900000100001'
const senefelderplatz = '900000110005'

hafas.journeys(friedrichstr, senefelderplatz, {results: 1})
.then(([journey]) => fetchAlternatives(journey))
.then((journey) => {
	console.log(journey.legs)
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})

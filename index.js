'use strict'

const debug = require('debug')('hafas-find-alternative-legs')

const minute = 60 * 1000
const DURATION_THRESHOLD = minute // todo: make customisable

const stationOrStopId = stop => stop.station && stop.station.id || stop.id

// todo: parameter for time window
// todo: option for max nr of alternatives
// todo: accessibility, bike, language
const findLegAlternatives = (hafas, leg) => {
	const dur = new Date(leg.arrival) - new Date(leg.departure)

	// todo: check earlier/later until enough alternatives
	return hafas.journeys(leg.origin, leg.destination, {
		departure: new Date(new Date(leg.departure) - 10 * minute),
		transfers: 0,
		results: 10, remarks: false, startWithWalking: false
	})
	.then((journeys) => {
		return journeys
		.map((altJourney) => {
			return altJourney.legs.find(l => stationOrStopId(l.origin) === stationOrStopId(leg.origin))
		})
		.filter((altLeg, i) => {
			if (!altLeg) {
				debug(i, 'no alt leg', altLeg)
				return false
			}

			if (altLeg.cancelled || !altLeg.departure || !altLeg.arrival) {
				debug(i, 'cancelled or invalid', altLeg)
				return false
			}
			const altDur = new Date(altLeg.arrival) - new Date(altLeg.departure)
			if ((altDur - dur) > DURATION_THRESHOLD) {
				debug(i, 'duration', altLeg)
				return false
			}
			return true // todo: more?
		})
		.map((altLeg) => {
			return {
				tripId: altLeg.id,
				line: altLeg.line,
				direction: altLeg.direction,
				when: altLeg.departure, delay: leg.departureDelay
			}
		})
	})
}

const addLegAlternatives = (hafas, leg) => {
	return findLegAlternatives(hafas, leg)
	.then((alternatives) => {
		leg.alternatives = alternatives
		return leg
	})
}

const createAddAlternatives = (hafas) => {
	const addAlternatives = (journey) => {
		const tasks = []
		for (const leg of journey.legs) {
			if (!leg.line) continue
			if (leg.alternatives) continue // todo: earlier alternatives?
			tasks.push(addLegAlternatives(hafas, leg))
		}

		return Promise.all(tasks).then(() => journey)
	}
	return addAlternatives
}

module.exports = createAddAlternatives

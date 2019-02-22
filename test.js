'use strict'

const a = require('assert')
const createFetchAlternatives = require('.')

const second = 1000
const minute = 60 * second
const fromIso = iso => +new Date(iso)
const toIso = t => new Date(t).toISOString()
const journey = leg => ({legs: [{...leg}]})

const line1 = {
	type: 'line',
	id: '1',
	name: 'one',
	public: true,
	mode: 'train',
	product: 'suburban'
}
const line2 = {
	type: 'line',
	id: '2',
	name: 'two',
	public: true,
	mode: 'bus',
	product: 'bus'
}
const dep = '2019-02-21T13:32:00.000+01:00'
const leg = {
	id: '12345',
	origin: {
		type: 'stop',
		id: 'A',
		name: 'station A',
		location: {type: 'location', latitude: 1.23, longitude: 3.21}
	},
	destination: {
		type: 'stop',
		id: 'B',
		name: 'station B',
		location: {type: 'location', latitude: 2.34, longitude: 4.32}
	},
	departure: dep,
	arrival: '2019-02-21T13:35:00.000+01:00',
	line: line1,
	direction: 'foo',
	cycle: {min: 120, max: 300, nr: 36}
}

const alt1Dep = toIso(fromIso(dep) - 5 * minute)
const alt2Dep = toIso(fromIso(dep) + 1 * minute)

const hafasMock = {
	journeys: (from, to, opt) => {
		a.strictEqual(from, leg.origin)
		a.strictEqual(to, leg.destination)
		a.ok(opt)
		a.strictEqual(fromIso(opt.departure), fromIso(dep) - 10 * minute)
		a.strictEqual(opt.transfers, 0)

		const legs = [{
			...leg,
			id: leg.id + '-1',
			departure: alt1Dep,
			arrival: toIso(fromIso(dep) - 2 * minute)
		}, {
			...leg,
			id: leg.id + '-2',
			departure: alt2Dep,
			arrival: toIso(fromIso(dep) + 4 * minute + 30 * second), // 3m30s
			line: line2
		}, { // cancelled, to be filtered out
			...leg,
			id: leg.id + '-3',
			cancelled: true,
			departure: toIso(fromIso(dep) + 4 * minute),
			arrival: toIso(fromIso(dep) + 7 * minute)
		}, { // too slow, to be filtered out
			...leg,
			id: leg.id + '-4',
			departure: toIso(fromIso(dep) + 6 * minute),
			arrival: toIso(fromIso(dep) + 11 * minute) // 5m
		}]
		return Promise.resolve(legs.map(journey))
	}
}

const fetchAlternatives = createFetchAlternatives(hafasMock)
fetchAlternatives(journey(leg))
.then(({legs}) => {
	const alts = legs[0].alternatives
	a.ok(Array.isArray(alts))
	a.strictEqual(alts.length, 2)

	a.ok(alts[0])
	a.strictEqual(alts[0].tripId, '12345-1')
	a.strictEqual(alts[0].line, line1)
	a.strictEqual(alts[0].when, alt1Dep)

	a.ok(alts[1])
	a.strictEqual(alts[1].tripId, '12345-2')
	a.strictEqual(alts[1].line, line2)
	a.strictEqual(alts[1].when, alt2Dep)

	// todo
})
.catch((err) => {
	console.error(err)
	process.exitCode = 1
})

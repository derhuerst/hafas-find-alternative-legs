# hafas-find-alternative-legs

**Given a [`hafas-client`](https://npmjs.com/package/hafas-client) journey, get alternatives for each leg from HAFAS.**

[![npm version](https://img.shields.io/npm/v/hafas-find-alternative-legs.svg)](https://www.npmjs.com/package/hafas-find-alternative-legs)
[![build status](https://api.travis-ci.org/derhuerst/hafas-find-alternative-legs.svg?branch=master)](https://travis-ci.org/derhuerst/hafas-find-alternative-legs)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-find-alternative-legs.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst) [![Greenkeeper badge](https://badges.greenkeeper.io/derhuerst/hafas-find-alternative-legs.svg)](https://greenkeeper.io/)


## Installation

```shell
npm install hafas-find-alternative-legs
```


## Usage

```js
const createHafas = require('bvg-hafas')
const createFetchAlternatives = require('hafas-find-alternative-legs')

const hafas = createHafas('my awesome program')
const fetchAlternatives = createFetchAlternatives(hafas)

const friedrichstr = '900000100001'
const senefelderplatz = '900000110005'

hafas.journeys(friedrichstr, senefelderplatz, {results: 1})
.then(([journey]) => fetchAlternatives(journey))
.then((journeyWithAlternatives) => {
	console.log(journeyWithAlternatives.legs)
})
.catch(console.error)
```


## Contributing

If you have a question or need support using `hafas-find-alternative-legs`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-find-alternative-legs/issues).

'use strict'

const axios = require('axios').default;

const api = axios.create({
    baseURL: 'https://stats.fn.sportradar.com/',
    Headers: {
        'accept-ranges': 'bytes',
        age: 131412,
        'cache-control': 'public, max-age=2592000, immutable',
        'content-encoding': 'gzip',
        'content-length': 7074,
        'content-type': 'application/json; charset=UTF-8',
        etag: 'W/"57ee-17309d912c9"',
        server: 'nginx / 1.10.3',
        status: 304,
        vary: 'Accept-Encoding',
        via: '1.1 varnish-v4',
        'x-powered-by': 'Express',
        'x-sbe': 'sir_prod_s5_web2',
        'x-srv': 's5-prod-nov1-fvauto-0b3a4823a989f594e',
        'x-varnish': 685861853
    }
})

class sportApi {
    constructor(bettingHouse) {
        this.bettingHouse = bettingHouse;
    }

    allDefinitions(id = '5bc333c9e86aeb31125b4b35e9038eb5') {
        return new Promise((resolve, reject) => {
            api.get(`https://s5.sir.sportradar.com/translations/common/en.${id}.json`).then((all) => {
                resolve(all.data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    modalData(sportId, method) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/en/Europe:Berlin/gismo/config_tree_mini/41/0/${sportId}`).then((sport) => {
                if (method == 'all') {
                    resolve(sport.data)
                }
                if (method == 'categories') {
                    resolve(sport.data.doc[0].data[0])
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }

    localData(sportId, localId, method) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/en/Europe:Berlin/gismo/config_tree_mini/41/0/${sportId}/${localId}`).then((sport) => {
                if (method == 'all') {
                    resolve(sport.data)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    }

    liague(ligueId) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/en/America:Argentina:Buenos_Aires/gismo/stats_season_meta/${ligueId}`).then((ligue) => {
                resolve(ligue.data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    liagueSummary(ligueId) {
        return new Promise((resolve, reject) => {
            api.get(`common/en/Europe:Berlin/gismo/stats_season_leaguesummary/${ligueId}/main`).then((ligue) => {
                resolve(ligue.data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    seasonGoals(leagueId) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/en/America:Argentina:Buenos_Aires/gismo/stats_season_goals/${leagueId}/main`).then((ligue) => {
                resolve(ligue.data)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    leagueFixtures(liagueId) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/en/America:Argentina:Buenos_Aires/gismo/stats_season_fixtures2/${liagueId}/1`).then((ligue) => {
                resolve(ligue.data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

class sportData {
    constructor(bettingHouse, configs = {
        languageId: '514d1e14ad5c11eeebf17ba7f5dc97ad',
        server: 'gismo',
        getCommonContents: false,
        lang: 'en'
    }) {
        this.configs = configs;
        this.bettingHouse = bettingHouse;
    }

    getByPath(path) {
        return new Promise((resolve, reject) => {
            api.get(`${this.bettingHouse}/${path}`).then(rest => {
                return resolve(rest.data)
            }).catch(e => {
                return reject(e)
            })
        })
    }

    getByUrl(url) {
        return new Promise((resolve, reject) => {
            api.get(url).then(rest => {
                return resolve(rest.data)
            }).catch(e => {
                return reject(e)
            })
        })
    }

    getInfo(region, method, values) {
        return new Promise((resolve, reject) => {
            if (this.configs.getCommonContents == true) {
                if (method == 'common') {
                    api.get(`https://s5.sir.sportradar.com/translations/common/en.${this.configs.languageId}.json`).then((all) => {
                        resolve(all.data)
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    resolve({ contents: null, status: 'Err', mensage: 'method Is invalid' })
                }
            } else {
                api.get(`${this.bettingHouse}/${this.configs.lang || 'en'}/${region}/${this.configs.server || 'gismo'}/${method}/${values}`).then((data) => {
                    resolve(data.data.doc[0])
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    }
}

module.exports = { sportData, sportApi };


// 🔽 Express Server para manter o Render ativo
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API Radar Sport está rodando com Express no Render!');
});

app.listen(PORT, () => {
  console.log(`Servidor Express iniciado na porta ${PORT}`);
});
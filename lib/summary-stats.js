'use strict';
var file = process.argv[2] || 'data.json'
var fs = require('fs')
var data = JSON.parse(fs.readFileSync(file))
var orgsKey = 'Institutions on GitHub'
var orgs = data[orgsKey]
var langs = {}

orgs.forEach(function (org) {
    // to avoid if stmt
    org.repos = org.repos || []

    org.repos.forEach(function (repo) {
        for (var lang in repo.languages) {
            // initialize languages object with all 0s
            if (!langs[lang]) {
                langs[lang] = {
                    'repos': 0,
                    'primaries': 0,
                    'lines': 0
                }
            }

            // record total lines
            langs[lang].lines += repo.languages[lang]
            // record repo using language
            langs[lang].repos++
        }

        // record primary language
        let pl = repo.primary_language
        if (pl && langs[pl]) {
                langs[pl].primaries++
        } else if (pl) {
            // it's actually possible for a repo to have nothing listed in
            // languages array but still have a primary language (wth!), see
            // BCLibCoop/evergreen-chef for example
            langs[pl] = {
                'repos': 0,
                'primaries': 1,
                'lines': 0
            }
        }

    })
})

// sort the data by number of repos appeared in
// NOTE: subjective, could argue any of the 3 data points should be sort
var keys = Object.keys(langs).sort(function(a, b) {
    return langs[b].repos - langs[a].repos
})

// poor person's CSV serializer
// header row
console.log('"language","repos appeared in","primary language in repo","total lines across repos"')
keys.forEach(function(key) {
    var datum = langs[key]
    console.log('"' + key + '","' + datum.repos + '","' + datum.primaries + '","' + datum.lines + '"')
})
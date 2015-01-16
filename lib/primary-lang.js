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
        var pl = repo.primary_language
        if (pl) {
            if (langs[pl]) {
                langs[pl]++
            } else {
                langs[pl] = 1
            }
        }
    })
})

// poor person's CSV serializer
// header row
console.log('"language","repos"')
for (var lang in langs) {
    console.log('"' + lang + '","' + langs[lang] + '"')
}

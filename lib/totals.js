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
            if (langs[lang]) {
                langs[lang] += repo.languages[lang]
            } else {
                langs[lang] = repo.languages[lang]
            }
        }
    })
})

// poor person's CSV serializer
// header row
console.log('"language","bytes of code"')
for (var lang in langs) {
    console.log('"' + lang + '","' + langs[lang] + '"')
}

var fs = require('fs')
var usernameFromUrl = require('./lib/username-from-url')
var getOrgRepos = require('./lib/get-org-repos')
var getRepoLanguages = require('./lib/get-repo-languages')

var file = process.argv[2] || 'orgs.json'
var data = JSON.parse(fs.readFileSync(file))
var limit = parseInt(process.argv[3]) || Infinity
var orgsKey = 'Institutions on GitHub'
// allow a limit to be passed, mainly for testing purposes
// so `node index 2` only runs thru 1st 2 orgs
var orgs = data[orgsKey].slice(0, limit)
var count = 0 // number of repos left to get info on

// orgs is an array of objects with name & URL pairs
orgs.forEach(function(org, orgIndex) {
    var username = usernameFromUrl(org.url)
    var orgData = data[orgsKey][orgIndex]

    orgData.username = username

    getOrgRepos(username, function (err, repos) {
        // avoid a if stmt below to protect repos.forEach against repos being undefined
        repos = repos || []
        orgData.repos = Array(repos.length)
        // we got more repos to look up
        count += repos.length

        console.error('Found %s repos for org %s, getting language info…', repos.length, username)
        repos.forEach(function(repo, repoIndex) {
            var repoData = {
                name: repo.name,
                url: repo.html_url,
                primary_language: repo.language
            }

            // note: needs to be full_name which is like owner/repo
            // just name wouldn't include the owner
            getRepoLanguages(repo.full_name, function(err, languages) {
                repoData.languages = languages
                orgData.repos[repoIndex] = repoData
                // we looked up a repo
                count -= 1

                // no more repos left? output results
                // @todo gotta be a better way, e.g. with async, to manage this
                if (count === 0) {
                    process.stdout.write(JSON.stringify(data, null, 4))
                }
            })
        })
    })
})

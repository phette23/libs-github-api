var request = require('request')
var fs = require('fs')
var stem = 'https://api.github.com/'
var app = JSON.parse(fs.readFileSync('package.json'))
var token = process.env.GH_TOKEN || null

// @param repo string - full name like owner/repo name, e.g. 'phette23/libs-github-api'
// @param cb function
var getRepoLanguages = function (repo, cb) {
    var opts = {
        headers: {
            "User-Agent": app.name
        }
    }

    // do we have a GitHub auth token? add it if so
    if (token) opts.auth =  { bearer : token }

    request(stem + 'repos/' + repo + '/languages', opts, function (err, resp, body) {
        var ratelimitError = resp.headers['x-ratelimit-remaining'] === '0' ? new Error("Hit the GitHub API's rate limit") : null;
        var data = JSON.parse(body)

        cb(err || ratelimitError, data)
    })
}

module.exports = getRepoLanguages

if (require.main === module) {
    getRepoLanguages(process.argv[2], function(err, langs) {
        process.stdout.write(JSON.stringify(langs, null, 4));
    })
}

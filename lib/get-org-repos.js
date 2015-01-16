var request = require('request')
var fs = require('fs')
var stem = 'https://api.github.com/'
var app = JSON.parse(fs.readFileSync('package.json'))
var token = process.env.GH_TOKEN || null

// @param org string
// @param cb function
var getOrgRepos = function (org, cb) {
    var opts = {
        headers: {
            "User-Agent": app.name
        }
    }

    // do we have a GitHub auth token? add it if so
    if (token) opts.auth =  { bearer : token }

    request(stem + 'orgs/' + org + '/repos', opts, function (err, resp, body) {
        var ratelimitError = resp.headers['x-ratelimit-remaining'] === '0' ? new Error("Hit the GitHub API's rate limit") : null;
        var data = JSON.parse(body)

        // _always_ return an array
        // if org has no repos you get a useless object instead, this papers over that
        if (data.message === 'Not Found') {
            data = [];
        }

        cb(err || ratelimitError, data)
    })
}

module.exports = getOrgRepos

if (require.main === module) {
    getOrgRepos(process.argv[2], function(err, repos) {
        process.stdout.write(JSON.stringify(repos, null, 4));
    })
}

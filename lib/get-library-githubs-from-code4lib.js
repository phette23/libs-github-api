var request = require('request')
var cheerio = require('cheerio')
var url = 'http://wiki.code4lib.org/List_of_Library_Github_Accounts'
var data = { 'Timestamp': new Date() }

request.get(url, function (err, resp, body) {
    if (err) throw err;

    var $ = cheerio.load(body)
    var sections = $('h2 span.mw-headline')

    sections.each(function (ind, el) {
        data[$(el).text()] = []
    })

    // this scraping depends upon a flat document like:
    // <h2>
    // <ul>
    //  <li><a>blah
    //  …
    // <h2>
    // <ul>
    // <ul>
    // <h2>
    // …
    // can handle multiple <ul>s under one section <h2>
    // but if <ul> & <h2> aren't siblings it breaks
    var lists = $('ul')

    lists.each(function(ind, el) {
        // other way: .prevAll().filter('h2').last().text()
        var section = $(el).prev('h2').text()

        if (data[section] !== undefined) {
            $(el).find('li a').each(function(ind, el) {
                data[section].push({
                    "name": $(el).text(),
                    "url": $(el).attr('href')
                })
            })
        }
    })

    process.stdout.write(JSON.stringify(data, null, 4))
})

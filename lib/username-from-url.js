// @param url string
module.exports = function (url) {
    var pieces = url.split('/')
    var len = pieces.length

    // return last piece
    return pieces[len - 1]
}

if (require.main === module) {
    process.stdout.write(module.exports(process.argv[2]) + '\n')
}

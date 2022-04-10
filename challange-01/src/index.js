const https = require('https')
const { writeFile } = require('fs/promises')
const { join } = require('path')
const pathToSaveFile = join(__dirname, '../', 'database')

class Service {
    async readService(url) {
        return new Promise((resolve, reject) => {
            https.get(url, response => {
                response.on("data", data => resolve(JSON.parse(data)))
                response.on('error', reject)
            })
        })
    }
}

const write = (filename, data) => writeFile(join(pathToSaveFile, filename), JSON.stringify(data));

module.exports = { Service, write }
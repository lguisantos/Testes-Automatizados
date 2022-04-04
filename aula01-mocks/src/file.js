const { readFile } = require('fs/promises')
const User = require('./user')
const { error } = require('./constants')
const DEFAULT_OPTIONS = {
    maxLines: 3,
    fields: ["id", "name", "profession", "age"]
}

class File {
    static async csvToJson(filepath) {
        const content = await File.getFileContent(filepath)
        const validation = File.isValid(content)
        if (!validation.valid) throw new Error(validation.error)

        const user = File.parseCSVToJSON(content)
        return user
    }

    static async getFileContent(filePath) {
        return (await readFile(filePath)).toString('utf8')
    }

    static isValid(csvString, options = DEFAULT_OPTIONS) {
        const [header, ...fileWithoutHeader] = csvString.split('\r\n')
        const isHeaderValid = header === options.fields.join(',')
        const isContentLengthAccepted = fileWithoutHeader.length > 0 && fileWithoutHeader.length <= options.maxLines

        if (!isHeaderValid) {
            return {
                error: error.FILE_FIELDS_ERROR_MESSAGE,
                valid: false
            }
        }

        if (!isContentLengthAccepted) {
            return {
                error: error.FILE_LENGTH_ERROR_MESSAGE,
                valid: false
            }
        }

        return { valid: true }
    }

    static parseCSVToJSON(csvString) {
        const lines = csvString.split('\r\n')

        const firstLine = lines.shift()
        const header = firstLine.split(',')
        const users = lines.map(line => {
            const columns = line.split(',')
            let user = {}
            for (const index in columns) {
                user[header[index]] = columns[index]
            }
            return new User(user)
        })
        console.log('Usuario: ', users)
        return users
    }
}

// (async () => {
//     // const result = await File.csvToJson('./../mock/threeItems-valid.csv')
//     // const result = await File.csvToJson('./../mock/fourItems-invalid.csv')
//     const result = await File.csvToJson('./../mock/invalid-header.csv')
//     console.log(result)
// })()

module.exports = File
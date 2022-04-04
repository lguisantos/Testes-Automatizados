const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert');

(async () => {
    // /**
    //  * @description
    //  */
    // {
    //     const filepath = './mock/emptyFile-invalid.csv'
    //     const rejection = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
    //     const result = File.csvToJson(filepath)
    //     rejects(result, rejection)
    // }

    // /**
    //  * @description
    //  */
    // {
    //     const filepath = './mock/fourItems-invalid.csv'
    //     const rejectionExpected = new Error(error.FILE_FIELDS_ERROR_MESSAGE)
    //     const result = File.csvToJson(filepath)
    //     rejects(result, rejectionExpected)
    // }

    /**
     * @description
     */
    {
        const filepath = './mock/threeItems-valid.csv'
        const result = await File.csvToJson(filepath)
        const expected = [
            {
                "id": 123,
                "name": "Lucas Guimaraes",
                "profession": "Javascript Developer",
                "birthDay": 1998
            },
            {
                "id": 321,
                "name": "Erick Wendel",
                "profession": "Javascript Instructor",
                "birthDay": 1997
            },
            {
                "id": 222,
                "name": "Paulo Camargo",
                "profession": "Fiori Developer",
                "birthDay": 1972
            }
        ]

        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
    }
})()
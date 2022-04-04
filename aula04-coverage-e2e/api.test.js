/**
 * @description O objetivo deste teste é simular as ações do usuário para garantir que a aplicação esta funcionando corretamente
 */
const { describe, it } = require('mocha')
const app = require('./api')
const request = require('supertest')
const assert = require('assert')

describe('API Suite test', () => {
    describe('/contact', () => {
        it('should request the contact page and return HTTP Status 200', async () => {

            /**
             * @description Testa a chamada da nossa API
             * @param get Bate na rota que estamos querendo testar
             * @param expect Deixa explicito o resultado esperado
             */
            const response = await request(app)
                .get('/contact')
                .expect(200)

            assert.deepStrictEqual(response.text, 'contact us page')
        })
    })

    describe('/hello', () => {
        it('Should request an inexistent route /hi and redirect to /hello', async () => {
            const response = await request(app)
                .get('/hello')
                .expect(200)

            assert.deepStrictEqual(response.text, 'Hello World!')
        })
    })

    describe('/login', () => {
        it('Should login successfuly on the login route and return HTTP Status 200', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'LucasGuimaraes', password: '123' })
                .expect(200)

            assert.deepStrictEqual(response.text, 'Logging has succeeded!')
        })

        it('Should unauthorized a request when requesting it usinf wrong credentials and return HTTP Status 401', async () => {
            const response = await request(app)
                .post('/login')
                .send({ username: 'LucasGuimaraes', password: 'wrong password' })
                .expect(401)

            assert.ok(response.unauthorized)
            assert.deepStrictEqual(response.text, 'Logging failed!')
        })
    })
})
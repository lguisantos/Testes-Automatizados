/**
 * @description Nos testes a seguir utilizaremos os Stubs.
 *              Os Stubs ajudam nos testes para que possamos mudar o comportamento padrão de uma chamada.
 *              Desta forma, conseguimos controlar o resultado para que possa ser testado
 */

const { describe, it, before, beforeEach, afterEach } = require('mocha')
const CarService = require('../../src/service/carService')
const { expect } = require('chai')
const Transaction = require('../../src/entities/transaction')
const { join } = require('path')
const sinon = require('sinon')
const carsDatabase = join(__dirname, './../../database', 'cars.json')
const mocks = {
    validCarCategory: require('../mocks/valid-carCategory.json'),
    validCar: require('../mocks/valid-car.json'),
    validCustomer: require('../mocks/valid-customer.json')
}

describe('CarService Suite Tests', () => {
    let carService = {}
    let sandbox = {}
    /**
     * @description Instancia nossa classe assim que os testes são iniciados
     *              Evitando sujeita de teses passados
     */
    before(() => {
        carService = new CarService({
            cars: carsDatabase
        })
    })

    /**
     * @description A cada teste que rodar, o sinon será limpo e instanciado novamente
     *              Isso garante que não tenhamos nenhuma instancia corrompida no meio dos testes
     */
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })
    /**
     * @description Reseta o stub depois de cada it que rodar
     */
    afterEach(() => {
        sandbox.restore()
    })

    it('should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]
        const result = carService.getRandomPositionFromArray(data)

        expect(result).to.be.lte(data.length).and.be.gte(0)
    })
    it('Should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory
        const carIdIndex = 0

        /**
         * @description Controlando o retorno para que retorne sempre o Index 0
         *              Assim podemos testar o resultado da funcão
         */
        sandbox.stub(
            carService,
            carService.getRandomPositionFromArray.name
        ).returns(carIdIndex)

        const result = carService.chooseRandomCar(carCategory)
        const expected = carCategory.carIds[carIdIndex]

        expect(result).to.be.equal(expected)
        /**
         * @description Testando a quantidade de vezes que nossa classe é chamada 
         */
        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
    })
    it('given a carCategory it should be available', async () => {
        const car = mocks.validCar
        const carCategory = Object.create(mocks.validCarCategory) // Cria uma instancia local do objeto
        carCategory.carIds = [car.id]

        /**
         * @description Controlando o retorno para que retorne sempre o Index 0
         *              Assim podemos testar o resultado da funcão
         */
        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car)

        /**
         * @description Controlando o retorno para que retorne sempre o Index 0
         *              Assim podemos testar o resultado da funcão
         */
        sandbox.spy(
            carService,
            carService.chooseRandomCar.name
        )

        const result = await carService.getAvailableCar(carCategory)
        const expected = car

        /**
         * @description Testando a quantidade de vezes que nossa classe é chamada 
         */
        expect(result).to.be.deep.equal(expected)
        expect(carService.chooseRandomCar.calledOnce).to.be.ok

        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
    })
    it('given a carCategory, customer and numberOfDays it should calculate final amount in real', async () => {
        const customer = Object.create(mocks.validCustomer)
        customer.age = 50

        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.price = 37.6

        const numberOfDays = 5

        const expected = carService.currencyFormat.format(244.40)
        const result = carService.calculateFinalPrice(customer, carCategory, numberOfDays)

        expect(result).to.be.deep.equal(expected)
    })
    it('given a customer and car category it should return a transaction receipt', async () => {
        const car = mocks.validCar
        /**
         * @description Criando uma cópia do objeto, mas modificando o valor de algumas propriedades
         */
        const carCategory = {
            ...mocks.validCarCategory,
            price: 37.6,
            carIds: [car.id]
        }

        const customer = Object.create(mocks.validCustomer)
        customer.age = 20

        const numberOfDays = 5
        const dueDate = '10 de novembro de 2020'

        /**
         * @description Fixando uma data para que ela náo mudo no new Date()
         *              Desta forma podemos testar as datas evitando que nossos testes quebrem com o passar do tempo
         */
        const now = new Date(2020, 10, 5)
        sandbox.useFakeTimers(now.getTime())

        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name
        ).resolves(car)

        const expectedAmount = carService.currencyFormat.format(206.8)
        const result = await carService.rent(
            customer, carCategory, numberOfDays
        )
        const expected = new Transaction({
            customer,
            car,
            dueDate,
            amount: expectedAmount
        })

        expect(result).to.be.deep.equal(expected)
    })
})
/**
 * @description Nos testes a seguir utilizaremos os Stubs.
 *              Os Stubs ajudam nos testes para que possamos mudar o comportamento padrão de uma chamada.
 *              Desta forma, conseguimos controlar o resultado para que possa ser testado
 */

const { describe, it, before, beforeEach, afterEach } = require('mocha')
const CarService = require('./../../src/service/carService')
const { expect } = require('chai')

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
        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)
    })
})
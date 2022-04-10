const BaseRepository = require('../../repository/base/baseRepository')

class CarService {
    constructor({ cars }) {
        this.carRepository = new BaseRepository({ file: cars })
    }

    async getAvailableCar(id) {
        return this.carRepository.find(id)
    }

    chooseRandomCar(carCategory){
        const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds) 
        const carId = carCategory.carIds[randomCarIndex]
        
        return carId
    }

    getRandomPositionFromArray(list) {
        const listLength = list.length
        return Math.floor(
            Math.random() * (listLength)
        )
    }

    async getAvailableCar(carCategory){
        const carId = this.chooseRandomCar(carCategory)
        const car = await this.carRepository.find(carId)

        return car
    }
}

module.exports = CarService
import Car from '../models/car.js'

// Get all cars
export const getAllCars = () => {
	return Car.findAll()
}

// Get car by ID
export const getCarById = (id) => {
	return Car.findById(id)
}

// Create new car
export const createCar = (carData) => {
	const { make, model } = carData
	
	// Simple validation
	if (!make || !model) {
		throw new Error('Make and model are required')
	}
	
	return Car.create(carData)
}

// Update car
export const updateCar = (id, carData) => {
	const existingCar = Car.findById(id)
	if (!existingCar) {
		return null
	}
	
	return Car.update(id, carData)
}

// Delete car
export const deleteCar = (id) => {
	return Car.delete(id)
}

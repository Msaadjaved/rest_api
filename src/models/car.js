import db from '../config/database.js'

// Define the Car model
class Car {
	// Table name
	static tableName = 'cars'
	
	// Create the cars table
	static createTable() {
		const sql = `
			CREATE TABLE IF NOT EXISTS ${this.tableName} (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				make TEXT NOT NULL,
				model TEXT NOT NULL,
				year INTEGER,
				color TEXT,
				price REAL,
				mileage INTEGER,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`
		db.exec(sql)
		console.log(`✅ Table '${this.tableName}' created/verified`)
	}
	
	// Get all cars
	static findAll() {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id`)
		return stmt.all()
	}
	
	// Find car by ID
	static findById(id) {
		const stmt = db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
		return stmt.get(id)
	}
	
	// Create new car
	static create(carData) {
		const { make, model, year, color, price, mileage } = carData
		const stmt = db.prepare(`
			INSERT INTO ${this.tableName} (make, model, year, color, price, mileage) 
			VALUES (?, ?, ?, ?, ?, ?)
		`)
		const result = stmt.run(
			make,
			model,
			year ?? null,
			color ?? null,
			price ?? null,
			mileage ?? null
		)
		return this.findById(result.lastInsertRowid)
	}
	
	// Update car
	static update(id, carData) {
		const { make, model, year, color, price, mileage } = carData
		
		const updates = []
		const values = []
		
		if (make !== undefined) {
			updates.push('make = ?')
			values.push(make)
		}
		if (model !== undefined) {
			updates.push('model = ?')
			values.push(model)
		}
		if (year !== undefined) {
			updates.push('year = ?')
			values.push(year)
		}
		if (color !== undefined) {
			updates.push('color = ?')
			values.push(color)
		}
		if (price !== undefined) {
			updates.push('price = ?')
			values.push(price)
		}
		if (mileage !== undefined) {
			updates.push('mileage = ?')
			values.push(mileage)
		}
		
		// Always update timestamp
		updates.push('updated_at = CURRENT_TIMESTAMP')
		
		if (updates.length === 1) {
			// Only timestamp → nothing actually changed
			return this.findById(id)
		}
		
		values.push(id)
		
		const stmt = db.prepare(`
			UPDATE ${this.tableName}
			SET ${updates.join(', ')}
			WHERE id = ?
		`)
		
		stmt.run(...values)
		return this.findById(id)
	}
	
	// Delete car
	static delete(id) {
		const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
		const result = stmt.run(id)
		return result.changes > 0
	}
	
	// Count cars
	static count() {
		const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`)
		return stmt.get().count
	}
	
	// Seed sample data
	static seed() {
		const count = this.count()
		
		if (count === 0) {
			console.log('📝 Seeding cars table...')
			
			const sampleCars = [
				{ make: 'Toyota', model: 'Corolla', year: 2018, color: 'White', price: 12000, mileage: 65000 },
				{ make: 'Honda', model: 'Civic', year: 2020, color: 'Black', price: 18000, mileage: 30000 },
				{ make: 'Ford', model: 'Focus', year: 2017, color: 'Blue', price: 10000, mileage: 80000 },
				{ make: 'Tesla', model: 'Model 3', year: 2022, color: 'Red', price: 35000, mileage: 15000 }
			]
			
			sampleCars.forEach(car => this.create(car))
			console.log(`✅ Seeded ${sampleCars.length} cars`)
		}
	}
}

export default Car

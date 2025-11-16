// Car Management Functions
let currentEditId = null;

// Load all cars and display them
async function loadCars() {
    try {
        const cars = await API.get('/cars');
        displayCars(cars);
    } catch (error) {
        showError('Failed to load cars: ' + error.message);
    }
}

// Display cars in table
function displayCars(cars) {
    const tbody = document.getElementById('carsTableBody');
    
    if (!cars || cars.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No cars found</td></tr>';
        return;
    }

    tbody.innerHTML = cars.map(car => `
        <tr>
            <td>${car.id}</td>
            <td>${car.make}</td>
            <td>${car.model}</td>
            <td>${car.year || '-'}</td>
            <td>${car.color || '-'}</td>
            <td>${car.price ? '$' + car.price.toLocaleString() : '-'}</td>
            <td>${car.mileage ? car.mileage.toLocaleString() + ' mi' : '-'}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editCar(${car.id})">Edit</button>
                <button class="btn btn-sm btn-delete" onclick="deleteCar(${car.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle form submission (Create or Update)
async function handleCarSubmit(event) {
    event.preventDefault();
    
    const make = document.getElementById('carMake').value.trim();
    const model = document.getElementById('carModel').value.trim();
    const year = document.getElementById('carYear').value;
    const color = document.getElementById('carColor').value.trim();
    const price = document.getElementById('carPrice').value;
    const mileage = document.getElementById('carMileage').value;

    if (!make || !model) {
        showError('Make and Model are required');
        return;
    }

    const carData = {
        make,
        model,
        year: year ? parseInt(year) : null,
        color: color || null,
        price: price ? parseFloat(price) : null,
        mileage: mileage ? parseInt(mileage) : null
    };

    try {
        if (currentEditId) {
            // Update existing car
            await API.put(`/cars/${currentEditId}`, carData);
            showSuccess('Car updated successfully!');
            cancelEdit();
        } else {
            // Create new car
            await API.post('/cars', carData);
            showSuccess('Car created successfully!');
            document.getElementById('carForm').reset();
        }
        
        loadCars();
    } catch (error) {
        showError('Failed to save car: ' + error.message);
    }
}

// Edit car
async function editCar(id) {
    try {
        const car = await API.get(`/cars/${id}`);
        
        document.getElementById('carMake').value = car.make;
        document.getElementById('carModel').value = car.model;
        document.getElementById('carYear').value = car.year || '';
        document.getElementById('carColor').value = car.color || '';
        document.getElementById('carPrice').value = car.price || '';
        document.getElementById('carMileage').value = car.mileage || '';
        
        currentEditId = id;
        document.getElementById('formTitle').textContent = 'Edit Car';
        document.getElementById('submitBtn').textContent = 'Update Car';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('carForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showError('Failed to load car: ' + error.message);
    }
}

// Cancel edit
function cancelEdit() {
    currentEditId = null;
    document.getElementById('carForm').reset();
    document.getElementById('formTitle').textContent = 'Add New Car';
    document.getElementById('submitBtn').textContent = 'Add Car';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Delete car
async function deleteCar(id) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }

    try {
        await API.delete(`/cars/${id}`);
        showSuccess('Car deleted successfully!');
        loadCars();
    } catch (error) {
        showError('Failed to delete car: ' + error.message);
    }
}

// Show success message
function showSuccess(message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = 'alert alert-success';
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 3000);
}

// Show error message
function showError(message) {
    const alertDiv = document.getElementById('alert');
    alertDiv.className = 'alert alert-error';
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCars();
    document.getElementById('carForm').addEventListener('submit', handleCarSubmit);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});
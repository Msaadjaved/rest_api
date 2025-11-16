// User Management Functions
let currentEditId = null;

// Load all users and display them
async function loadUsers() {
    try {
        const users = await API.get('/users');
        displayUsers(users);
    } catch (error) {
        showError('Failed to load users: ' + error.message);
    }
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email || '-'}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-sm btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Handle form submission (Create or Update)
async function handleUserSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();

    if (!name) {
        showError('Name is required');
        return;
    }

    const userData = {
        name,
        email: email || null
    };

    try {
        if (currentEditId) {
            // Update existing user
            await API.put(`/users/${currentEditId}`, userData);
            showSuccess('User updated successfully!');
            cancelEdit();
        } else {
            // Create new user
            await API.post('/users', userData);
            showSuccess('User created successfully!');
            document.getElementById('userForm').reset();
        }
        
        loadUsers();
    } catch (error) {
        showError('Failed to save user: ' + error.message);
    }
}

// Edit user
async function editUser(id) {
    try {
        const user = await API.get(`/users/${id}`);
        
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email || '';
        
        currentEditId = id;
        document.getElementById('formTitle').textContent = 'Edit User';
        document.getElementById('submitBtn').textContent = 'Update User';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        // Scroll to form
        document.getElementById('userForm').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showError('Failed to load user: ' + error.message);
    }
}

// Cancel edit
function cancelEdit() {
    currentEditId = null;
    document.getElementById('userForm').reset();
    document.getElementById('formTitle').textContent = 'Add New User';
    document.getElementById('submitBtn').textContent = 'Add User';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Delete user
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        await API.delete(`/users/${id}`);
        showSuccess('User deleted successfully!');
        loadUsers();
    } catch (error) {
        showError('Failed to delete user: ' + error.message);
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
    loadUsers();
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
});
let importedUsers = window.users;
console.log(importedUsers);


// Function to register a new user
function registerUser(firstName, lastName, email, password) {
    // Create a new user object
    const newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        loggedIn: false // Initially set to false
    };
    
    // Add the new user to the users array
    users.push(newUser);
}

// Function to login a user
function loginUser(email, password) {
    // Find the user with the given email and password
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        // Mark the user as logged in
        user.loggedIn = true;
        return true; // Login successful
    } else {
        return false; // Login failed
    }
}

// Function to delete a user
function deleteUser(email) {
    // Find the index of the user with the given email
    const index = users.findIndex(user => user.email === email);
    
    if (index !== -1) {
        // Remove the user from the users array
        users.splice(index, 1);
        return true; // Deletion successful
    } else {
        return false; // User not found
    }
}

// Function to handle edit user
function editUser(email) {
    // Find the user with the given email
    const user = users.find(user => user.email === email);
    
    if (user) {
        // Open a new window for editing the user
        const editWindow = window.open('', 'Edit User', 'width=400,height=300');
        
        // Build the edit form
        const formHTML = `
            <h2>Edit User</h2>
            <form id="editForm">
                <label for="editFirstName">First Name:</label>
                <input type="text" id="editFirstName" value="${user.firstName}"><br><br>
                <label for="editLastName">Last Name:</label>
                <input type="text" id="editLastName" value="${user.lastName}"><br><br>
                <label for="editPassword">Password:</label>
                <input type="password" id="editPassword" value="${user.password}"><br><br>
                <button type="submit">Save</button>
            </form>
        `;
        
        // Set the content of the new window to the edit form
        editWindow.document.body.innerHTML = formHTML;
        
        // Event listener for form submission
        editWindow.document.getElementById('editForm').addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission
            
            // Get updated values from the form
            const newFirstName = editWindow.document.getElementById('editFirstName').value;
            const newLastName = editWindow.document.getElementById('editLastName').value;
            const newPassword = editWindow.document.getElementById('editPassword').value;
            
            // Update the user object with the new values
            user.firstName = newFirstName;
            user.lastName = newLastName;
            user.password = newPassword;
            
            // Close the edit window
            editWindow.close();
            
            // Update the users list display
            updateUsersList();
        });
    } else {
        alert('User not found!');
    }
}

// Function to update the users list display
function updateUsersList() {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = ''; // Clear the table body
    
    // Loop through each user and create a table row for them
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>${user.loggedIn ? 'Logged In' : 'Logged Out'}</td>
            <td>
                <button class="btn ${user.loggedIn ? 'btn-primary' : 'btn-warning'} edit-btn" data-email="${user.email}">Edit</button>
                <button class="btn btn-danger delete-btn" data-email="${user.email}">Delete</button>
                <button class="btn btn-secondary logout-btn" data-email="${user.email}">Logout</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners for edit, delete, and logout buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            editUser(email);
        });
    });
    
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const deleted = deleteUser(email);
            if (deleted) {
                updateUsersList(); // Update the users list display
            } else {
                alert('User not found!');
            }
        });
    });

    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.getAttribute('data-email');
            const user = users.find(user => user.email === email);
            if (user) {
                user.loggedIn = false; // Set the user's login status to false (logged out)
                updateUsersList(); // Update the users list display
            }
        });
    });
}

// Event listener for registration form submission
document.getElementById('regForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form values
    const firstName = document.getElementById('fname').value;
    const lastName = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Register the new user
    registerUser(firstName, lastName, email, password);
    
    // Update the users list display
    updateUsersList();
    
    // Reset the form
    this.reset();
});

// Event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form values
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Login the user
    const loggedIn = loginUser(email, password);
    
    if (loggedIn) {
        alert('Login successful!');
    } else {
        alert('Login failed. Please check your email and password.');
    }
    
    // Update the users list display
    updateUsersList();
    
    // Reset the form
    this.reset();
});

// Initialize the users list display
updateUsersList();
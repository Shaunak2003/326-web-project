// Initialize PouchDB
var db = new PouchDB('accounts');

// Function to validate email format
function validateEmail(email) {
    // Regular expression for validating email format
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Function to handle sign up
function signUp(email, password) {
    // Check if email is valid
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Check if email already exists
    db.get(email).then(function(doc) {
        // Email already exists, redirect to login.html
        alert('Email already exists, please login');
        window.location.href = 'login.html';
    }).catch(function(err) {
        if (err.status === 404) {
            // Email doesn't exist, create account
            db.put({
                _id: email,
                password: password
            }).then(function(response) {
                // Account created successfully, redirect to login.html
                alert('Account created successfully');
                window.location.href = 'login.html';
            }).catch(function(err) {
                console.log(err);
            });
        } else {
            console.log(err);
        }
    });
}

// Event listener for create account button
document.querySelector('.create-account-button').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    signUp(email, password);
});

// Function to handle login
function login(email, password) {
    // Fetch the document from the database based on the email
    db.get(email).then(function(doc) {
        // Check if the password matches
        if (doc.password === password) {
            // Password matches, redirect to home page or wherever you want
            alert('Login successful');
            window.location.href = 'index.html'; // Change to the desired destination
        } else {
            // Password doesn't match, show error message
            alert('Incorrect password');
        }
    }).catch(function(err) {
        // Email not found in the database
        alert('Email not found, please sign up');
    });
}

// Event listener for login form submission
document.querySelector('.login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    login(email, password);
});

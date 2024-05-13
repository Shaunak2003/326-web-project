/* const loginButton = document.getElementById('login')
const signUpButton = document.getElementById('createAccount') */
//var db = new PouchDB('accounts')
const URL = "http://localhost:3000"

function validateEmail(email) {
    // Regular expression for validating email format
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Function to handle sign up
/* function signUp(email, password) {
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
} */



async function signUp(email, password){
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    const data = {email: email, password: password}
    console.log(data)
    const response = await fetch(`${URL}/signup`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.status === 409){
        console.log("Account already exists, please sign in")
        alert("Account already exists, please sign in")
        window.location.href = 'login.html'
    }
    else if (response.status === 200){
        console.log("Account created successfully!")
        alert("Account created successfully")
        window.location.href = 'login.html'
    }
    else{
        throw new Error('Failed to save item');
    }
}

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
document.querySelector('.create-account-button').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    signUp(email, password);
});

document.querySelector('.login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    login(email, password);
});

/* loginButton.addEventListener('click', (event) => {
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    login(email, password)
})

signUpButton.addEventListener('click', (event) => {
    event.preventDefault()
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    signUp(email, password)
}) */
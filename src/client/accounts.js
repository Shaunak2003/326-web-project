// Define the base URL for API requests
const URL = "http://localhost:3000";

// Function to validate the format of an email address using regular expression
function validateEmail(email) {
    // Regular expression for validating email format
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Function to sign up a new user
async function signUp(email, password){
    // Validate email format
    if (!validateEmail(email)) {
        // If email is not valid, display an alert message
        alert('Please enter a valid email address');
        return;
    }
    // Prepare data for POST request
    const data = {email: email, password: password};
    console.log(data);
    // Send POST request to create a new account
    const response = await fetch(`${URL}/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    // Handle response based on status code
    if (response.status === 409){
        // If account already exists, display an alert and redirect to login page
        console.log("Account already exists, please sign in");
        alert("Account already exists, please sign in");
        window.location.href = 'login.html';
    }
    else if (response.status === 200){
        // If account created successfully, display a success message and redirect to login page
        console.log("Account created successfully!");
        alert("Account created successfully");
        window.location.href = 'login.html';
    }
    else{
        // If any other status code is received, throw an error
        throw new Error('Failed to save item');
    }
}

// Function to log in an existing user
async function login(email, password){
    // Validate email format
    if (!validateEmail(email)) {
        // If email is not valid, display an alert message
        alert('Please enter a valid email address');
        return;
    }
    // Prepare data for GET request
    const data = {email: email, password: password};
    console.log(data);
    // Send GET request to check login credentials
    const response = await fetch(`${URL}/read?email=${email}&password=${password}`, { method: "GET" });
    // Handle response based on status code
    if (response.status === 400){
        // If password is incorrect, display an alert message and redirect to login page
        console.log("Incorrect password, retry login");
        alert("Incorrect password, retry login");
        window.location.href = 'login.html';
    }
    else if (response.status === 200){
        // If login successful, display a success message and redirect to index page
        console.log("Logged in successfully!");
        alert("Logged in successfully!");
        window.location.href = 'index.html';
    }
    else{
        // If no account found, display an alert message and redirect to signup page
        alert("No account found, please sign up");
        window.location.href = 'signup.html';
    }
}

// Event listener for sign-up form submission
document.querySelector('.create-account-button').addEventListener('click', function(event) {
    // Retrieve email and password from input fields
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    // Call sign-up function with retrieved data
    signUp(email, password);
});

// Event listener for login form submission
document.querySelector('.login-button').addEventListener('click', function(event) {
    // Prevent default form submission behavior
    event.preventDefault();
    // Retrieve email and password from input fields
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    // Call login function with retrieved data
    login(email, password);
});

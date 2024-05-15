// Import required modules
import express, { response } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import * as db from "./db.js";

// Define common header fields
const headerFields = { "Content-Type": "text/html" };

// Function to save an item to the database
async function saveItem(response, item){
    // Check if the item is undefined
    if (item === undefined){
        response.writeHead(400, headerFields); // Return item not saved error with 400 status client error
        response.write("Item not saved");
        response.end();
    }
    try{
        await db.createItem(item); // Call function to create item
        response.writeHead(200, headerFields); // Return success status 200
        response.end();
    }
    catch (err){
        console.log(err); // Print error statement
        response.writeHead(500, headerFields); // Return failure status 500 server error
        response.end();
    }
}

// Function to display all items from the database
async function displayAllItems(response){
    try{
        const results = await db.loadAllItems(); // Get all items from function call
        response.setHeader("Content-Type", "application/json"); // Send JSON object of items
        response.status(200).send(JSON.stringify(results)); // Return success status 200
    }
    catch (err){
        console.error(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 500 server error
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    } 
}

// Function to remove an item from the database
async function buyProduct(response, productID, productRev){
    try{
        await db.removeItem(productID, productRev); // Remove item from function call
        response.writeHead(200, headerFields); // Return success status 200
        response.end();
    }
    catch (err){
        console.log(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 500 server error
        response.end();
    }
}

// Function to display items of a specific category from the database
async function displayItems(response, category){
    try{
        const results = await db.loadItems(category); // Get required items from function call
        response.setHeader("Content-Type", "application/json"); // Send JSON object of items
        response.status(200).send(JSON.stringify(results)); // Return success status 200
    }
    catch (err){
        console.error(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 500 server error
        response.end(JSON.stringify({ error: "Internal Server Error" })); 
    }
}

// Function to search for items by name in the database
async function searchItems(response, searchParams){
    try{
        const results = await db.searchByName(searchParams); // Get required items from function call
        response.setHeader("Content-Type", "application/json"); // Send JSON object of items
        response.status(200).send(JSON.stringify(results)); // Return success status 200
    }
    catch{
        console.error(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 500 server error
        response.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

// Function to handle user sign up
async function signUp(response, email, password){
    try{
        const result = await db.createAccount(email, password); // Get account creation from function call
        if (result.success){
            response.writeHead(200, headerFields); // Return success status 200
            response.end();
        }
        else{
            response.writeHead(409, headerFields); // Return failure status 409
            response.end();
        }
    }
    catch (err){
        response.writeHead(503, headerFields); // Return failure status 503
        response.end();
    }
}

// Function to update product information in the database
async function updateProductInfo(response, id, rev, category, newValue){
    try{
        await db.updateProduct(id, rev, category, newValue); // Update item from function call
        response.writeHead(200, headerFields); // Return success status 200
        response.end();
    }
    catch (err){
        console.log(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 409
        response.end();
    }
}

// Function to handle user login
async function login(response, email, password){
    try{
        const result = await db.getAccount(email, password); // Get account validation from function call
        if (result.success){
            response.writeHead(200, headerFields); // Return success status 200
            response.end();
        }
        else{
            response.writeHead(400, headerFields); // Return failure status 400
            response.end();
        }
    }
    catch (err){
        console.log(err); // Print error
        response.writeHead(500, headerFields); // Return failure status 500
        response.end();
    }
}

// Initialize express app
const app = express();
const port = 3000;

// Middleware setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/client")); // Serve static files from client directory

// Handler for disallowed methods
const MethodNotAllowedHandler = async (request, response) => {
    response.status(405).type('text/plain').send('Method Not Allowed');
};

// Define routes
app.route('/create').post(async (req, res) => { // Create route
    const item = req.body;
    if (item.email !== undefined){
        const {email, password} = item; // Get params from req
        signUp(res, email, password); // Call function with params 
    }
    else saveItem(res, item);
}).all(MethodNotAllowedHandler);

app.route('/all').get(async (req, res) => { // All route
    displayAllItems(res); // Call function with params
}).all(MethodNotAllowedHandler);

app.route('/delete').delete(async (req, res) => { // Delete route
    const options = req.query; // Get params from req
    buyProduct(res, options.productID, options.productRev); // Call function with params
}).all(MethodNotAllowedHandler);

app.route('/read').get(async (req, res) => { // Read route
    const options = req.query;
    if (options.email !== undefined) login(res, options.email, options.password); // Check if login is requested
    else if (options.category !== undefined) displayItems(res, options.category.toLowerCase()); // Call function to display items by category
    else searchItems(res, options.searchParams.toLowerCase()); // Call function to search items by name
}).all(MethodNotAllowedHandler);

app.route('/update').put(async (req, res) => { // Update route
    const options = req.body;
    const {id, rev, field, newValue} = options;
    updateProductInfo(res, id, rev, field, newValue); // Call function to update product information
}).all(MethodNotAllowedHandler);

app.route("*").all(async (request, response) => { // Catch-all route
    response.status(404).send(`Not found: ${request.path}`); // Return 404 error for undefined routes
});



// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});



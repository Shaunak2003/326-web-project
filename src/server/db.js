// Import PouchDB and necessary plugins
import PouchDB from 'pouchdb';
import findPlugin from 'pouchdb-find';

// Initialize PouchDB databases
var db = new PouchDB('items');
var db2 = new PouchDB('accounts');

// Apply find plugin to enable querying
PouchDB.plugin(findPlugin);

// Create an index on the 'email' field of the 'accounts' database
db2.createIndex({
    index: {fields: ['email']}
});

// Function to add a new item to the 'items' database
export async function createItem(item) {
    await db.put(item); // Add item to the database
}

// Function to load all items from the 'items' database
export async function loadAllItems() {
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map((row) => row.doc); // Return items
}

// Function to remove an item from the 'items' database
export async function removeItem(productID, productRev){
    await db.remove(productID, productRev); // Delete item with given ID and revision
}

// Function to load items of a specific category from the 'items' database
export async function loadItems(category){
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map(row => row.doc).filter(item => item.category === category); // Get items where category matches
}

// Function to search for items by name in the 'items' database
export async function searchByName(searchParams){
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map(row => row.doc).filter(item => item.name.replaceAll(' ', '').toLowerCase().includes(searchParams)); // Get items containing search value
}

// Function to create a new account in the 'accounts' database
export async function createAccount(email, password){
    try {
        const doc = await db2.get(email); // Attempt to get the document with the given email

        // If the document is found, the email already exists
        console.log("Email already exists.");
        return { success: false, message: "Email already exists" };
    } catch (err) {
        if (err.status === 404) {
            // If no document is found, create a new document with the provided email and password
            await db2.put({
                _id: email,
                password: password
            });
            console.log("Account created successfully.");
            return { success: true, message: "Account created successfully" };
        } else {
            // Handle and log any errors
            console.error("Error fetching account:", err);
            return { success: false, message: "Error checking existing account" };
        }
    }
}

// Function to update product information in the 'items' database
export async function updateProduct(id, rev, updateCategory, newValue){
    try {
        const doc = await db.get(`${id}`);

        // Update the specific field dynamically
        doc[updateCategory] = newValue;
        doc._rev = rev;  // Update the revision to the latest known revision

        // Put the updated document back into the database
        const response = await db.put(doc);
        console.log("Update response:", response);
        return response;
    } catch (err) {
        console.error("Error updating document:", err);
        throw err;  // Rethrow the error to handle it further up the call stack if necessary
    }
}

// Function to get an account from the 'accounts' database
export async function getAccount(email, password) {
    try {
        const doc = await db2.get(email); // Fetch the document by email

        // Check if the password matches
        if (doc !== undefined && doc.password === password) {
            return {success: true, message: "Logged in!"};
        } else {
            // Password doesn't match, return error message
            return {success: false, message: "Incorrect password, please try again"};
        }
    } catch (err) {
        // Check if the error is due to the document not being found
        if (err.status === 404) {
            // Document not found
            return {success: false, status: 500, message: "No account found, please sign up"};
        } else {
            // Other errors
            return {success: false, status: err.status || 500, message: "An error occurred accessing the database"};
        }
    }
}

import PouchDB from 'pouchdb'
var db = new PouchDB('items');
var db2 = new PouchDB('accounts')
import findPlugin from 'pouchdb-find';
PouchDB.plugin(findPlugin);

db2.createIndex({
    index: {fields: ['email']}
  });

export async function createItem(item) {
    //console.log("db.js - ", item)
    await db.put(item)
}

export async function loadAllItems() {
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map((row) => row.doc);
}

export async function removeItem(productID, productRev){
    await db.remove(productID, productRev)
}

export async function loadItems(category){
    const result = await db.allDocs({ include_docs: true, attachments: true });
    return result.rows.map(row => row.doc).filter(item => item.category === category)
}

export async function searchByName(searchParams){
    const result = await db.allDocs({ include_docs: true, attachments: true })
    return result.rows.map(row => row.doc).filter(item => item.name.replaceAll(' ', '').toLowerCase().includes(searchParams))
}

export async function createAccount(email, password){
    try {
        // Attempt to get the document with the given email
        const doc = await db2.get(email);
        // If the document is found, the email already exists
        console.log("Email already exists.");
        return { success: false, message: "Email already exists" };
    } catch (err) {
        if (err.status === 404) {
            // If no document is found, this means the email does not exist
            try {
                // Create a new document with _id as email
                await db2.put({
                    _id: email,
                    password: password
                });
                console.log("Account created successfully.");
                return { success: true, message: "Account created successfully" };
            } catch (error) {
                // Handle potential errors during the document creation
                console.error("Error creating account:", error);
                return { success: false, message: "Failed to create account" };
            }
        } else {
            // Log and handle any other errors
            console.error("Error fetching account:", err);
            return { success: false, message: "Error checking existing account" };
        }
    }
}

export async function updateProduct(id, rev, updateCategory, newValue){
    //console.log("db.js - ", {id, rev, updateCategory, newValue})
    try {
        const doc = await db.get(`${id}`);
        
        // Update the specific field dynamically
        doc[updateCategory] = newValue;
        doc._rev = rev;  // Update the revision to the latest known revision

        // Now put the updated document back into the database
        const response = await db.put(doc);
        console.log("Update response:", response);
        return response;
    } catch (err) {
        console.error("Error updating document:", err);
        throw err;  // Rethrow the error to handle it further up the call stack if necessary
    }
}

export async function getAccount(email, password) {
    try {
        const doc = await db2.get(email);  // Try to fetch the document by email

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

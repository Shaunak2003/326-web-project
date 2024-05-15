// Get references to various buttons and the base URL for API requests
const bookButton = document.getElementById('book-button');
const electronicsButton = document.getElementById('electronics-button');
const fashionButton = document.getElementById('fashion-button');
const searchButton = document.getElementById('button-input');
const exploreButton = document.getElementById('explore-products-button');
const updateButton = document.getElementById('update-button');
const URL = "http://localhost:3000";

// Function to handle search parameters in the URL when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Extract search parameter from URL
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('name');
    if (searchParam) {
        // If search parameter exists, perform search
        searchItems(searchParam);
    } else {
        // If no search parameter, display all items
        displayAllItems();
    }
});

// Another event listener to handle category or 'all' parameter in URL when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const allProducts = params.get('all');
    const category = params.get('category');
    if (allProducts) {
        // If 'all' parameter is in URL, display all items
        displayAllItems();
    } else if (category) {
        // If category parameter is in URL, display items for that category
        displayItems(category);
    }
});

// Function to save a new item
async function saveItem(){
    // Generate a random ID for the new item
    var idCount = Math.floor(Math.random() * 10000000000);
    // Retrieve item details from form fields
    var itemName = document.getElementById('itemName').value;
    var itemCategory = document.getElementById('itemCategory').value;
    var itemDescription = document.getElementById('itemDescription').value;
    var itemPrice = parseFloat(document.getElementById('itemPrice').value);
    var itemCondition = document.getElementById('itemCondition').value;
    var itemImage = document.getElementById('itemImage').value;

    // Construct item object
    var item = {
        "_id": `${idCount}`,
        "category": itemCategory,
        "name": itemName,
        "description": itemDescription,
        "price": itemPrice,
        "condition": itemCondition,
        "image": itemImage
    };

    // Send POST request to create a new item
    const response = await fetch(`${URL}/create`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    
    // Handle response based on status code
    if (response.status === 200){
        // If successful, display success message, clear form fields, and hide image preview
        console.log("Item added successfully");
        alert("Item added successfully");
        document.getElementById('itemName').value = '';
        document.getElementById('itemCategory').value = ''
        document.getElementById('itemDescription').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemCondition').value = '';
        document.getElementById('itemImage').value = '';

        // Hide the image preview
        var preview = document.getElementById('imagePreview');
        preview.src = '#'; // Reset the image source
        preview.style.display = 'none';
    } else {
        // If unsuccessful, throw an error
        throw new Error('Failed to save item');
    }
}

// Function to display all items
async function displayAllItems(){
    // Send GET request to retrieve all items
    const response = await fetch(`${URL}/all`, { method: "GET" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const results = await response.json(); // Parse JSON body
    // Update UI to display all items
    var displayCategory = document.getElementById('display-category'); 
    displayCategory.innerHTML = 'All Products'; 
    updateUI(results); // Call a function to handle the UI update
}

// Function to handle purchase of a product
async function buyProduct(productID, productRev, productName){
    // Send DELETE request to buy the product
    const response = await fetch(`${URL}/delete?productID=${productID}&productRev=${productRev}`,{ method: "DELETE" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        // If successful, display success message and redirect to all products page
        alert("Bought item " + productName + "!");
        window.location.href = 'products.html?all=true';
    }
}

// Function to display items based on a specific category
async function displayItems(category){
    // Send GET request to retrieve items of the specified category
    const response = await fetch(`${URL}/read?category=${category}`,{ method: "GET" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const results = await response.json();
    var displayCategory = document.getElementById('display-category'); 
    displayCategory.innerHTML = 'All ' + category; 
    updateUI(results);
}

// Function to search for items based on search parameters
async function searchItems(searchParams){
    // Send GET request to search for items based on search parameters
    const response = await fetch(`${URL}/read?searchParams=${searchParams}`,{ method: "GET" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const results = await response.json();
    var displayCategory = document.getElementById('display-category'); 
    displayCategory.innerHTML = 'All Items'; 
    updateUI(results);
}

// Function to update product information
async function updateProductInfo() {
    // Retrieve product ID and revision from the UI
    const productId = document.getElementById('product-id').textContent;
    const productRev = document.getElementById('product-revision').textContent;
    var updateField = document.getElementById('update-field').value;
    var newValue = document.getElementById('new-value').value;

    // Perform lowercase conversion if necessary
    if (updateField === "category" || updateField === "condition"){
        updateField = updateField.toLowerCase();
        newValue = newValue.toLowerCase();
    }

    // Construct update data object
    const updateData = {id: productId, rev: productRev, field: updateField, newValue: newValue};

    // Send PUT request to update product information
    const response = await fetch(`${URL}/update`, { 
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData) 
    });

    // Handle response
    if (!response.ok) {
        throw new Error('Network response was not ok');
    } else {
        // If successful, display success message and redirect to all products page
        alert("Updated item!");
        closeUpdatePopup();
        window.location.href = 'products.html?all=true';
    }
}

// Event listeners for category buttons
bookButton.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('search-input').value = '';
    displayItems('Books');
});

electronicsButton.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('search-input').value = '';
    displayItems('Electronics');
});

fashionButton.addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('search-input').value = '';
    displayItems('Fashion');
});

// Event listener for search button
searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    // Retrieve search input value
    const searchParamInput = document.getElementById('search-input').value.trim();
    if (searchParamInput !== '') {
    // If search input is not empty, update the URL with the search query
        window.location.href = 'products.html?name=' + encodeURIComponent(searchParamInput);
    } else {
    // If search input is empty, display all items
        displayAllItems();
}
});

// Event listener for update button
updateButton.addEventListener('click', (event) => {
    event.preventDefault();
    updateProductInfo();
});

// Function to display the update popup
function displayUpdatePopup(productId, productRev, productName) {
    // Populate necessary fields if needed
    document.getElementById('product-id').textContent = productId;
    document.getElementById('product-revision').textContent = productRev;

    // Display the update popup
    document.getElementById('update-popup').style.display = 'block';
}

// Function to close the update popup
function closeUpdatePopup() {
    document.getElementById('update-popup').style.display = 'none';
}


// Function to update the UI with product information
function updateUI(products) {
    // Clear existing content
    var productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    // Loop through each product and generate HTML to display it
    products.forEach((product) => {
        var productHTML = `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Description: ${product.description}</p>
                <p>Condition: ${product.condition}</p>
                <p class="price">Price: $${product.price}</p>
                <button class="buy-button" onclick="buyProduct('${product._id}', '${product._rev}', '${product.name}')">Buy</button>
                <button class="update-button" onclick="displayUpdatePopup('${product._id}', '${product._rev}', '${product.name}')">Update</button>
            </div>
        `;
        // Append the HTML to the products container
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}

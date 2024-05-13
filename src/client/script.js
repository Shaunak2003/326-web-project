// Initialize PouchDB database for storing items

// Retrieve button elements for handling various functionalities
const bookButton = document.getElementById('book-button')
const electronicsButton = document.getElementById('electronics-button')
const fashionButton = document.getElementById('fashion-button')
const searchButton = document.getElementById('button-input')
const exploreButton = document.getElementById('explore-products-button')
const URL = "http://localhost:3000"


// Function to be called when the page loads to handle search parameters in the URL
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('name');
    if (searchParam) {
        // If there's a search parameter in the URL, perform the search
        searchItems(searchParam);
    } else {
        // If no search parameter, display all items
        displayAllItems();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const allProducts = params.get('all');
    const category = params.get('category');
    if (allProducts) {
        displayAllItems();
    } else if (category) {
        displayItems(category);
    }
});



async function saveItem(){
    var idCount = Math.floor(Math.random() * 10000000000); // Generate a random ID for the new item
    var itemName = document.getElementById('itemName').value;
    var itemCategory = document.getElementById('itemCategory').value
    var itemDescription = document.getElementById('itemDescription').value;
    var itemPrice = parseFloat(document.getElementById('itemPrice').value);
    var itemCondition = document.getElementById('itemCondition').value;
    var itemImage = document.getElementById('itemImage').value 

    var item = {
        "_id": `${idCount}`,
        "category": itemCategory,
        "name": itemName,
        "description": itemDescription,
        "price": itemPrice,
        "condition": itemCondition,
        "image": itemImage
    }
    console.log("script.js - ",item)

   /*  try{ */
        const response = await fetch(`${URL}/create`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        
        if (response.status === 200){
            console.log("Item added successfully")
            alert("Item added successfully");
          // Clear form fields after submission
          document.getElementById('itemName').value = '';
          document.getElementById('itemCategory').value = ''
          document.getElementById('itemDescription').value = '';
          document.getElementById('itemPrice').value = '';
          document.getElementById('itemCondition').value = '';
          document.getElementById('itemImage').value = '';

          // Hide the image preview
          var preview = document.getElementById('imagePreview');
          preview.src = '#'; // Reset the image source
          preview.style.display = 'none'; // Hide the image preview
        }
        else{
            throw new Error('Failed to save item');
        }
    }

async function displayAllItems(){
       const response = await fetch(`${URL}/all`, { method: "GET" });
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       const results = await response.json(); // Parse JSON body
       console.log("script.js - ", results);
       var displayCategory = document.getElementById('display-category'); 
       displayCategory.innerHTML = 'All Products'; 
       updateUI(results); // Call a function to handle the UI update
}

    
function updateUI(products) {
   // Update display category
   var productsContainer = document.getElementById('products-container');
   productsContainer.innerHTML = '';
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
               <button class="update-button" onclick="updateProduct('${product._id}', '${product._rev}', '${product.name}')">Update</button>
           </div>
       `;
       productsContainer.insertAdjacentHTML('beforeend', productHTML);
   });
}

async function updateProduct(productID, productRev, productName){
    //to be written
}

async function buyProduct(productID, productRev, productName){
    console.log(productID)
    console.log(productRev)
    const response = await fetch(`${URL}/delete?productID=${productID}&productRev=${productRev}`,{ method: "DELETE" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    else{
        alert("Bought item " + productName + "!")
        window.location.href = 'products.html?all=true'
    }
}

async function displayItems(category){
    const response = await fetch(`${URL}/read?category=${category}`,{ method: "GET" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const results = await response.json()
    var displayCategory = document.getElementById('display-category'); 
    displayCategory.innerHTML = 'All ' + category; 
    updateUI(results)
}


async function searchItems(searchParams){
    const response = await fetch(`${URL}/read?searchParams=${searchParams}`,{ method: "GET" });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const results = await response.json()
    var displayCategory = document.getElementById('display-category'); 
    displayCategory.innerHTML = 'All Items'; 
    updateUI(results)
}

// Event listeners for category buttons
bookButton.addEventListener('click', (event) => {
    event.preventDefault()
    document.getElementById('search-input').value = ''
    displayItems('Books')
  })

electronicsButton.addEventListener('click', (event) => {
    event.preventDefault()
    document.getElementById('search-input').value = ''
    displayItems('Electronics')
  })

fashionButton.addEventListener('click', (event) => {
    event.preventDefault()
    document.getElementById('search-input').value = ''
    displayItems('Fashion')
  })

searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      const searchParamInput = document.getElementById('search-input').value.trim();
      if (searchParamInput !== '') {
          // Update the URL with the search query
          window.location.href = 'products.html?name=' + encodeURIComponent(searchParamInput);
      } else {
          // If search input is empty, just display all items
          displayAllItems();
      }
  });

  // Function to display the update popup
function displayUpdatePopup(productId, productRev, productName) {
    // Populate necessary fields if needed
    // For example:
    // document.getElementById('product-id').value = productId;
    // document.getElementById('product-name').value = productName;

    // Display the update popup
    document.getElementById('update-popup').style.display = 'block';
}

// Function to close the update popup
function closeUpdatePopup() {
    document.getElementById('update-popup').style.display = 'none';
}

// Function to update product information
async function updateProductInfo() {
    const productId = document.getElementById('product-id').value;
    const productRev = document.getElementById('product-rev').value;
    const updateField = document.getElementById('update-field').value;
    const newValue = document.getElementById('new-value').value;

    // Implement logic to update the product
    // For example, make a fetch request to update the product on the server

    // After updating, close the popup
    closeUpdatePopup();
}

function updateUI(products) {
    // Update display category
    var productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
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
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}


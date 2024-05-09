// Initialize PouchDB database for storing items

// Retrieve button elements for handling various functionalities
const bookButton = document.getElementById('book-button')
const electronicsButton = document.getElementById('electronics-button')
const fashionButton = document.getElementById('fashion-button')
const searchButton = document.getElementById('button-input')
const exploreButton = document.getElementById('explore-products-button')
const URL = "http://localhost:3000"

// Check if products exist in the database
/* db.allDocs()
  .then(docs => {
    if (docs.total_rows === 0) {
      // Fetch products from JSON file and add them to the database
      fetch('products.json')
        .then(response => response.json())
        .then(data => {
          data.forEach(product => {
            db.put(product)
              .then(response => console.log("Product added:", response))
              .catch(error => console.error("Error adding product:", error));
          });
        })
        .catch(error => console.error("Error fetching products:", error));
    } else {
      console.log("Products already exist in the database. Skipping addition.");
    }
  })
  .catch(error => console.error("Error querying database:", error)); */


// Function to save an item to the database
 /*  function saveItem() {
      // Get user input
      var idCount = Math.floor(Math.random() * 10000000000); // Generate a random ID for the new item
      var itemName = document.getElementById('itemName').value;
      var itemCategory = document.getElementById('itemCategory').value
      var itemDescription = document.getElementById('itemDescription').value;
      var itemPrice = parseFloat(document.getElementById('itemPrice').value);
      var itemCondition = document.getElementById('itemCondition').value;
      var itemImage = document.getElementById('itemImage').value

      // Add the item object to the PouchDB database
      var item = {
        "_id": `${idCount}`,
        "category": itemCategory,
        "name": itemName,
        "description": itemDescription,
        "price": itemPrice,
        "condition": itemCondition,
        "image": itemImage
    }
      db.put(item)
      .then(function (response) {
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
      })
      .catch(function (err) {
          console.log(err);
      });

      // Retrieve and log the item
       db.get(`${idCount}`).then( (item) => {
          console.log(item);
      })
      .catch(function (err) {
          console.log(err);
      }); 
} */

// Function to display an image preview when a file is selected
/* function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var dataURL = reader.result;
        var preview = document.getElementById('imagePreview');
        preview.src = dataURL;
        preview.style.display = 'block'; // Show the image preview
    };
    reader.readAsDataURL(input.files[0]);
} */

// Function to perform a search based on the input from the search bar
/* function searchItems(searchParam){
  console.log(searchParam)
    db.allDocs({
      include_docs: true,
      attachments: true
  }).then( (result) => {
    var items = result.rows.filter(function (row) {
        return row.doc.name.toLowerCase().includes(searchParam.toLowerCase())
    });
    var displayCategory = document.getElementById('display-category')
    displayCategory.innerHTML = 'Items with similar names'

    var productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';

    items.forEach(function (row) {
      var product = row.doc;
      var productHTML = `
          <div class="product">
              <img src="${product.image}" alt="${product.name}">
              <h3>${product.name}</h3>
              <p>Category: ${product.category}</p>
              <p>Description: ${product.description}</p>
              <p>Condition: ${product.condition}</p>
              <p class="price">Price: $${product.price}</p>
              <button class="buy-button" onclick="buyProduct('${product._id}', '${product._rev}', '${product.name}')">Buy</button>
          </div>
      `;
      productsContainer.insertAdjacentHTML('beforeend', productHTML);
  });

  }).catch(function (err) {
            console.log(err);
        });
  } */

  // Function to display items based on category selected
  function displayItems(category) {
    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        var items = result.rows.filter(function (row) {
          lowerCaseCategory = category.toLowerCase() //this is just for the products.html to display the 
          //category of the product with the first letter capitalized
            return row.doc.category === `${lowerCaseCategory}`;
        });

        // Update the category display at the top of the products container
        var displayCategory = document.getElementById('display-category')
        displayCategory.innerHTML = 'All ' + category

        // Clear previous entries in the products container
        var productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';

        // Append each found item's details to the products container
        items.forEach(function (row) {
            var product = row.doc;
            var productHTML = `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Description: ${product.description}</p>
                    <p>Condition: ${product.condition}</p>
                    <p class="price">Price: $${product.price}</p>
                    <button class="buy-button" onclick="buyProduct('${product._id}', '${product._rev}', '${product.name}')">Buy</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }).catch(function (err) {
        console.log(err);
    });
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

// Function to handle the purchase of a product
function buyProduct(productID, productRev, productName){
    // Remove the item from the database once bought
  console.log(productName)
  alert("Bought item " + productName + "!")
  db.remove(productID, productRev)
  //alert("Bought item " + productName + "!")
  window.location.href = "index.html"; // Redirect to homepage after purchase
}

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

// Display all items in the database
/* function displayAllItems() {
    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        

        var displayCategory = document.getElementById('display-category'); 
        displayCategory.innerHTML = 'All Products'; // Update display category

        var productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';

        // Populate the products container with all available products
        result.rows.forEach(function (row) {
            var product = row.doc;
            var productHTML = `
                <div class="product">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Description: ${product.description}</p>
                    <p>Condition: ${product.condition}</p>
                    <p class="price">Price: $${product.price}</p>
                    <button class="buy-button" onclick="buyProduct('${product._id}', '${product._rev}', '${product.name}')">Buy</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }).catch(function (err) {
        console.log(err);
    });
} */

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
   try {
       const response = await fetch(`${URL}/all`, { method: "GET" });
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }
       const results = await response.json(); // Parse JSON body
       console.log("script.js - ", results);
       updateUI(results); // Call a function to handle the UI update
   } catch (error) {
       console.error('Failed to fetch:', error);
       throw error;
   }
}

    
function updateUI(products) {
   var displayCategory = document.getElementById('display-category'); 
   displayCategory.innerHTML = 'All Products'; // Update display category
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
           </div>
       `;
       productsContainer.insertAdjacentHTML('beforeend', productHTML);
   });
}
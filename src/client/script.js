var db = new PouchDB('items');

const bookButton = document.getElementById('book-button')
const electronicsButton = document.getElementById('electronics-button')
const fashionButton = document.getElementById('fashion-button')
const searchButton = document.getElementById('button-input')
const exploreButton = document.getElementById('explore-products-button')

// Function to save an item to the database
  function saveItem() {
      // Get user input
      var idCount = Math.floor(Math.random() * 10000000000);
      var itemName = document.getElementById('itemName').value;
      var itemCategory = document.getElementById('itemCategory').value
      var itemDescription = document.getElementById('itemDescription').value;
      var itemPrice = parseFloat(document.getElementById('itemPrice').value);
      var itemCondition = document.getElementById('itemCondition').value;
      var itemImage = document.getElementById('itemImage').value

      // Add the item object to the PouchDB database
      db.put({
          "_id": `${idCount}`,
          "category": itemCategory,
          "name": itemName,
          "description": itemDescription,
          "price": itemPrice,
          "condition": itemCondition,
          "image": itemImage
      })
      .then(function (response) {
          //console.log('Item added successfully!');
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
          preview.style.display = 'none'; // Hide the image preview
      })
      .catch(function (err) {
          console.log(err);
      });

      // Retrieve and log the item
      /* db.get(`${idCount}`).then( (item) => {
          console.log(item);
      })
      .catch(function (err) {
          console.log(err);
      }); */

      
      //db.destroy()
}

function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
        var dataURL = reader.result;
        var preview = document.getElementById('imagePreview');
        preview.src = dataURL;
        preview.style.display = 'block'; // Show the image preview
    };
    reader.readAsDataURL(input.files[0]);
}

function searchItems(searchParam){
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
          </div>
      `;
      productsContainer.insertAdjacentHTML('beforeend', productHTML);
  });

  }).catch(function (err) {
            console.log(err);
        });
  }

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

        var displayCategory = document.getElementById('display-category')
        displayCategory.innerHTML = 'All ' + category

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
                    <button class="buy-button" onclick="buyProduct('${product._id}')">Buy</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

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
  event.preventDefault()
  const searchParamInput = document.getElementById('search-input').value
  if (searchParamInput.trim() !== ''){
    window.location.href = 'products.html?name=' + encodeURIComponent(searchParamInput)
  }
  var search = new URLSearchParams(window.location.search)
  var searchParam = search.get('name')
  searchItems(searchParam)
})

function buyProduct(productID){
    window.location.href = "index.html";
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
function displayAllItems() {
    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        var displayCategory = document.getElementById('display-category');
        displayCategory.innerHTML = 'All Products';

        var productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';

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
                    <button class="buy-button" onclick="buyProduct('${product._id}')">Buy</button>
                </div>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }).catch(function (err) {
        console.log(err);
    });
}
var db = new PouchDB('items');
var idCount = 0
console.log("id count before reload", idCount)
// run a function that initializes/syncs with localsotrsge

/* function syncWithLocalStorage() {
  // Replicate data from PouchDB to local storage
  return db.replicate.to(new PouchDB('itemsLocalStorage'))
      .on('complete', function () {
          console.log('Replication completed successfully');
      })
      .on('error', function (err) {
          console.log('Error replicating data:', err);
      });
} */

// Function to save an item to the database
  function saveItem() {
      // Get user input
      idCount++;
      console.log("id count after save item", idCount);

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
      db.get(`${idCount}`).then( (item) => {
          console.log(item);
      })
      .catch(function (err) {
          console.log(err);
      });

      
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

document.addEventListener('DOMContentLoaded', function () {
    //var db = new PouchDB('items');

    // Function to display items with the category "books"
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
            displayCategory.innerHTML = category

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

    // Call the displayBooks function to populate the products page with books
    var params = new URLSearchParams(window.location.search);
    var category = params.get('category');

    // Call the displayItems function with the category parameter
    if (category) {
        displayItems(category);
    }
});

var temp = document.getElementById('search-input').value
console.log(temp)

function searchItems(){
    var searchParam = document.getElementById('search-input').value
    console.log(searchParam)
    db.allDocs({
      include_docs: true,
      attachments: true
  }).then( (result) => {
    var items = result.rows.filter(function (row) {
      lowerCaseSearchParam = searchParam.toLowerCase() 
        return row.doc.name === `${lowerCaseSearchParam}`;
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

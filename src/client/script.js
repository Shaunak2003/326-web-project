var db = new PouchDB('items');
var idCount = 0;

// Function to save a item to the database
function saveItem() {
    // Get user input
    idCount++;
    console.log(idCount);

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

// Define a Mango query selector
var selector = {
    "selector": {
        "category": "books"
    }
};

// Use the Mango query selector with allDocs to retrieve documents with category "books"
db.find(selector)
    .then(function (result) {
        // Map the documents to an array of objects
        var booksArray = result.docs.map(function(doc) {
            return {
                id: doc._id,
                category: doc.category,
                name: doc.name,
                description: doc.description,
                price: doc.price,
                condition: doc.condition,
                image: doc.image
            };
        });

        // Now booksArray contains the documents with category "books" as an array of objects
        console.log("Books Array:", booksArray);

        // Display books from booksArray
        const bookstore = document.getElementById('bookstore');
        booksArray.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const name = document.createElement('h2');
            name.textContent = book.name;
            bookDiv.appendChild(name);

            const description = document.createElement('p');
            description.textContent = book.description;
            bookDiv.appendChild(description);

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = `Price: $${book.price}`;
            bookDiv.appendChild(price);

            const condition = document.createElement('p');
            condition.textContent = `Condition: ${book.condition}`;
            bookDiv.appendChild(condition);

            bookstore.appendChild(bookDiv);
        });
    })
    .catch(function (err) {
        console.log(err);
    });

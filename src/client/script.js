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
        document.getElementById('itemImage').value = ''
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
    db.destroy()
}

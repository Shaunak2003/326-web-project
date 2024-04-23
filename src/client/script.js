var db = new PouchDB('books');
var idCount = 0;

// Function to save a book to the database
function saveBook() {
    // Get user input
    idCount++;
    console.log(idCount);

    var bookName = document.getElementById('bookName').value;
    var bookDescription = document.getElementById('bookDescription').value;
    var bookPrice = parseFloat(document.getElementById('bookPrice').value);
    var bookCondition = document.getElementById('bookCondition').value;

    // Add the book object to the PouchDB database
    db.put({
        "_id": `${idCount}`,
        "name": bookName,
        "description": bookDescription,
        "price": bookPrice,
        "condition": bookCondition
    })
    .then(function (response) {
        //console.log('Item added successfully!');
        alert("Item added successfully");
        document.getElementById('bookName').value = '';
        document.getElementById('bookDescription').value = '';
        document.getElementById('bookPrice').value = '';
        document.getElementById('bookCondition').value = '';
    })
    .catch(function (err) {
        console.log(err);
    });

    // Retrieve and log the book
    db.get(`${idCount}`).then(function (book) {
        console.log(book);
    })
    .catch(function (err) {
        console.log(err);
    });
}

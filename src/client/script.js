var db = new PouchDB('books');

// Function to save a book to the database
function saveBook() {
    // Get user input
    var bookName = document.getElementById('bookName').value;
    var bookDescription = document.getElementById('bookDescription').value;
    var bookPrice = parseFloat(document.getElementById('bookPrice').value);
    var bookCondition = document.getElementById('bookCondition').value;

    // Create a book object
    var book = {
        "name": bookName,
        "description": bookDescription,
        "price": bookPrice,
        "condition": bookCondition
    };
    console.log(book)

    // Add the book object to the PouchDB database
    db.post(book)
        .then(function (response) {
            console.log('Book added successfully!');
            // Clear the form fields after successful submission
            document.getElementById('bookName').value = '';
            document.getElementById('bookDescription').value = '';
            document.getElementById('bookPrice').value = '';
            document.getElementById('bookCondition').value = '';
        })
        .catch(function (err) {
            console.log(err);
        });
}

db.allDocs({include_docs: true})
  .then(function (result) {
    // Log the documents to the console
    console.log(result.rows.map(row => row.doc));
  })
  .catch(function (err) {
    console.log(err);
  });
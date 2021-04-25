//below we define a quick bit of logic to validate our form fields when adding or editing a new book
//all fields are required https://www.tutorialspoint.com/javascript/javascript_form_validations.htm
function validate(editBookId) {
    //quick function to throw alert
    let throwAlert = function() {alert('All fields are required.')};
    //switch statement to check on each field
    switch (true) {
        //if title empty not valid
        case (document.bookForm.bookTitle.value.trim() == ''):
            throwAlert();
            return false;
        //if author empty not valid
        case (document.bookForm.bookAuthor.value.trim() == ''):
            throwAlert();
            return false;
        //if genre not selected not valid
        case (document.bookForm.genreSelect.selectedIndex == 0):
            throwAlert();
            return false;
    }
    //else valid we call our function to save the book object
    //pass editBookId although it might be null so we know whether we need to save a new book or overwrite an existing one
    saveBookItem(editBookId);
    return true;
}
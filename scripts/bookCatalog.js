//initializing our empty list of book objects
let bookList = [];
//initialize a local variable that references our unordered list in the DOM
let bookDispList = document.querySelector('#bookList');
//constructor definition to use when creating book objects
function book(id, title, author, genre, rating) {
    this.id = id; //this id is important for manipulating our booklist later
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.rating = rating;
}

//below we define a function to load our list of books if their are any books currently in it
function loadBooks() {
    //below we check to see if we already have a list of books defined in our session storage
    if (localStorage.getItem('bookList') == null) {
        //if we dont have a list of books in our session storage, then we add our local bookList as an item in our session storage
        localStorage.setItem('bookList', JSON.stringify(bookList));
    } else {
        //if we do have a list of books in our session storage, we set our local list of book objects to the one in session storage and populate our unordered list in the DOM
        bookList = JSON.parse(localStorage.getItem('bookList'));
        bookList.forEach((bookObject) => bookDispList.innerHTML += 
            `<li bookId=${bookObject.id} class="list-group-item"><i><b>Title:</b>\t${bookObject.title}</i>\t
            <i><b>Author:</b>\t${bookObject.author}</i>\t
            <i><b>Genre:</b>\t${bookObject.genre}</i>\t
            <i><b>Rating:</b>\t${bookObject.rating}/5</i>
            <div class="options"><span class="btn btn-primary" onclick="editBookItem(this.closest('li'))">Edit</span>
            <span class="btn btn-danger" onclick="deleteBook(this.closest('li'))">\u00D7</span></div></li>`); //here we add our buttons to delete and edit our list items as we create themhttps://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    }
}

//below we define a function to handle the event when we click our 'Edit' button on our book
//the function gets passed the list item within which the button was clicked
function editBookItem(bookObject) {
    //show our collapsed form
    document.querySelector('#collapseFormContent').classList.add('show');
    //we get the book Object from our localStorage that matches the bookObject we were passed as a list item
    let sessionBookObject = JSON.parse(localStorage.getItem('bookList')).find((sessionItem) => sessionItem.id == bookObject.getAttribute('bookId'));
    //populate the fields of our form so that they hold the fields of the book object we are trying to edit
    document.bookForm.bookTitle.value = sessionBookObject.title;
    document.bookForm.bookAuthor.value = sessionBookObject.author;
    document.bookForm.genreSelect.value = sessionBookObject.genre;
    document.bookForm.reviewRange.value = sessionBookObject.rating;
    //we also add an attribut to the form so we can quickly check to see if we are editing a book when we validate our entry
    document.bookForm.setAttribute('editBookId', `${bookObject.getAttribute('bookId')}`);
}

//below we define a function to handle the click event on our close spans to delete the relevant book from our list of book objects
//our function takes in the list item from which the close span was clicked
function deleteBook(bookObject) {
    //we first get the bookList from session storage
    bookList = JSON.parse(localStorage.getItem('bookList'));
    //we then remove the bookObject we have been passed from the bookList
    bookList.splice(bookList.findIndex((sessionBookObject) => sessionBookObject.id == bookObject.getAttribute('bookId')), 1);
    //we then set book list in session storage to the list we just modified
    localStorage.setItem('bookList', JSON.stringify(bookList));
    //reload our page so that everything gets nicely refreshed
    location.reload();
}

//this function only gets called once the form is validated in formValidation.validate()
function saveBookItem(bookId) {
    //since form has been validated, we can just add our book object to our bookList
    //we first need to make sure that we are working with the right list of books, which would be the one in the session storage
    bookList = JSON.parse(localStorage.getItem('bookList'));
    
    //if bookId equals null then we aren't editing a book, so we create a new book
    if (bookId == null) {
        //we then initialize a new book using our constructor with all of our field values
        //we set the id of our new book to 0 if list is empty else we take last item in list and add 1 to the id and set it to that, these unique identifiers are important for the deleteBook() func
        let bookObject = new book(
            bookList.length > 0 ? bookList.slice(-1)[0].id + 1 : 0,
            document.bookForm.bookTitle.value,
            document.bookForm.bookAuthor.value,
            document.bookForm.genreSelect.value,
            document.bookForm.reviewRange.value
            );
        //we add our new book object to our bookList array of objects
        bookList.push(bookObject);
    } else {
        //if our bookId is not zero it means we are editing an existing book so lets overwrite the book with the new values
        //we use a arrow function here to get the bookIndex in our localStorage object because id does not always equal index
        let bookIndex = bookList.findIndex((sessionItem) => bookId == sessionItem.id);
        //we then overwrite the existing book in the booklist
        bookList[bookIndex].title = document.bookForm.bookTitle.value;
        bookList[bookIndex].author = document.bookForm.bookAuthor.value;
        bookList[bookIndex].genre = document.bookForm.genreSelect.value;
        bookList[bookIndex].rating = document.bookForm.reviewRange.value;
    }

    //we then make sure to update our booklist in the localStorage. once this function has completed running the validate() function will return true and the page and therefore the unordered book list will be reloaded
    localStorage.setItem('bookList', JSON.stringify(bookList));
}
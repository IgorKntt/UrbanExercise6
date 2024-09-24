//setting links to page elements
const btnBookOk = document.getElementById("btnBookOk");
const btnBookCancel = document.getElementById("btnBookCancel");
const booksList = document.getElementById("booksList");
const popupMenu = document.getElementById("popupMenu");
const formEditTitle = document.getElementById("formEditTitle");
const formEditAuthor = document.getElementById("formEditAuthor");
const formEditYear = document.getElementById("formEditYear");
const formEditGenre = document.getElementById("formEditGenre");
const formEditStatus = document.getElementById("formEditStatus");
const popupTitle = document.getElementById("popupTitle");
const bookAddCard = document.getElementById("bookAddCard");
const genreFilter = document.getElementById("filterGenre");
const statusFilter = document.getElementById("filterStatus");
const btnListClear = document.getElementById("btnListClear");


function popupHide(){
    /*function hides popup menu when after user adding new book, 
    editting existing book or canceling adding / editing*/

    //setting classes to popup menu warp (shade) block 
    //which set display:none property for hide adding/editting form 
    popupMenu.classList.add("popup-shade_hidden");
    popupMenu.classList.remove("popup-shade_visible");

    //setting all inputs in form to empty strings
    popupTitle.textContent = "Добавить книгу";
    formEditTitle.value = "";
    formEditAuthor.value = "";
    formEditYear.value = "";
    formEditGenre.value = "";
    formEditStatus.checked = "";
}


function popupShow(bookCard){
    let menuTitle = "Добавить книгу", readStatus="";

    if(bookCard){
        menuTitle = "Редактировать данные книги";
        
        let {title, author, year, genre, statusText} = getBookData(bookCard);
               
        if(statusText == "Прочитано"){
            readStatus = "checked";
        }

        popupTitle.textContent = menuTitle;
        formEditTitle.value = title;
        formEditAuthor.value = author;
        formEditYear.value = year;
        formEditGenre.value = genre;
        formEditStatus.checked = readStatus;
       
        btnBookOk.onclick = addBook.bind(null, bookCard);
       
    } else {      
        btnBookOk.onclick = addBook.bind(null, bookAddCard);
    }
     
    //setting classes to popup menu warp (shade) block 
    //which set display:block property to show adding / editing form
    popupMenu.classList.remove("popup-shade_hidden");
    popupMenu.classList.add("popup-shade_visible");
}

function addBookCard(bookData, node){
    let newCard = document.createElement("div");
    newCard.className = "book-card";
    newCard.setAttribute("name", "book-card");
       
    newCard.innerHTML = `<ul class='book-info'>
                <li><h3 class='book-title' name="title">${bookData.title}</h3></li>
                <li>Автор: <span name="author">${bookData.author}</span></li>
                <li>Год издания: <span name="year">${bookData.year}</span></li>
                <li>Жанр: <span name="genre">${bookData.genre}</span></li>
                <li>Статус: <span name="book-status">${bookData.statusText}</span></li>
                </ul>
                <div class='book-menu'>
                <button class='btn-book-edit'>Редактировать</button>
                <button class='btn-book-delete'>Удалить</button></div>`;
    
    booksList.insertBefore(newCard, node);
    console.dir(newCard.dataset);
}

function addBook(node){

    if (formEditTitle.value.trim() == ""){
        alert("Нельзя создать книгу без названия");
        return;
    }

    let bookStatus = "Не прочитано";

    if (formEditStatus.checked){
        bookStatus = "Прочитано"; 
    }

    let bookData = {
        title: formEditTitle.value.trim(),
        author: formEditAuthor.value.trim(),
        year: formEditYear.value.trim(),
        genre: formEditGenre.value.trim(),
        statusText: bookStatus
    }
 
    addBookCard(bookData, node);

    if (node != bookAddCard){
        node.remove();
    }
    filterBooks();
    saveBooks();
    popupHide();

}

function getBookData (bookCard){
    const cardTitle = bookCard.querySelector("[name='title']").textContent;
    const cardAuthor = bookCard.querySelector("[name='author']").textContent;
    const cardYear = bookCard.querySelector("[name='year']").textContent;
    const cardGenre = bookCard.querySelector("[name='genre']").textContent;
    const cardStatus = bookCard.querySelector("[name='book-status']").textContent;

    return {
        title: cardTitle, 
        author: cardAuthor, 
        year: cardYear, 
        genre: cardGenre,
        statusText: cardStatus
    }
}

function saveBooks(){
    let booksData = Array.from(booksList.querySelectorAll("[name='book-card']")).
    map(book => getBookData(book));
    setCounter();

    localStorage.setItem("books", JSON.stringify(booksData));
}

function filterBooks(){

    const genreFilterText = genreFilter.value.trim().toLowerCase();
    const statusFilterText = statusFilter.value;

    Array.from(booksList.querySelectorAll("[name='book-card']")).forEach(function(book){
        const {genre, statusText} = getBookData(book);
        if (genre.toLowerCase().includes(genreFilterText) && statusText.includes(statusFilterText)){
            book.style.display = "";
        } else {
            book.style.display = "none";
        }
    })
}

function setCounter(){
    const counter = document.querySelector(".book-counter").children[0];
    counter.textContent = booksList.children.length-1;
}

function clearBookList(){
   Array.from(booksList.children).forEach(book => {
        if (booksList.children.length == 1){
            return;
        }
            console.log(booksList.children.length)
            book.remove()
        });
   console.dir(booksList.children);
   saveBooks();    
}

booksList.addEventListener("click", function(event){
    if (event.target.tagName !== "BUTTON"){
        return;
    }

    if(event.target.textContent == "Удалить"){
        event.target.parentNode.parentNode.remove();
        saveBooks();
        return;
    }

    if(event.target.textContent == "Редактировать"){
        popupShow(event.target.parentNode.parentNode);
        return;
    }

    if(event.target.textContent == "Добавить книгу"){
        popupShow();
        return;
    }

})

genreFilter.oninput = filterBooks;
statusFilter.onchange = filterBooks;
btnListClear.onclick = clearBookList;

btnBookCancel.onclick = popupHide;

document.addEventListener("DOMContentLoaded", ()=>{
    let data = JSON.parse(localStorage.getItem("books")) || [];
      
    data.forEach(book => addBookCard(book, bookAddCard));
    saveBooks();
});
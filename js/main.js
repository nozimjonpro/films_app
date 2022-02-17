const elFilmsSearchForm = findElement('.films__form');
const elFilmsSearchInputText = findElement('.films__input-text');
const elFilmsSearchInputNumber = findElement('.films__input-number');
const elFilmsSelectGenre = findElement('.films__select-genre');
const elFilmsSelectRate = findElement('.films__select-rate');
const elFilmsTemplate = findElement('#films__template').content;
const elFilmsRenderList = findElement('.films__cards-list');
const elFilmsSlider = findElement('.pagination');
const elFilmsBookmarkList = findElement('.films__bookmark-list');
const elFilmsCardButtonListener = findElement('.films__cards-list');
const elFilmsModal = findElement('.modal__here');
const elFilmsModalTemplate = findElement('#modal__template').content;
const searchResults = findElement('.search-result');
const disabler = findElement('.films__dis');
const disablerNext = findElement('.films__dis--next');
const elNextButton = findElement('.films__slider-next');
const elPreviousButton = findElement('.films__slider-prev');
function renderModal(array, node){
    node.innerHTML = null;
    array.forEach(film=>{
        const modalTemplate = elFilmsModalTemplate.cloneNode(true);
        findElement('.modal__image', modalTemplate).src = film.poster;
        findElement('.modal__heading', modalTemplate).textContent = film.title;
        findElement('.modal__overview', modalTemplate).textContent = film.overview;
        node.appendChild(modalTemplate)
    })
}

let currentPage = 1;
let rows = 2;

function displayPagination(array, filmsList, rowPerPage, page){
    filmsList.innerHTML = null; 
    page--;
    let loopStart = rowPerPage * page;
    let paginatedFilms = array.slice(loopStart, loopStart + rowPerPage)
    
    renderFilms(paginatedFilms, elFilmsRenderList);
}

if(currentPage === 1){
    disabler.classList.add('disabeler')
}

function paginater(prev, next, array){
    if(next){
        currentPage++
       if(currentPage>1){
        disabler.classList.remove('disabeler')
       }
       if((array.length/2)<=currentPage){
        disablerNext.classList.add('disabeler')
    } 
        filterByGenre(array);
        
    }else if(prev){
        currentPage--
        if(currentPage === 1){
            disabler.classList.add('disabeler')
        }
        if(Math.ceil(array.length/2)>=currentPage){
            disablerNext.classList.add('disabeler')
        } 
        filterByGenre(array);
    }
}
    
elFilmsSlider.addEventListener('click', (evt)=>{
    const nextButton = evt.target.classList[0]==='films__slider-next';
    const prevButton = evt.target.classList[0] === 'films__slider-prev';
    paginater(prevButton, nextButton, films)
})

const collectedBookmarks = [];
let modalInfoArr = [];
function renderBookmarks(array, node){
    node.innerHTML = null;
    
    array.forEach(row=>{
        const newLi = document.createElement('li');
        const newButton = document.createElement('button');
        const newSpan = document.createElement('span')
        newSpan.textContent = row.title;
        newButton.textContent = 'remove';
        
        newLi.classList.add('films__bookmark-item')
        newSpan.classList.add('bookmarks__heading')
        newButton.classList.add('bookmarks__delete-button');
        
        newButton.setAttribute('type', 'button');
        newButton.dataset.buttonId = row.id;
        newLi.appendChild(newSpan)
        newLi.appendChild(newButton)
        node.appendChild(newLi)
    })
}

elFilmsCardButtonListener.addEventListener('click', (evt)=>{
    if(evt.target.matches('.films-bookmark__button')){
        const filmId = evt.target.dataset.filmId;
        const foundFilm = films.find(row => row.id === filmId)
        if(!collectedBookmarks.includes(foundFilm)){
            collectedBookmarks.push(foundFilm);
            renderBookmarks(collectedBookmarks, elFilmsBookmarkList)  
        }else{
            
            renderBookmarks(collectedBookmarks, elFilmsBookmarkList)
        }
    }else if(evt.target.matches('.films-info__button')){
        const infoId = evt.target.dataset.infoId;
        const foundFilm = films.find(row => row.id === infoId);
        modalInfoArr.push(foundFilm)
        elFilmsModal.classList.add('modal--active')
        renderModal(modalInfoArr, elFilmsModal)
        modalInfoArr.splice(0, 1)
    }
})

elFilmsModal.addEventListener('click', (evt)=>{
    if(evt.target.matches('.modal__close')||evt.target.matches('.modal__here')){
        elFilmsModal.classList.remove('modal--active')
    }
})

elFilmsBookmarkList.addEventListener('click', (evt)=>{
    if(evt.target.matches('.bookmarks__delete-button')){
        const filmId = evt.target.dataset.buttonId;
        const removeFilm = collectedBookmarks.findIndex(row=>row.id === filmId);
        console.log(removeFilm)
        collectedBookmarks.splice(removeFilm, 1)
        renderBookmarks(collectedBookmarks, elFilmsBookmarkList)
    }
})

function renderFilms(array, node){
    node.innerHTML = null;
    const filmFragement = document.createDocumentFragment();
    array.forEach(film => {
        const filmsTemplate = elFilmsTemplate.cloneNode(true);
        findElement('.card-title', filmsTemplate).textContent = film.title;
        findElement('.films-card__image', filmsTemplate).src = film.poster;
        findElement('.films-bookmark__button', filmsTemplate).dataset.filmId = film.id;
        findElement('.films-info__button', filmsTemplate).dataset.infoId = film.id
        filmFragement.appendChild(filmsTemplate)
    });
    
    node.appendChild(filmFragement)
}

function renderSelect(array, select){
    const allGenres = [];
    array.forEach(film=>{
        film.genres.forEach(genre=>{
            if(!allGenres.includes(genre)){
                allGenres.push(genre)
            }
        })
    })
    
    allGenres.forEach(genre=>{
        const newOption = document.createElement('option');
        newOption.textContent = genre;
        newOption.value = genre;
        select.appendChild(newOption)
    })
}

function filterByGenre(array){
    let inputValue = elFilmsSearchInputText.value.trim();
    let regex = new RegExp(inputValue, 'gi');
    const filterInput = array.filter(film=>film.title.match(regex));
    let optionValue = elFilmsSelectGenre.value.trim();
    const filteredSelect = filterInput.filter(film=>film.genres.includes(optionValue));
    filmSorter(filteredSelect);
    displayPagination(filteredSelect, elFilmsRenderList, rows, currentPage)
    searchResults.textContent = filteredSelect.length;
    if(optionValue == 'All'){
        displayPagination(films, elFilmsRenderList, rows, currentPage)
    }
}

function filmSorter(array){
    let selectValue = elFilmsSelectRate.value.trim();
    if(selectValue === 'a_z'){
        array.sort((a, b)=>{
            if (a.title > b.title){
                return 1;
            } else if(a.title < b.title){
                return -1;
            } else{
                return 0;
            }
        })
    } else if(selectValue === 'z_a'){
        array.sort((a, b)=>{
            if (a.title < b.title){
                return 1;
            } else if(a.title > b.title){
                return -1;
            } else{
                return 0;
            }
        })
    } else if(selectValue === 'old_new'){
        array.sort((a, b)=>{
            if (a.release_date > b.release_date){
                return 1;
            } else if(a.release_date < b.release_date){
                return -1;
            } else{
                return 0;
            }
        })
    } else if(selectValue === 'new_old'){
        array.sort((a, b)=>{
            if (a.release_date < b.release_date){
                return 1;
            } else if(a.release_date > b.release_date){
                return -1;
            } else{
                return 0;
            }
        })
    }
    renderFilms(array, elFilmsRenderList)
}

function handleSubmit(evt){
    evt.preventDefault();
    
    filterByGenre(films)
}

elFilmsSearchForm.addEventListener('submit', handleSubmit)

renderSelect(films, elFilmsSelectGenre);
displayPagination(films, elFilmsRenderList, rows, currentPage)
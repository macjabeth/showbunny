// html elements
const searchForm = document.getElementById('search-form');
const searchResults = document.getElementById('search-results');
const searchPagination = document.getElementById('search-pagination');
const mediaDialog = document.getElementById('media-dialog');

// access data
const API_KEY = 'fa4fa1ba075a48db1aeb756f4343bc23';
const Query = {};

// event listeners
searchForm.addEventListener('submit', handleSearch);

// function handlers
function handleSearch(event) {
  const query = document.getElementById('search-bar').value;
  const category = document.querySelector('input[name="search-category"]:checked').value;

  fetchData(query, category);

  event.preventDefault();
}

function fetchData(query, category, page = 1) {
  if (query === '') {
    alert('Bad bunny! You must add a search query.');
  } else {
    Query.search = `https://api.themoviedb.org/3/search/${category}?api_key=${API_KEY}&query=${query}&page=${page}`;
    Query.category = category;
    fetch(Query.search)
      .then((response) => response.json())
      .then((json) => handleSearchResults(json))
      .catch((reason) => console.error(reason));
  }
}

fetchData('bunny', 'movie');

function handleSearchResults(json) {
  console.log(json);

  // clear existing search results
  while (searchResults.firstChild) {
    searchResults.removeChild(searchResults.firstChild);
  }

  // display results
  json.results.forEach((result) => {
    searchResults.appendChild(createResultCard(result));
  });

  createPagination(json.total_pages, json.page);
}

function createResultCard(result) {
  const li = document.createElement('li');

  // set class
  li.classList.add('search-result');

  // create image
  const img = document.createElement('img');
  img.src = result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'http://via.placeholder.com/200x300';

  // handle click event - media dialog events will go here
  li.addEventListener('click', () => createDialog(result));

  // append the children
  li.appendChild(img);

  // Add title and year info
  const info = document.createElement('div');
  const title = document.createElement('span');
  const year = document.createElement('span');

  title.textContent = result.title || result.name;
  const year_text = result.release_date || result.first_air_date || '';
  year.textContent = year_text.split('-')[0];

  info.classList.add('info');
  title.classList.add('info-title');
  year.classList.add('info-year');

  info.appendChild(title);
  info.appendChild(year);

  li.appendChild(info);

  li.addEventListener('mouseover', showInfo);
  li.addEventListener('mouseleave', hideInfo);
  return li;
}

function showInfo() {
  this.getElementsByClassName('info')[0].classList.add('peek');
}

function hideInfo() {
  this.getElementsByClassName('info')[0].classList.remove('peek');
}

function createPagination(pages, current) {
  // clear existing search pagination
  while (searchPagination.firstChild) {
    searchPagination.removeChild(searchPagination.firstChild);
  }

  // add previous page
  if (current > 1) {
    const previousPage = document.createElement('a');

    previousPage.innerHTML = '&laquo;';
    previousPage.addEventListener('click', () => {
      fetchData(Query.search, Query.category, current - 1);
    });

    searchPagination.appendChild(previousPage);
  }

  // add all pages
  for (let i = 1; i <= pages; i++) {
    const link = document.createElement('a');

    if (current === i) link.classList.add('active');

    link.textContent = i;

    link.addEventListener('click', () => {
      fetchData(Query.search, Query.category, i);
    });

    searchPagination.appendChild(link);
  }

  // add next page
  if (current < pages) {
    const nextPage = document.createElement('a');

    nextPage.innerHTML = '&raquo;';
    nextPage.addEventListener('click', () => {
      fetchData(Query.search, Query.category, current + 1);
    });

    searchPagination.appendChild(nextPage);
  }
}

function createDialog(result) {
  console.log(result);

  // insert data
  document.getElementById('media-backdrop').src = result.backdrop_path ? `https://image.tmdb.org/t/p/w500${result.backdrop_path}` : 'http://via.placeholder.com/500x300';

  document.getElementById('media-rating').textContent = result.vote_average;

  document.getElementById('media-overview').textContent = result.overview;

  // add event listeners
  document.getElementById('media-close').addEventListener('click', () => {
    mediaDialog.close();
  });

  window.addEventListener('click', (event) => {
    if (event.target == mediaDialog) {
      mediaDialog.close();
    }
  });

  // display dialog
  mediaDialog.showModal();
}
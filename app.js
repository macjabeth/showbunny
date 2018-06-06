// html elements
const searchForm = document.getElementById('search-form')
const searchResults = document.getElementById('search-results')
const searchPagination = document.getElementById('search-pagination')
// const infoDialog = document.getElementById('info-dialog')

// access data
const API_KEY = 'fa4fa1ba075a48db1aeb756f4343bc23'
let searchQuery, searchCategory

// event listeners
searchForm.addEventListener('submit', handleSearch)

// function handlers
function handleSearch(event) {
  const query = document.getElementById('search-bar').value
  const category = document.querySelector('input[name="search-category"]:checked').value

  fetchData(query, category)

  event.preventDefault()
}

function fetchData(query, category, page = 1) {
  if (query === '') {
    alert('Bad bunny! You must add a search query.')
  } else {
    searchQuery = `https://api.themoviedb.org/3/search/${category}?api_key=${API_KEY}&query=${query}&page=${page}`
    searchCategory = category
    fetch(searchQuery)
      .then((response) => response.json())
      .then((json) => handleSearchResults(json))
      .catch((reason) => console.error(reason))
  }
}

function handleSearchResults(json) {
  console.log(json)

  // clear existing search results
  searchResults.innerHTML = ''

  // display results
  json.results.forEach((result) => {
    searchResults.appendChild(createResultCard(result))
  })

  createPagination(json.total_pages, json.page)
}

function createResultCard(result) {
  const li = document.createElement('li')

  // set class
  li.className = 'search-result'

  // create image
  const img = document.createElement('img')
  img.src = result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'http://via.placeholder.com/200x300'

  // handle click event
  li.addEventListener('click', () => console.log(result))

  // append the children
  li.appendChild(img)

  return li
}

function createPagination(pages, current) {
  // clear existing search pagination
  searchPagination.innerHTML = ''

  // add previous page
  if (current > 1) {
    const previousPage = document.createElement('a')

    previousPage.innerHTML = '&laquo;'
    previousPage.addEventListener('click', () => {
      fetchData(searchQuery, searchCategory, current - 1)
    })

    searchPagination.appendChild(previousPage)
  }

  // add all pages
  for (let i = 1; i <= pages; i++) {
    const link = document.createElement('a')

    if (current === i) link.className = 'active'

    link.textContent = i

    link.addEventListener('click', () => {
      fetchData(searchQuery, searchCategory, i)
    })

    searchPagination.appendChild(link)
  }

  // add next page
  if (current < pages) {
    const nextPage = document.createElement('a')

    nextPage.innerHTML = '&raquo;'
    nextPage.addEventListener('click', () => {
      fetchData(searchQuery, searchCategory, current + 1)
    })

    searchPagination.appendChild(nextPage)
  }
}
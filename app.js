let searchBox = document.getElementById('search-box');
let searchResults = document.getElementById('search-results')
let searchButton = document.getElementById('search-button')

const API_KEY = 'fa4fa1ba075a48db1aeb756f4343bc23'

function showResultInfo(card) {
  let data = card.data
  let category = card.category
  let image = data.backdrop_path ? 'https://image.tmdb.org/t/p/w300' + data.backdrop_path : 'http://via.placeholder.com/300x300'
  let title = category == 'tv' ? data.name : data.title
  let original_date = category === 'tv' ? data.first_air_date : data.release_date
  let overview = data.overview

  document.getElementById('info-backdrop').src = image
  document.getElementById('info-title').innerHTML = title
  document.getElementById('info-date').innerHTML = original_date

  let modal = document.getElementById('info-modal')
  modal.style.display = 'block'

  let span = document.getElementsByClassName('modal-close')[0]
  span.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none'
    }
  })
}

function buildResultCard(data, category) {
  let card = document.createElement('li')
  let image = data.poster_path ? 'https://image.tmdb.org/t/p/w200' + data.poster_path
                               : 'http://via.placeholder.com/200x300'
  let html = `
    <img src="${image}">
  `

  card.classList.add('search-result')
  card.innerHTML = html
  card.data = data
  card.category = category

  card.addEventListener('click', (event) => {
    event.preventDefault()
    showResultInfo(card)
  })

  searchResults.appendChild(card)
}

searchButton.addEventListener('click', (event) => {
  event.preventDefault()
  console.log(event)

  // clear the results first so they aren't appended to the bottom
  searchResults.innerHTML = ''

  let text = searchBox.value
  let category = document.querySelector('input[name="search-category"]:checked').value;
  let searchQuery = `https://api.themoviedb.org/3/search/${category}?api_key=${API_KEY}&query=${text}`

  fetch(searchQuery)
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      json.results.forEach((result) => {
        buildResultCard(result, category)
      })
    })
})
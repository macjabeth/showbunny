let searchBox = document.getElementById('search-box');
let searchResults = document.getElementById('search-results')
let searchButton = document.getElementById('search-button')

const API_KEY = 'fa4fa1ba075a48db1aeb756f4343bc23'

function buildResultCard(data, category) {
  let card = document.createElement('li')
  let image = data.poster_path ? 'https://image.tmdb.org/t/p/w200' + data.poster_path
                               : 'http://via.placeholder.com/200x300'
  let html = `
    <img src="${image}">
    <div class="container">
      <h4><b>${category === 'movie' ? data.title : data.name}</b></h4>
      <p>${data.overview}</p>
    </div>
  `

  card.classList.add('search-result')
  card.innerHTML = html

  searchResults.appendChild(card)
}

searchButton.addEventListener('click', (event) => {
  event.preventDefault()
  console.log(event)
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
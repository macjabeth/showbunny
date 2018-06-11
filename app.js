// Bunnies handle the API
const bunny = new BunnyChan;
// Kitties handle the UI
const kitty = new KittySan;

// Load default data on DOM load
document.addEventListener('DOMContentLoaded', fetchData);

// Query search event
document.getElementById('search-form').addEventListener('submit', (event) => {
  // capture form data
  const query = document.getElementById('search-bar').value;
  const category = document.querySelector('input[name="search-category"]:checked').value;
  // change current search query
  bunny.changeQuery(query, category);
  // fetch and display results
  fetchData();
  // prevent page reload
  event.preventDefault();
});

function fetchData() {
  bunny.fetchData()
    .then(data => kitty.paintSearchResults(data))
    .catch(err => console.error(err));
}
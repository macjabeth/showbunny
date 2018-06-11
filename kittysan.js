// kittysan handles ui logic
class KittySan {
  constructor() {
    this.searchResults = document.getElementById('search-results');
    this.searchPagination = document.getElementById('search-pagination');
    this.mediaDialog = document.getElementById('media-dialog');
    this.mediaClose = document.getElementById('media-close');
    this.mediaBackdrop = document.getElementById('media-backdrop');
    this.mediaTitle = document.getElementById('media-title');
    this.mediaStatus = document.getElementById('media-status');
    this.mediaRating = document.getElementById('media-rating');
    this.mediaNetwork = document.getElementById('media-network');
    this.mediaGenres = document.getElementsByClassName('genres')[0];
    this.mediaStream = document.getElementById('media-stream');
    this.mediaDetails = document.getElementById('media-details');
    this.mediaOverview = document.getElementById('media-overview');
  }

  paintSearchResults(data) {
    // clear existing search results
    while (this.searchResults.firstChild) {
      this.searchResults.removeChild(this.searchResults.firstChild);
    }

    // display results
    data.results.forEach(result => {
      // create list item
      const li = document.createElement('li');
      // add classes
      li.classList.add('search-result');
      // handle click event
      li.addEventListener('click', () => this.paintDialog(result));
      // create the image
      const img = document.createElement('img');
      // set the image path
      img.setAttribute('src', result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'http://via.placeholder.com/200x300');
      // append image to list item
      li.appendChild(img);
      // create title and year elements
      const info = document.createElement('div');
      const title = document.createElement('span');
      const year = document.createElement('span');
      // add classes
      info.classList.add('info');
      title.classList.add('info-title');
      year.classList.add('info-year');
      // add text content
      title.textContent = result.title || result.name;
      const date = result.release_date || result.first_air_date || '';
      year.textContent = date.split('-')[0];
      // add info to list item
      info.appendChild(title);
      info.appendChild(year);
      li.appendChild(info);
      // add hover events
      li.addEventListener('mouseover', () => info.classList.add('peek'));
      li.addEventListener('mouseleave', () => info.classList.remove('peek'));
      // add list item to results
      this.searchResults.appendChild(li);
    })

    // clear existing search pagination
    while (this.searchPagination.firstChild) {
      this.searchPagination.removeChild(this.searchPagination.firstChild);
    }

    // add previous page
    if (data.page > 1) {
      // create link element
      const previousPage = document.createElement('a');
      // add inner html content
      previousPage.innerHTML = '&laquo;';
      // handle click event to fetch results from previous page
      previousPage.addEventListener('click', () => {
        bunny.changeQuery(bunny.query, bunny.category, bunny.page - 1);
        fetchData();
      })
      // add link to search pagination
      this.searchPagination.appendChild(previousPage);
    }

    // add all pages
    for (let i = 1; i <= data.total_pages; i++) {
      // create link element
      const link = document.createElement('a');
      // set active page class
      if (data.page === i) link.classList.add('active');
      // add text content
      link.textContent = i;
      // handle click event to fetch data from page
      link.addEventListener('click', () => {
        bunny.changeQuery(bunny.query, bunny.category, i);
        fetchData();
      });
      // add link to search pagination
      this.searchPagination.appendChild(link);
    }

    // add next page
    if (data.page < data.total_pages) {
      // create link element
      const nextPage = document.createElement('a');
      // add inner html content
      nextPage.innerHTML = '&raquo;';
      // handle click event to fetch results from next page
      nextPage.addEventListener('click', () => {
        bunny.changeQuery(bunny.query, bunny.category, bunny.page + 1);
        fetchData();
      })
      // add link to search pagination
      this.searchPagination.appendChild(nextPage);
    }
  }

  paintDialog(result) {
    // log data
    console.log(result);
    // add backdrop
    this.mediaBackdrop.setAttribute('src', result.backdrop_path ? `https://image.tmdb.org/t/p/w500${result.backdrop_path}` : 'http://via.placeholder.com/500x300');
    // clear existing media ratings
    while (this.mediaRating.firstChild) {
      this.mediaRating.removeChild(this.mediaRating.firstChild);
    }
    // helper functions
    const roundHalf = (num) => Math.round(num * 2) * 0.5;
    const addStar = (cls) => {
      const icon = document.createElement('i');
      icon.className = cls;
      this.mediaRating.appendChild(icon);
    }
    // add title
    this.mediaTitle.textContent = result.title;
    // add ze stars
    const stars = roundHalf(result.vote_average * 0.5);
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        addStar('fas fa-star');
      } else if (i - 0.5 === stars) {
        addStar('fas fa-star-half');
      }
    }
    // clear existing media genres
    while (this.mediaGenres.firstChild) {
      this.mediaGenres.removeChild(this.mediaGenres.firstChild);
    }
    // add genres
    bunny[bunny.category + '_genres']
      .filter(genre => result.genre_ids.includes(genre.id))
      .forEach(genre => {
        // create genre element
        const li = document.createElement('li');
        // add classes
        li.classList.add('genre');
        // add text content
        li.textContent = genre.name;
        // add genre element to genres div
        this.mediaGenres.appendChild(li);
      });
    // add overview
    this.mediaOverview.textContent = result.overview;
    // handle dialog close event
    this.mediaClose.addEventListener('click', () => this.mediaDialog.close());
    // handle clicking outside the dialog
    window.addEventListener('click', (event) => {
      if (event.target === this.mediaDialog) {
        this.mediaDialog.close();
      }
    });
    // display dialog
    this.mediaDialog.showModal();
  }
}
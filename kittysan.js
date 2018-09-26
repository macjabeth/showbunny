// handles UI logic
class KittySan {
  constructor() {
    this.elements = {
      searchCategories: document.getElementsByName('search-category'),
      searchResults: document.getElementById('search-results'),
      searchPagination: document.getElementById('search-pagination'),
      mediaDialog: document.getElementById('media-dialog'),
      mediaClose: document.getElementById('media-header').getElementsByClassName('close-btn')[0],
      mediaBackdrop: document.getElementById('media-backdrop'),
      mediaTitle: document.getElementById('media-title'),
      mediaStatus: document.getElementById('media-status'),
      mediaRating: document.getElementById('media-rating'),
      mediaNetwork: document.getElementById('media-network'),
      mediaGenres: document.getElementsByClassName('genres')[0],
      mediaStream: document.getElementById('media-stream'),
      mediaDetails: document.getElementById('media-details'),
      mediaOverview: document.getElementById('media-overview'),
      streamBtn: document.getElementById('stream-btn'),
      streamContainer: document.getElementById('stream-container'),
      streamIframe: document.getElementById('stream-iframe')
    };
    this.elements.streamClose = this.elements.streamContainer.getElementsByClassName('close-btn')[0];
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.paintData();
      this.handleSearchBar();
      this.handleMediaClose();
    });
  }

  handleMediaClose() {
    this.elements.mediaClose.addEventListener('click', () => this.elements.mediaDialog.close());
    // handle clicking outside the dialog
    window.addEventListener('click', (event) => {
      if (event.target === this.mediaDialog) {
        this.elements.mediaDialog.close();
      }
    });
    // handle stream close event
    this.elements.streamClose.addEventListener('click', () => {
      this.elements.streamContainer.classList.remove('stream-active');
      //clear currently loaded movie
      this.elements.streamIframe.src = '';
      //re enable transition
      const meow = this.elements;
      setTimeout(function () {
        meow.streamContainer.classList.remove('stream-disable-transition');
      }, 1100);
    });
  }

  handleSearchBar() {
    document.getElementById('search-form').addEventListener('submit', (event) => {
      const query = document.getElementById('search-bar').value;
      const category = document.querySelector('input[name="search-category"]:checked').value;
      bunny.changeQuery(query, category, 1);
      this.paintData();
      event.preventDefault();
    });
    document.getElementById('search-bar').addEventListener('keydown', (event) => {
      if (event.code === 'Tab') {
        this.toggleCategory();
        event.preventDefault();
      }
    });
  }

  paintData() {
    bunny.fetchData()
      .then(data => this.paintSearchResults(data))
      .catch(err => console.error(err));
  }

  toggleCategory() {
    for (let i = 0; i < this.elements.searchCategories.length; i++) {
      const element = this.elements.searchCategories[i];
      if (element.checked) {
        element.checked = false;
        (this.elements.searchCategories[i + 1] || this.elements.searchCategories[0]).checked = true;
        break;
      }
    }
  }

  paintSearchResults(data) {
    // clear existing search results
    while (this.elements.searchResults.firstChild) {
      this.elements.searchResults.removeChild(this.elements.searchResults.firstChild);
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
      this.elements.searchResults.appendChild(li);
    });

    // clear existing search pagination
    while (this.elements.searchPagination.firstChild) {
      this.elements.searchPagination.removeChild(this.elements.searchPagination.firstChild);
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
        this.paintData();
      });
      // add link to search pagination
      this.elements.searchPagination.appendChild(previousPage);
    }

    // add all pages
    for (let i = 1; i <= data.total_pages; i++) {
      if (i === 1 || (i >= (data.page - 2) && i <= (data.page + 2)) || i === data.total_pages) {
        // create link element
        const link = document.createElement('a');
        // if current page
        if (data.page === i) {
          // set active page class
          link.classList.add('active');
          // make it editable
          link.setAttribute('contenteditable', true);
          link.addEventListener('click', () => document.execCommand('selectAll', false, null));
          link.addEventListener('keypress', (event) => {
            if (event.code === 'Enter') {
              bunny.changeQuery(bunny.query, bunny.category, parseInt(event.target.textContent));
              this.paintData();
              event.preventDefault();
            }
          })
        } else {
          // handle click event to fetch data from page
          link.addEventListener('click', () => {
            bunny.changeQuery(bunny.query, bunny.category, i);
            this.paintData();
          });
        }
        // add text content
        link.textContent = i;
        // add link to search pagination
        this.elements.searchPagination.appendChild(link);
      }
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
        this.paintData();
      });
      // add link to search pagination
      this.elements.searchPagination.appendChild(nextPage);
    }
  }

  paintDialog(result) {
    // log data
    console.log(result);
    // fetch result details
    if (bunny.category === 'movie') {
      bunny.fetchMovieDetails(result.id)
        .then(data => {
          // log details
          console.log(data);
          // set media status
          this.elements.mediaStatus.textContent = data.status;
        })
        .catch(err => console.error(err));
    } else {
      bunny.fetchTVDetails(result.id)
        .then(data => {
          // log details
          console.log(data);
          // set media status
          this.elements.mediaStatus.textContent = data.status;
        })
        .catch(err => console.error(err));
    }
    // add backdrop
    this.elements.mediaBackdrop.setAttribute('src', result.backdrop_path ? `https://image.tmdb.org/t/p/w500${result.backdrop_path}` : 'http://via.placeholder.com/500x300');
    // clear existing media ratings
    while (this.elements.mediaRating.firstChild) {
      this.elements.mediaRating.removeChild(this.elements.mediaRating.firstChild);
    }
    // helper functions
    const roundHalf = (num) => Math.round(num * 2) * 0.5;
    const addStar = (cls) => {
      const icon = document.createElement('i');
      icon.className = cls;
      this.elements.mediaRating.appendChild(icon);
    };
    // add title
    this.elements.mediaTitle.textContent = result.title || result.name;
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
    while (this.elements.mediaGenres.firstChild) {
      this.elements.mediaGenres.removeChild(this.elements.mediaGenres.firstChild);
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
        this.elements.mediaGenres.appendChild(li);
      });
    // add overview
    this.elements.mediaOverview.textContent = result.overview;
    // handle media spider stream
    this.elements.streamBtn.addEventListener('click', () => {
      // set streaming source
      this.elements.streamIframe.setAttribute('src', bunny.category === 'movie' && bunny.getMovieStream(result.id) || bunny.getTVStream(result.id, prompt('Which season?'), prompt('Which episode?')));

      this.elements.streamContainer.classList.add('stream-active');
      this.elements.mediaDialog.close();

      const meow = this.elements;
      setTimeout(function () {
        meow.streamContainer.classList.add('stream-disable-transition');
      }, 1100);
    });

    // display dialog
    this.elements.mediaDialog.showModal();
  }

}

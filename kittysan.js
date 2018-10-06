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
      trailerBtn: document.getElementById('trailer'),
      streamBtn: document.getElementById('stream'),
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
    window.addEventListener('click', event => {
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
      setTimeout(function() {
        meow.streamContainer.classList.remove('stream-disable-transition');
      }, 1100);
    });
  }

  handleSearchBar() {
    document.getElementById('search-form').addEventListener('submit', event => {
      const query = document.getElementById('search-bar').value;
      bunny.changeQuery(query, null, 1);
      this.paintData();
      event.preventDefault();
    });
    this.elements.searchCategories.forEach(element => {
      element.addEventListener('click', event => {
        bunny.changeQuery(bunny.query, element.value, 1);
        this.paintData();
      });
    });
    document.getElementById('search-bar').addEventListener('keydown', event => {
      if (event.code === 'Tab') {
        this.toggleCategory();
        event.preventDefault();
      }
    });
  }

  paintData() {
    if (bunny.query === '') {
      bunny
        .fetchTrendingData()
        .then(data => this.paintSearchResults(data))
        .catch(err => console.error(err));
    } else {
      bunny
        .fetchData()
        .then(data => this.paintSearchResults(data))
        .catch(err => console.error(err));
    }
  }

  toggleCategory() {
    for (let i = 0; i < this.elements.searchCategories.length; i++) {
      const element = this.elements.searchCategories[i];
      if (element.checked) {
        element.checked = false;
        let nextCategory = this.elements.searchCategories[i + 1] || this.elements.searchCategories[0];
        nextCategory.checked = true;
        bunny.category = nextCategory.value;
        this.paintData();
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
      img.setAttribute('src', result.poster_path ? `https://image.tmdb.org/t/p/w200${result.poster_path}` : 'placeholder.png');
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
      if (i === 1 || (i >= data.page - 2 && i <= data.page + 2) || i === data.total_pages) {
        // create link element
        const link = document.createElement('a');
        // if current page
        if (data.page === i) {
          // set active page class
          link.classList.add('active');
          // make it editable
          link.setAttribute('contenteditable', true);
          link.addEventListener('click', () => document.execCommand('selectAll', false, null));
          link.addEventListener('keypress', event => {
            if (event.code === 'Enter') {
              bunny.changeQuery(bunny.query, bunny.category, parseInt(event.target.textContent));
              this.paintData();
              event.preventDefault();
            }
          });
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
    let result_data;
    // fetch result details
    if (bunny.category === 'movie') {
      bunny
        .fetchMovieDetails(result.id)
        .then(data => {
          // log details
          console.log(data);
          result_data = data;
          // set media status
          this.elements.mediaStatus.textContent = data.status;
          // fetch videos
          bunny.fetchMovieVideos(data.id).then(data => {
            console.log(data);
            result_data.videos = data;
          });
        })
        .catch(err => console.error(err));
    } else {
      bunny
        .fetchTVDetails(result.id)
        .then(data => {
          // log details
          console.log(data);
          result_data = data;
          // set media status
          this.elements.mediaStatus.textContent = data.status;
          // fetch videos
          bunny.fetchTVVideos(data.id).then(data => {
            console.log(data);
            result_data.videos = data;
          });
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
    const roundHalf = num => Math.round(num * 2) * 0.5;
    const addStar = cls => {
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
    bunny[bunny.category + '_genres'].filter(genre => result.genre_ids.includes(genre.id)).forEach(genre => {
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
    // handle media trailer
    this.elements.trailerBtn.addEventListener('click', () => {
      let result_video;
      for (let i = 0; i < result_data.videos.results.length; i++) {
        const video = result_data.videos.results[i];
        if (video.type === 'Trailer') {
          result_video = video;
          break;
        }
      }
      if (result_video) {
        this.elements.trailerBtn.firstChild.style = ''; // failsafe
        this.setStreamSource(`https://www.youtube.com/embed/${result_video.key}`);
      } else {
        this.elements.trailerBtn.firstChild.style = 'text-decoration: line-through';
      }
    }, {once: true});
    // handle media spider stream
    this.elements.streamBtn.addEventListener('click', () => {
      // set streaming source
      if (bunny.category === 'movie') {
        this.setStreamSource(bunny.getMovieStream(result.id));
      } else {
        // get season
        const seasons = result_data.seasons.length;
        const season = prompt(`Which season? (${seasons === 1 ? '1' : '1-' + seasons})`);
        // get episode
        const episode_count = result_data.seasons[parseInt(season) - 1].episode_count;
        const episode = prompt(`Which episode? (1-${episode_count})`);

        this.setStreamSource(bunny.getTVStream(result.id, season, episode));
      }
    }, {once: true});

    // display dialog
    this.elements.mediaDialog.showModal();
  }

  setStreamSource(src) {
    this.elements.streamIframe.setAttribute('src', src);
    this.elements.streamContainer.classList.add('stream-active');
    this.elements.mediaDialog.close();
    const meow = this.elements;
    setTimeout(function() {
      meow.streamContainer.classList.add('stream-disable-transition');
    }, 1100);
  }
}

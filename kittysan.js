// handles UI logic
class KittySan {
  constructor() {
    this.firstLoad = true;
    this.elements = {
      searchCategories: document.getElementsByName('search-category'),
      searchResults: document.getElementById('search-results'),
      searchPagination: document.getElementById('search-pagination'),
      mediaDialog: document.getElementById('media-dialog'),
      mediaClose: document
        .getElementById('media-header')
        .getElementsByClassName('close-btn')[0],
      mediaBackdrop: document.getElementById('media-backdrop'),
      mediaTitle: document.getElementById('media-title'),
      mediaStatus: document.getElementById('media-status'),
      mediaRating: document.getElementById('media-rating'),
      mediaNetwork: document.getElementById('media-network'),
      mediaGenres: document.getElementsByClassName('genres')[0],
      mediaStream: document.getElementById('media-stream'),
      mediaDetails: document.getElementById('media-details'),
      mediaOverview: document.getElementById('media-overview'),
      mediaSelectContainer: document.getElementById('media-select-container'),
      mediaSelect: document.getElementById('media-select'),
      trailerBtn: document.getElementById('trailer'),
      streamBtn: document.getElementById('stream'),
      streamEpisodeBtn: document.getElementById('stream-episode'),
      streamError: document.getElementById('select-error'),
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
    this.elements.mediaClose.addEventListener('click', () => {
      this.elements.mediaDialog.classList.remove('fadeIn');
      this.elements.mediaDialog.classList.add('fadeOut');
      setTimeout(() => {
        this.elements.mediaDialog.style.display = 'none';
      }, 500);
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
      bunny.changeQuery(query, bunny.category, 1);
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
        let nextCategory =
          this.elements.searchCategories[i + 1] ||
          this.elements.searchCategories[0];
        nextCategory.checked = true;
        bunny.category = nextCategory.value;
        this.paintData();
        break;
      }
    }
  }

  paintSearchResults(data) {
    if (this.elements.searchResults.children.length) {
      for (const child of this.elements.searchResults.children) {
        child.classList.remove('fadeIn', 'zoomInUp', 'delay-2s');
        child.classList.add('fadeOut', 'faster');
      }
    }

    const paint = () => {
      // clear existing search results
      while (this.elements.searchResults.firstChild) {
        this.elements.searchResults.removeChild(
          this.elements.searchResults.firstChild
        );
      }

      // display results
      data.results.forEach(result => {
        // create list item
        const li = document.createElement('li');
        // add classes
        li.classList.add('search-result');
        li.classList.add(
          ...(this.firstLoad
            ? ['animated', 'zoomInUp', 'delay-2s']
            : ['animated', 'fadeIn', 'faster'])
        );
        // handle click event
        li.addEventListener('click', () => this.paintDialog(result));
        // create the image
        const img = document.createElement('img');
        // set the image path
        img.setAttribute(
          'src',
          result.poster_path
            ? `https://image.tmdb.org/t/p/w200${result.poster_path}`
            : 'img/placeholder.png'
        );
        // set alt attribute
        img.setAttribute('alt', `${result.title} poster`);
        // attach image class
        img.classList.add('search-image');
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

      this.firstLoad = false;

      // clear existing search pagination
      while (this.elements.searchPagination.firstChild) {
        this.elements.searchPagination.removeChild(
          this.elements.searchPagination.firstChild
        );
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
        if (
          i === 1 ||
          (i >= data.page - 2 && i <= data.page + 2) ||
          i === data.total_pages
        ) {
          // create link element
          const link = document.createElement('a');
          // if current page
          if (data.page === i) {
            // set active page class
            link.classList.add('active');
            // make it editable
            link.setAttribute('contenteditable', true);
            link.addEventListener('click', () =>
              document.execCommand('selectAll', false, null)
            );
            link.addEventListener('keypress', event => {
              if (event.code === 'Enter') {
                bunny.changeQuery(
                  bunny.query,
                  bunny.category,
                  parseInt(event.target.textContent)
                );
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
    };

    this.firstLoad ? paint() : setTimeout(paint, 1000);
  }

  paintEpisodeSelect() {
    this.elements.mediaSelectContainer.style.display = '';
    this.elements.streamBtn.style.display = 'none';
    this.elements.streamError.style.display = 'none';

    if (document.contains(document.getElementById('select-season'))) {
      document.getElementById('select-season').remove();
      document.getElementById('select-episode').remove();
    }

    ['episode', 'season'].forEach(value => {
      const selectList = document.createElement('select');
      selectList.id = `select-${value}`;
      var option = new Option();
      option.value = 0;
      option.text = `Select ${value}`;
      selectList.options.add(option);
      this.elements.mediaSelect.insertBefore(selectList, this.elements.mediaSelect.childNodes[0]);
    });
  }

  paintDialog(result) {
    // log data
    console.log(result);

    const setTrailerLink = videos => {
      let result_video;
      for (const video of videos) {
        if (video.type === 'Trailer') {
          result_video = video;
          break;
        }
      }
      // handle media trailer
      if (result_video) {
        this.elements.trailerBtn.firstChild.style = ''; // failsafe
        console.log(result_video);
        this.elements.trailerBtn.href = `https://www.youtube.com/embed/${result_video.key}`;
      } else {
        this.elements.trailerBtn.firstChild.style =
          'text-decoration: line-through';
      }
    };

    // fetch result details
    if (bunny.category === 'movie') {
      bunny
        .fetchMovieDetails(result.id)
        .then(data => {
          this.elements.mediaSelectContainer.style.display = 'none';
          this.elements.streamBtn.style.display = '';

          // set media status
          this.elements.mediaStatus.textContent = bunny.inTheatres.has(data.id)
            ? 'In Theatres'
            : data.status;
          // handle streaming link
          this.elements.streamBtn.onclick = () => {
            window.open(`https://ololo.to/s/${data.title} --new --whole`);
          };
          // fetch videos
          bunny.fetchMovieVideos(data.id).then(videos => {
            setTrailerLink(videos.results);
          });
        })
        .catch(err => console.error(err));
    } else {
      bunny
        .fetchTVDetails(result.id)
        .then(data => {
          // set media status
          this.elements.mediaStatus.textContent = data.status;

          this.paintEpisodeSelect();

          const selectSeason = document.getElementById('select-season');
          const selectEpisode = document.getElementById('select-episode');

          data.seasons.forEach((season, index) => {
            var option = new Option();
            option.value = index + 1;
            option.text = `Season ${index + 1}`;
            selectSeason.options.add(option);
          });

          selectSeason.onchange = () => {
            const selectedSeason = selectSeason.value
            const episodes = data.seasons[parseInt(selectedSeason) - 1].episode_count;
            Array.from({ length: episodes }).forEach((episode, index) => {
              var option = new Option();
              option.value = index + 1;
              option.text = `Episode ${index + 1}`;
              selectEpisode.options.add(option);
            });
          }

          // handle streaming link
          this.elements.streamEpisodeBtn.onclick = () => {
            this.elements.streamError.style.display = 'none';
            const selectedSeason = selectSeason.value;
            const selectedEpisode = selectEpisode.value;

            if (selectedSeason === '0' || selectedEpisode === '0') {
              this.elements.streamError.style.display = '';
            } else {
              window.open(`https://ololo.to/s/${result.name} s${selectedSeason.padStart(2, '0')}e${selectedEpisode.padStart(2, '0')} --new --strict`)
            }
          };

          // fetch videos
          bunny.fetchTVVideos(data.id).then(videos => {
            setTrailerLink(videos.results);
          });
        })
        .catch(err => console.error(err));
    }
    // add backdrop
    this.elements.mediaBackdrop.setAttribute(
      'src',
      result.backdrop_path
        ? `https://image.tmdb.org/t/p/w500${result.backdrop_path}`
        : 'img/placeholder_wide.png'
    );
    // clear existing media ratings
    while (this.elements.mediaRating.firstChild) {
      this.elements.mediaRating.removeChild(
        this.elements.mediaRating.firstChild
      );
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
      this.elements.mediaGenres.removeChild(
        this.elements.mediaGenres.firstChild
      );
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
    // display dialog
    this.elements.mediaDialog.classList.remove('fadeOut');
    this.elements.mediaDialog.classList.add('animated', 'fadeIn', 'faster');
    this.elements.mediaDialog.style.display = 'block';
  }

  setStreamSource(src) {
    this.elements.streamIframe.setAttribute('src', src);
    this.elements.streamContainer.classList.add('stream-active');
    this.elements.mediaDialog.style.display = 'none';
    const meow = this.elements;
    setTimeout(function() {
      meow.streamContainer.classList.add('stream-disable-transition');
    }, 1100);
  }
}

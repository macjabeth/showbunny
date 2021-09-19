import BunnyChan from './bunnychan';

/**
 * Remove all child nodes from an element
 * @param {HTMLElement} parent
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/**
 * KittySan
 * This class handles DOM manipulation.
 */

class KittySan {
  constructor() {
    this.elements = {
      popularMovies: document.querySelector('#popular .movie-cards'),
      popularShows: document.querySelector('#popular .show-cards'),
      moviesPage: document.getElementById('movies-page')
    };
  }

  async meow() {
    this.paintPopularMovies();
    this.paintPopularShows();
  }

  async paintPopularMovies() {
    if (this.elements.popularMovies.children.length > 0) return;

    BunnyChan.category = 'movie';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const moviePoster = document.createElement('media-poster');
      const shadow = moviePoster.shadowRoot;

      // Update source URLs
      const cardImage = shadow.querySelector('.card__image');
      cardImage.setAttribute(
        'src',
        cardImage.getAttribute('src') + card.poster_path
      );
      const sources = shadow.querySelectorAll('.js-picture-source');
      for (const source of sources) {
        source.setAttribute(
          'srcset',
          source.getAttribute('srcset') + card.poster_path
        );
      }

      // Update rating
      shadow.querySelector('.card__rating').textContent = card.vote_average;

      // Update episode count
      shadow.querySelector('.card__episode-count').style.display = 'none';

      // Update route path
      shadow.querySelector('a').href = '#movies/' + card.id;

      listElement.append(moviePoster);
      listElement.ariaLabel = card.title;

      // Append to the DOM
      this.elements.popularMovies.append(listElement);
    }
  }

  async paintPopularShows() {
    if (this.elements.popularShows.children.length > 0) return;

    BunnyChan.category = 'tv';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const tvPoster = document.createElement('media-poster');
      const shadow = tvPoster.shadowRoot;

      // Update source URLs
      const cardImage = shadow.querySelector('.card__image');
      cardImage.setAttribute(
        'src',
        cardImage.getAttribute('src') + card.poster_path
      );
      const sources = shadow.querySelectorAll('.js-picture-source');
      for (const source of sources) {
        source.setAttribute(
          'srcset',
          source.getAttribute('srcset') + card.poster_path
        );
      }

      // Update rating
      shadow.querySelector('.card__rating').textContent = card.vote_average;

      // Grab TV episode count
      const details = await BunnyChan.fetchTVDetails(card.id);

      // Update episode count
      const cardEpisodeCount = shadow.querySelector('.card__episode-count');
      cardEpisodeCount.textContent = `${details.number_of_episodes} EP`;

      // Update route path
      shadow.querySelector('a').href = '#tv/' + card.id;

      listElement.append(tvPoster);
      listElement.ariaLabel = card.name;

      // Append to the DOM
      this.elements.popularShows.append(listElement);
    }
  }

  async paintMovieDetails(movieId) {
    // Avoid duplication
    removeAllChildNodes(this.elements.moviesPage);

    console.log({ movieId });
    const movieDetails = await BunnyChan.fetchMovieDetails(movieId);
    console.log({ movieDetails });
    const mediaCard = document.createElement('media-card');
    const shadow = mediaCard.shadowRoot;

    shadow.querySelector('.card-image').src += movieDetails.backdrop_path;
    shadow.querySelector('.card-title').textContent = movieDetails.title;
    shadow.querySelector('.card-year').textContent =
      movieDetails.release_date.split('-')[0];
    shadow.querySelector('.card-rating').textContent =
      movieDetails.vote_average;
    shadow.querySelector('.card-overview').textContent = movieDetails.overview;

    const cardGenres = shadow.querySelector('.card-genres');
    movieDetails.genres.forEach(genre => {
      const listItem = document.createElement('li');
      listItem.className = 'card-genre';
      listItem.textContent = genre.name;
      cardGenres.append(listItem);
    });

    this.elements.moviesPage.append(mediaCard);
  }
}

export default new KittySan();

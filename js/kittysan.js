import BunnyChan from './bunnychan';

/**
 * KittySan
 * This class handles DOM manipulation.
 */

class KittySan {
  constructor() {
    this.elements = {
      popularMovies: document.querySelector('#popular .movie-cards'),
      popularShows: document.querySelector('#popular .show-cards')
    };
  }

  async meow() {
    this.paintPopularMovies();
    this.paintPopularShows();
  }

  async paintPopularMovies() {
    BunnyChan.category = 'movie';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const moviePoster = document.createElement('media-poster');

      moviePoster.dataset.route = '#movies/' + card.id;
      moviePoster.dataset.posterPath = card.poster_path;
      moviePoster.dataset.rating = card.vote_average;

      listElement.append(moviePoster);
      listElement.ariaLabel = card.title;

      // Append to the DOM
      this.elements.popularMovies.append(listElement);
    }
  }

  async paintPopularShows() {
    BunnyChan.category = 'tv';

    const data = await BunnyChan.fetchTrendingData();
    const cards = data.results;

    cards.sort((a, b) => b.vote_average - a.vote_average);

    for (const card of cards) {
      // Create movie poster element
      const listElement = document.createElement('li');
      const tvPoster = document.createElement('media-poster');

      tvPoster.dataset.route = '#tv/' + card.id;
      tvPoster.dataset.posterPath = card.poster_path;
      tvPoster.dataset.rating = card.vote_average;

      // Grab TV episode count
      const details = await BunnyChan.fetchTVDetails(card.id);
      tvPoster.dataset.episodeCount = details.number_of_episodes;

      listElement.append(tvPoster);
      listElement.ariaLabel = card.name;

      // Append to the DOM
      this.elements.popularShows.append(listElement);
    }
  }

  async paintMovieDetails(movieId) {
    const movieDetails = await BunnyChan.fetchMovieDetails(movieId);
    console.log({ movieDetails });
  }
}

export default new KittySan();

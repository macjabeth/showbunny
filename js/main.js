// Components
import './vendor/modernizr-3.11.2.min.js';
import './plugins';
import './components/movie-poster';

// BunnyChan handles API requests.
// KittySan handles DOM manipulation.
import BunnyChan from './bunnychan';
import KittySan from './kittysan';

const bunno = new BunnyChan();
const kitty = new KittySan();

(async () => {
  // Popular Movies
  const data = await bunno.fetchTrendingData();
  kitty.paintPopularMovies(data.results);
})();

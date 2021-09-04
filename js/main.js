// Parcel needs this when working with async
import 'regenerator-runtime/runtime';
import BunnyChan from './bunnychan';
import KittySan from './kittysan';

const bunno = new BunnyChan();
const kitty = new KittySan();

(async () => {
  const data = await bunno.fetchTrendingData()
  console.log(data);
  kitty.populatePopularCards(data.results);
})();

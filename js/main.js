document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

import './plugins';
import './components';

// Set up SPA Router
import Router from './router';

new Router();

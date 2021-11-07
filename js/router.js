// KittySan handles DOM manipulation and interacts
// with BunnyChan to handle API requests.
import KittySan from './kittysan';

export default class Router {
  constructor() {
    this.initialise(location.hash);

    window.addEventListener('hashchange', this.handleRoutes.bind(this));
  }

  initialise(hash) {
    const { route, page, context } = this.parseRoute(hash);

    console.log('init', { route, page, context });

    this.hidePages();

    this.highlightAnchor(route);

    this.showPage(page);

    this.handlePageScript(page, context);
  }

  handleRoutes() {
    const { route, page, context } = this.parseRoute(location.hash);

    console.log('handler', { route, page, context });

    if (this.pages.has(page)) {
      this.highlightAnchor(route);
      this.gotoPage(page);
      this.handlePageScript(page, context);
    } else {
      window.location.hash = '#home';
    }
  }

  handlePageScript(page, context) {
    switch (page) {
      case 'home-page':
        KittySan.meow();
        break;

      case 'movies-page':
        if (!context) return;
        const [movieId] = context;
        KittySan.paintMovieDetails(movieId);
        break;

      case 'tv-page':
        if (!context) return;
        const [tvId] = context;
        KittySan.paintTVDetails(tvId);
        break;

      default:
        break;
    }
  }

  hidePages() {
    const pages = document.querySelectorAll('[id$="page"]');

    this.pages = new Set(Array.from(pages).map(node => node.id));

    pages.forEach(page => (page.style.display = 'none'));
  }

  parseRoute(path) {
    if (!path) path = '#home';
    const [route, ...context] = path.split('/');
    const page = route.slice(1) + '-page';
    return { route, page, context };
  }

  highlightAnchor(route) {
    document.querySelectorAll('.nav-menu a').forEach(el => el.classList.remove('current'));
    document.querySelector(`[href="${route}"]`).classList.add('current');
  }

  hidePage(pageId) {
    document.getElementById(pageId).style.display = 'none';
  }

  showPage(pageId) {
    this.currentPage = pageId;
    document.getElementById(pageId).style.display = 'block';
  }

  gotoPage(pageId) {
    this.hidePage(this.currentPage);
    this.showPage(pageId);
  }
}

import './vendor/modernizr-3.11.2.min.js';
import './plugins';
import './components';

class CustomElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode:'open'});
    const template = document.getElementById('custom-element');
    const clone = template.content.clodeNode(true);
    shadow.appendChild(clone);
  }
}
customElements.define('custom-element', CustomElement);

// Set up SPA Router
import Router from './router';
const router = new Router();

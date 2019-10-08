const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
const { getByText, getByPlaceholderText, wait } = require('@testing-library/dom');
require('@testing-library/jest-dom/extend-expect');

beforeEach(() => {
  document.documentElement.innerHTML = html;
});

test('output renders to the screen', () => {
  // container
  const container = document.body;
  getByText(container, 'Showbunny')
  getByPlaceholderText(container, 'Search...')
  expect(container).toMatchSnapshot();
});
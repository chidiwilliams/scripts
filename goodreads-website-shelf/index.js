const axios = require('axios');
const Window = require('window');

const window = new Window();

const shelfURL =
  'https://www.goodreads.com/review/list/64479598-chidi-williams?utf8=%E2%9C%93&shelf=website-bookshelf&per_page=100';

const textToRating = {
  'really liked it': 4,
  'it was amazing': 5,
};

async function find(url, books = []) {
  const response = await axios.get(url);

  const html = window.document.createElement('html');
  html.innerHTML = response.data;

  const shelfTable = html.querySelectorAll('tr.bookalike.review');
  shelfTable.forEach((row) => {
    const titleElem = row.querySelector('.field.title a');
    const authorElem = row.querySelector('.field.author a');
    const starsRating = row.querySelector('.field.rating .staticStars');

    books.push({
      href: 'https://www.goodreads.com' + titleElem.href,
      title: titleElem.textContent.trim(),
      author: authorElem.innerHTML,
      rating: textToRating[starsRating.title] || 0,
    });
  });

  const nextPageElem = html.querySelector('a.next_page');
  if (!nextPageElem) {
    return books;
  }

  return find('https://www.goodreads.com' + nextPageElem.href, books);
}

find(shelfURL).then((books) => {
  console.log(JSON.stringify(books, null, 2));
});

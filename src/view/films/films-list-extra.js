import AbstractView from '../abstract-view.js';

const getFilmsListExtraTemplate = (title) => (
  `<section class="films-list films-list--extra">
  <h2 class="films-list__title">${title}</h2>

  <div class="films-list__container">

  </div>
  </section>`
);

export default class FilmListExtra extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return getFilmsListExtraTemplate(this._title);
  }

  getFilmContainer() {
    return this.getElement().querySelector('.films-list__container');
  }

  removeFilmCards() {
    this.getFilmContainer().innerHTML = '';
  }

  hide() {
    this.getElement().style.display = 'none';
  }

  show() {
    this.getElement().style.display = 'block';
  }
}

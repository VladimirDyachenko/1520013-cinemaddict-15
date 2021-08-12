import { createElement } from '../../utils/utils.js';

const getFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

export default class FilmList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return getFilmsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._filmListSection = this._element.querySelector('.films-list');
      this._filmListContainer = this._element.querySelector('.films-list__container');
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getFilmSection() {
    if (!this._filmListSection) {
      throw new Error('filmListSection in null');
    }

    return this._filmListSection;
  }

  getFilmContainer() {
    if (!this._filmListContainer) {
      throw new Error('filmListContainer in null');
    }

    return this._filmListContainer;
  }

}

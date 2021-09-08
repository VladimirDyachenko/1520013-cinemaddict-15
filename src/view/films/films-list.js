import { EmptyMessageByCurrentPage } from '../../const';
import { createElement } from '../../utils/dom';
import AbstractView from '../abstract-view.js';

const getFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

export default class FilmList extends AbstractView {

  getTemplate() {
    return getFilmsListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._filmListSection = this._element.querySelector('.films-list');
      this._filmListContainer = this._element.querySelector('.films-list__container');
      this._filmListTitle = this._element.querySelector('.films-list__title');
    }

    return this._element;
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

  showEmptyMessage(activePage, isLoading) {
    let message = '';
    if (isLoading) {
      message = EmptyMessageByCurrentPage.LOADING;
    } else {
      message = EmptyMessageByCurrentPage[activePage];
    }

    this._filmListContainer.remove();
    this._filmListTitle.textContent = message;
    this._filmListTitle.classList.remove('visually-hidden');
  }
}

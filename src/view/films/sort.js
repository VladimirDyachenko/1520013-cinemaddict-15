import AbstractView from '../abstract-view.js';
import { sortType } from '../../const.js';

const getSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort="${sortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort="${sortType.DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort="${sortType.RATING}">Sort by rating</a></li>
  </ul>`
);

export default class SortList extends AbstractView {
  constructor() {
    super();
    this._sortClickHandler = this._sortClickHandler.bind(this);
  }

  getTemplate() {
    return getSortTemplate();
  }

  _sortClickHandler(event) {
    if(event.target.tagName !== 'A') {
      return;
    }

    event.preventDefault();

    const activeButton = this._element.querySelector('.sort__button--active');
    if (activeButton === event.target) {
      return;
    }

    activeButton.classList.remove('sort__button--active');
    event.target.classList.add('sort__button--active');
    const selectedSortType = event.target.dataset.sort;
    this._callbacks.click(selectedSortType);
  }

  setClickHandler(callback) {
    this._callbacks.click = callback;
    this.getElement().addEventListener('click', this._sortClickHandler);
  }
}

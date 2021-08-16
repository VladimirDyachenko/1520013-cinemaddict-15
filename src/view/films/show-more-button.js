import AbstractView from '../abstract-view.js';

const getShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return getShowMoreButtonTemplate();
  }

  _clickHandler(event) {
    this._callbacks.click(event);
  }

  setClickHandler(callback) {
    this._callbacks.click = callback;

    this.getElement().addEventListener('click', this._clickHandler);
  }
}

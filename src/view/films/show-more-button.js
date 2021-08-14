import AbstractView from '../abstract-view.js';

const getShowMoreButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButton extends AbstractView {

  getTemplate() {
    return getShowMoreButtonTemplate();
  }
}

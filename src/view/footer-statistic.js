import { createElement } from '../utils/utils.js';

const getFooterStatisticsTemplate = (showCount) => (
  `<section class="footer__statistics">
    <p>${showCount} movies inside</p>
  </section>`
);

export default class FooterStatistic {
  constructor(showCount) {
    this._element = null;
    this._showCount = showCount;
  }

  getTemplate() {
    return getFooterStatisticsTemplate(this._showCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

import AbstractView from './abstract-view.js';

const getFooterStatisticsTemplate = (showCount) => (
  `<section class="footer__statistics">
    <p>${showCount} movies inside</p>
  </section>`
);

export default class FooterStatistic extends AbstractView {
  constructor(showCount) {
    super();
    this._showCount = showCount;
  }

  getTemplate() {
    return getFooterStatisticsTemplate(this._showCount);
  }
}

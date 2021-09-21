import AbstractView from './abstract-view.js';

const getFooterStatisticsTemplate = (showCount) => (
  `<p>${showCount} movies inside</p>`
);

export default class FooterStatistic extends AbstractView {
  constructor(showCount) {
    super();
    this._showCount = showCount;
  }

  getTemplate() {
    return getFooterStatisticsTemplate(this._showCount);
  }

  updateCount(count) {
    this.getElement().textContent = `${count}  movies inside`;
  }
}

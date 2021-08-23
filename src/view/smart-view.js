import AbstractView from './abstract-view.js';

export default class SmartView extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(newData, rerender) {
    if (!newData) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      newData,
    );

    if (rerender) {
      this.updateElement();
    }
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement();
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}

import AbstractSubscriber from './abstract-observer.js';
import { Pages } from '../const.js';

export default class SiteNavModel extends AbstractSubscriber {
  constructor() {
    super();
    this._activePage = Pages.All;
  }

  setActivePage(updateType, page) {
    this._activePage = page;
    this._notify(updateType, this._activePage);
  }

  getActivePage() {
    return this._activePage;
  }

}

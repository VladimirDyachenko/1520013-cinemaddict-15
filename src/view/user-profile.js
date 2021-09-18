import { getUserRank } from '../utils/utils.js';
import SmartView from './smart-view.js';

const getUserProfileTemplate = (watchedFilmsAmount) => {
  const profileRating = getUserRank(watchedFilmsAmount);

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfile extends SmartView {
  constructor(watchedFilmsAmount) {
    super();
    this._data = { watched: watchedFilmsAmount };
  }

  getTemplate() {
    return getUserProfileTemplate(this._data.watched);
  }

  restoreHandlers() { }
}

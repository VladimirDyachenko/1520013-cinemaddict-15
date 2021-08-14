import { getUserRank } from '../utils/utils.js';
import AbstractView from './abstract-view.js';

const getUserProfileTemplate = (watchedFilmsAmount) => {
  const profileRating = getUserRank(watchedFilmsAmount);

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfile extends AbstractView {
  constructor(watchedFilmsAmount) {
    super();
    this._watchedFilmsAmount = watchedFilmsAmount;
  }

  getTemplate() {
    return getUserProfileTemplate(this._watchedFilmsAmount);
  }
}

import { createElement, getUserRank } from '../utils/utils.js';

const getUserProfileTemplate = (watchedFilmsAmount) => {
  const profileRating = getUserRank(watchedFilmsAmount);

  return `<section class="header__profile profile">
    <p class="profile__rating">${profileRating}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfile {
  constructor(watchedFilmsAmount) {
    this._element = null;
    this._watchedFilmsAmount = watchedFilmsAmount;
  }

  getTemplate() {
    return getUserProfileTemplate(this._watchedFilmsAmount);
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

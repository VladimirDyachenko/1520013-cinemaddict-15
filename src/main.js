import { getSiteMenuTemplate } from './view/site-menu.js';
import { getFooterStatisticsTemplate } from './view/footer-statistic.js';
import { getStatisticsTemplate } from './view/statistic/statistic.js';
import { getUserProfileTemplate } from './view/user-profile.js';
import { getFilmsListTemplate } from './view/films/films-list.js';
import { getSortTemplate } from './view/films/sort.js';
import { getFilmCardTemplate } from './view/films/film-card.js';
import { getShowMoreButtonTemplate } from './view/films/show-more-button.js';
import { getFilmsListExtraTemplate } from './view/films/films-list-extra.js';
import { getFilmModalTemplate } from './view/films/film-modal.js';
import { getCommentTemplate } from './view/films/comment.js';
import { generateFilm } from './mock/film-card.js';

const InsertPosition = {
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
};

const getFilmsMock = (amount = 20) =>  new Array(amount).fill().map(() => generateFilm());

const films = getFilmsMock();

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderStatsPage = () => {
  render(headerElement, getUserProfileTemplate(), InsertPosition.BEFORE_END);
  render(mainElement, getSiteMenuTemplate(), InsertPosition.AFTER_BEGIN);
  render(mainElement, getStatisticsTemplate(), InsertPosition.BEFORE_END);
  render(footerElement, getFooterStatisticsTemplate(), InsertPosition.BEFORE_END);
};

const renderFilmModal = () => {
  //Details modal
  render(document.body, getFilmModalTemplate(), InsertPosition.BEFORE_END);
  const commentsListElement = document.querySelector('.film-details__comments-list');

  //Comments
  render(commentsListElement, getCommentTemplate(), InsertPosition.AFTER_BEGIN);
  render(commentsListElement, getCommentTemplate(), InsertPosition.AFTER_BEGIN);
  render(commentsListElement, getCommentTemplate(), InsertPosition.AFTER_BEGIN);
  render(commentsListElement, getCommentTemplate(), InsertPosition.AFTER_BEGIN);
};

const renderMainPage = () => {

  const makeRenderFilmsFunction = (containerElement) => {
    let lastIndex = 0;
    let limit = 5;

    return () => {
      for (lastIndex; lastIndex < limit; lastIndex++) {
        render(containerElement, getFilmCardTemplate(films[lastIndex]), InsertPosition.BEFORE_END);
      }
      limit = lastIndex + 5 < films.length ? lastIndex + 5 : films.length;
    };
  };

  //User profile
  render(headerElement, getUserProfileTemplate(), InsertPosition.BEFORE_END);

  //Site nav
  render(mainElement, getSiteMenuTemplate(), InsertPosition.AFTER_BEGIN);

  //Sort list
  render(mainElement, getSortTemplate(), InsertPosition.BEFORE_END);

  //Films container
  const filmsList = document.createElement('div');
  render(filmsList, getFilmsListTemplate(), InsertPosition.AFTER_BEGIN);

  const filmsContainerElement = filmsList.querySelector('.films');

  const filmsListContainerElement = filmsContainerElement.querySelector('.films-list__container');

  const addFiveFilms = makeRenderFilmsFunction(filmsListContainerElement);

  addFiveFilms();

  const filmsListElement = filmsContainerElement.querySelector('.films-list');
  render(filmsListElement, getShowMoreButtonTemplate(), InsertPosition.BEFORE_END);

  //Extra lists
  render(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);
  render(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);

  mainElement.appendChild(filmsContainerElement);

  //Footer statistics
  render(footerElement, getFooterStatisticsTemplate(), InsertPosition.BEFORE_END);

  renderFilmModal();
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

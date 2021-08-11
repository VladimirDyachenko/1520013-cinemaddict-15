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
import { generateFilm } from './mock/film-card.js';
import { getRandomPositiveInteger, InsertPosition, renderTemplate } from './utils/utils.js';

const getFilmsMock = (amount = 20) =>  new Array(amount).fill().map(() => generateFilm());

const films = getFilmsMock();

const getFilterData = (filmList) => {
  const watchList = [];
  const historyList = [];
  const favoriteList = [];

  filmList.forEach((film) => {
    if (film.watchlist) {
      watchList.push(film);
    }

    if (film.alreadyWatched) {
      historyList.push(film);
    }

    if (film.favorite) {
      favoriteList.push(film);
    }
  });

  return {
    watchList,
    historyList,
    favoriteList,
  };
};

const filterData = getFilterData(films);
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderStatsPage = () => {
  renderTemplate(headerElement, getUserProfileTemplate(), InsertPosition.BEFORE_END);
  renderTemplate(mainElement, getSiteMenuTemplate(filterData), InsertPosition.AFTER_BEGIN);
  renderTemplate(mainElement, getStatisticsTemplate(), InsertPosition.BEFORE_END);
  renderTemplate(footerElement, getFooterStatisticsTemplate(getRandomPositiveInteger(100000, 1500000)), InsertPosition.BEFORE_END);
};

const renderFilmModal = (filmData) => {
  //Details modal
  renderTemplate(document.body, getFilmModalTemplate(filmData), InsertPosition.BEFORE_END);
};

const renderMainPage = () => {

  const makeRenderFilmsFunction = (containerElement) => {
    let lastIndex = 0;
    let limit = 5;

    return () => {
      for (lastIndex; lastIndex < limit; lastIndex++) {
        renderTemplate(containerElement, getFilmCardTemplate(films[lastIndex]), InsertPosition.BEFORE_END);
      }
      limit = lastIndex + 5 < films.length ? lastIndex + 5 : films.length;

      return films.length - lastIndex;
    };
  };

  //User profile
  renderTemplate(headerElement, getUserProfileTemplate(), InsertPosition.BEFORE_END);

  //Site nav
  renderTemplate(mainElement, getSiteMenuTemplate(filterData), InsertPosition.AFTER_BEGIN);

  //Sort list
  renderTemplate(mainElement, getSortTemplate(), InsertPosition.BEFORE_END);

  //Films container
  const filmsList = document.createElement('div');
  renderTemplate(filmsList, getFilmsListTemplate(), InsertPosition.AFTER_BEGIN);

  const filmsContainerElement = filmsList.querySelector('.films');

  const filmsListContainerElement = filmsContainerElement.querySelector('.films-list__container');

  const addFiveFilms = makeRenderFilmsFunction(filmsListContainerElement);

  addFiveFilms();

  const filmsListElement = filmsContainerElement.querySelector('.films-list');
  renderTemplate(filmsListElement, getShowMoreButtonTemplate(), InsertPosition.BEFORE_END);

  const showMoreClickHandler = (event) => {
    const filmsLeft = addFiveFilms();

    if (filmsLeft === 0) {
      event.target.removeEventListener('click', showMoreClickHandler);
      event.target.style.display = 'none';
    }
  };

  const showMoreButton = filmsListElement.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', showMoreClickHandler);

  //Extra lists
  renderTemplate(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);
  renderTemplate(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);

  mainElement.appendChild(filmsContainerElement);

  //Footer statistics
  renderTemplate(footerElement, getFooterStatisticsTemplate(getRandomPositiveInteger(100000, 1500000)), InsertPosition.BEFORE_END);

  renderFilmModal(films[0]);
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

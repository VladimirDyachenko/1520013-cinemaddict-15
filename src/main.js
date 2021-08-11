import SiteMenuView from './view/site-menu.js';
import FooterStatisticView from './view/footer-statistic.js';
import StatisticView from './view/statistic/statistic.js';
import UserProfileView from './view/user-profile.js';
import FilmListView from './view/films/films-list.js';
import SortListView from './view/films/sort.js';
import FilmCardView from './view/films/film-card.js';
import ShowMoreButtonView from './view/films/show-more-button.js';
import FilmListExtraView from './view/films/films-list-extra.js';
import FilmModalView from './view/films/film-modal.js';
import { getTestData } from './mock/films.js';
import {
  getRandomPositiveInteger,
  InsertPosition,
  renderElement
} from './utils/utils.js';

const FILMS_PER_ROW = 5;

const [films, filterData] = getTestData();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const filmsCount = getRandomPositiveInteger(100000, 1500000);

const renderStatsPage = () => {
  renderElement(headerElement, new UserProfileView(filterData.historyList.length).getElement(), InsertPosition.BEFORE_END);
  renderElement(mainElement, new SiteMenuView(filterData).getElement(), InsertPosition.AFTER_BEGIN);
  renderElement(mainElement, new StatisticView(films).getElement(), InsertPosition.BEFORE_END);
  renderElement(footerElement, new FooterStatisticView(filmsCount).getElement(), InsertPosition.BEFORE_END);
};

const renderFilmModal = (filmData) => {
  //Details modal
  const filmModal = new FilmModalView(filmData);
  renderElement(document.body, filmModal.getElement(), InsertPosition.BEFORE_END);

  setTimeout(() => filmModal.removeElement(), 3000);
};

const renderMainPage = () => {

  const makeRenderFilmsFunction = (containerElement) => {
    let lastIndex = 0;
    let limit = FILMS_PER_ROW;

    return () => {
      for (lastIndex; lastIndex < limit; lastIndex++) {
        renderElement(containerElement, new FilmCardView((films[lastIndex])).getElement(), InsertPosition.BEFORE_END);
      }
      limit = lastIndex + FILMS_PER_ROW < films.length ? lastIndex + FILMS_PER_ROW : films.length;

      return films.length - lastIndex;
    };
  };

  //User profile
  renderElement(headerElement, new UserProfileView(filterData.watchList.length).getElement(), InsertPosition.BEFORE_END);

  //Site nav
  renderElement(mainElement, new SiteMenuView(filterData).getElement(), InsertPosition.AFTER_BEGIN);

  //Sort list
  renderElement(mainElement, new SortListView().getElement(), InsertPosition.BEFORE_END);

  //Films container
  const filmsList = new FilmListView();
  renderElement(mainElement, filmsList.getElement(), InsertPosition.BEFORE_END);

  const addFiveFilms = makeRenderFilmsFunction(filmsList.getFilmContainer());

  addFiveFilms();

  const showMoreButton = new ShowMoreButtonView().getElement();
  renderElement(filmsList.getFilmSection(), showMoreButton, InsertPosition.BEFORE_END);

  const showMoreClickHandler = (event) => {
    const filmsLeft = addFiveFilms();

    if (filmsLeft === 0) {
      event.target.removeEventListener('click', showMoreClickHandler);
      event.target.remove();
    }
  };

  showMoreButton.addEventListener('click', showMoreClickHandler);

  // Extra lists
  renderElement(filmsList.getElement(), new FilmListExtraView().getElement(), InsertPosition.BEFORE_END);
  renderElement(filmsList.getElement(), new FilmListExtraView().getElement(), InsertPosition.BEFORE_END);

  mainElement.appendChild(filmsList.getElement());

  //Footer statistics
  renderElement(footerElement, new FooterStatisticView(filmsCount).getElement(), InsertPosition.BEFORE_END);

  renderFilmModal(films[0]);
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

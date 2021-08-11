import SiteMenuView from './view/site-menu.js';
import FooterStatisticView from './view/footer-statistic.js';
import { getStatisticsTemplate } from './view/statistic/statistic.js';
import UserProfileView from './view/user-profile.js';
import { getFilmsListTemplate } from './view/films/films-list.js';
import SortListView from './view/films/sort.js';
import { getFilmCardTemplate } from './view/films/film-card.js';
import ShowMoreButtonView from './view/films/show-more-button.js';
import { getFilmsListExtraTemplate } from './view/films/films-list-extra.js';
import { getFilmModalTemplate } from './view/films/film-modal.js';
import { getTestData } from './mock/films.js';
import {
  getRandomPositiveInteger,
  InsertPosition,
  renderTemplate,
  renderElement
} from './utils/utils.js';

const [films, filterData] = getTestData();

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderStatsPage = () => {
  renderElement(headerElement, new UserProfileView(filterData.watchList.length).getElement(), InsertPosition.BEFORE_END);
  renderTemplate(mainElement, new SiteMenuView(filterData).getTemplate(), InsertPosition.AFTER_BEGIN);
  renderTemplate(mainElement, getStatisticsTemplate(), InsertPosition.BEFORE_END);
  renderElement(footerElement, new FooterStatisticView(getRandomPositiveInteger(100000, 1500000)).getElement(), InsertPosition.BEFORE_END);
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
  renderElement(headerElement, new UserProfileView(filterData.watchList.length).getElement(), InsertPosition.BEFORE_END);

  //Site nav
  renderElement(mainElement, new SiteMenuView(filterData).getElement(), InsertPosition.AFTER_BEGIN);

  //Sort list
  renderElement(mainElement, new SortListView().getElement(), InsertPosition.BEFORE_END);

  //Films container
  const filmsList = document.createElement('div');
  renderTemplate(filmsList, getFilmsListTemplate(), InsertPosition.AFTER_BEGIN);

  const filmsContainerElement = filmsList.querySelector('.films');

  const filmsListContainerElement = filmsContainerElement.querySelector('.films-list__container');

  const addFiveFilms = makeRenderFilmsFunction(filmsListContainerElement);

  addFiveFilms();

  const filmsListElement = filmsContainerElement.querySelector('.films-list');

  const showMoreButton = new ShowMoreButtonView().getElement();
  renderElement(filmsListElement, showMoreButton, InsertPosition.BEFORE_END);

  const showMoreClickHandler = (event) => {
    const filmsLeft = addFiveFilms();

    if (filmsLeft === 0) {
      event.target.removeEventListener('click', showMoreClickHandler);
      event.target.style.display = 'none';
    }
  };

  showMoreButton.addEventListener('click', showMoreClickHandler);

  //Extra lists
  renderTemplate(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);
  renderTemplate(filmsContainerElement, getFilmsListExtraTemplate(), InsertPosition.BEFORE_END);

  mainElement.appendChild(filmsContainerElement);

  //Footer statistics
  renderElement(footerElement, new FooterStatisticView(getRandomPositiveInteger(100000, 1500000)).getElement(), InsertPosition.BEFORE_END);

  renderFilmModal(films[0]);
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

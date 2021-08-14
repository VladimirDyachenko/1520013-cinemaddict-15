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

let filmModal;

const closeModal = (onEscKeyDownReference) => {
  document.removeEventListener('keydown', onEscKeyDownReference);
  filmModal.removeElement();
  filmModal = null;
};

const onEscKeyDown = (event) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    closeModal(onEscKeyDown);
  }
};

const onCloseClick = () => {
  closeModal(onEscKeyDown);
};

const openFilmModal = (filmData) => {
  //Details modal
  if (filmModal) {
    document.removeEventListener('keydown', onEscKeyDown);
    filmModal.removeElement();
    filmModal = null;
  }

  filmModal = new FilmModalView(filmData);
  renderElement(document.body, filmModal.getElement(), InsertPosition.BEFORE_END);

  document.addEventListener('keydown', onEscKeyDown);
  filmModal.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => onCloseClick());
};

const registerModalOpenListeners = (elements, filmData) => {
  [...elements].forEach((element) => {
    element.addEventListener('click', () => openFilmModal(filmData));
  });
};


const renderStatsPage = () => {
  renderElement(headerElement, new UserProfileView(filterData.historyList.length).getElement(), InsertPosition.BEFORE_END);
  renderElement(mainElement, new SiteMenuView(filterData).getElement(), InsertPosition.AFTER_BEGIN);
  renderElement(mainElement, new StatisticView(films).getElement(), InsertPosition.BEFORE_END);
  renderElement(footerElement, new FooterStatisticView(filmsCount).getElement(), InsertPosition.BEFORE_END);
};

const renderMainPage = () => {

  const makeRenderFilmsFunction = (containerElement) => {
    let lastIndex = 0;
    let limit = FILMS_PER_ROW;

    return () => {
      for (lastIndex; lastIndex < limit; lastIndex++) {
        const filmCard = new FilmCardView(films[lastIndex]);
        renderElement(containerElement, filmCard.getElement(), InsertPosition.BEFORE_END);

        const modalTriggers = filmCard.getElement().querySelectorAll('.film-card__title, .film-card__poster, .film-card__comments');

        registerModalOpenListeners(modalTriggers, filmCard.getFilmData());
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

  if (films.length > 0) {
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
  } else {
    filmsList.showEmptyMessage();
  }


  // Extra lists
  renderElement(filmsList.getElement(), new FilmListExtraView().getElement(), InsertPosition.BEFORE_END);
  renderElement(filmsList.getElement(), new FilmListExtraView().getElement(), InsertPosition.BEFORE_END);

  mainElement.appendChild(filmsList.getElement());

  //Footer statistics
  renderElement(footerElement, new FooterStatisticView(filmsCount).getElement(), InsertPosition.BEFORE_END);
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

import { getSiteMenuTemplate } from './view/site-menu.js';
import { getFooterStatisticsTemplate } from './view/footer-statistic.js';
import { getStatisticsTemplate } from './view/statistic/statistic.js';
import { getUserProfileTemplate } from './view/user-profile.js';
const InsertPosition = {
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
};

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

const renderMainPage = () => {
};

const setPage = (isStatPage = false) => isStatPage ? renderStatsPage() : renderMainPage();

setPage();

import AbstractView from '../view/abstract-view.js';

export const InsertPosition = {
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
};

export const renderElement = (container, element, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case InsertPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case InsertPosition.BEFORE_END:
      container.append(element);
      break;
    default:
      throw new Error(`Invalid position ${place}`);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const TOAST_SHOW_TIME = 5000;
const toastContainer = document.createElement('div');
toastContainer.classList.add('toast-container');
document.body.append(toastContainer);

export const toast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.textContent = message;
  toastItem.classList.add('toast-item');

  toastContainer.append(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, TOAST_SHOW_TIME);
};

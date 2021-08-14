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

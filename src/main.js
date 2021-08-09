const InsertPosition = {
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
};
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

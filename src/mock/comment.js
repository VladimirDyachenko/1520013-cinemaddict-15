import {
  getRandomPositiveFloat,
  getRandomPositiveInteger,
  getRandomArrayElement,
  getRandomDate
} from '../utils/utils.js';

const emotes = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const getText = () => `Моя оценка ${getRandomPositiveFloat(0, 10, 1)}`;

const getAuthor = () => `Username ${getRandomPositiveInteger(10, 100)}`;

export const generateComment = () => (
  {
    emote: getRandomArrayElement(emotes),
    date: getRandomDate(),
    author: getAuthor(),
    text: getText(),
  }
);

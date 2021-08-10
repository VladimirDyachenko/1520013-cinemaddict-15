import { generateComment } from './comment.js';
import {
  getRandomPositiveFloat,
  getRandomPositiveInteger,
  getRandomArrayElement,
  getRandomArray,
  getRandomDate
} from './../utils/utils.js';

const TitlePosterPairs = {
  'Made for each other': 'made-for-each-other.png',
  'Popeye meets sinbad': 'popeye-meets-sinbad.png',
  'Sagebrush trail': 'sagebrush-trail.jpg',
  'Santa claus conquers the martians': 'santa-claus-conquers-the-martians.jpg',
  'The dance of life': 'the-dance-of-life.jpg',
  'The great flamarion': 'the-great-flamarion.jpg',
  'The man with the golden arm': 'the-man-with-the-golden-arm.jpg',
};

const stars = [
  'Takeshi Kitano',
  'Hayao Miazaki',
  'Quentin Tarantino',
  'Leonardo DiCaprio',
  'Michael Caine',
  'Robert De Niro',
  'Al Pacino',
  'Gary Oldman',
  'Matt Damon',
  'Morgan Freeman ',
  'Takeshi Kitano',
  'Tom Hanks',
];

const genres = [
  'Action',
  'Animation',
  'Comedy',
  'Family',
  'Horror',
  'Carton',
  'Science fiction',
  'Suspense',
];

const countrys = [
  'USA',
  'France',
  'UK',
  'Germany',
  'Japan',
  'Korea',
  'Poland',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const ageRatings = ['6+', '12+', '14+', '18+'];


const getTitleAndPoster = () => {
  const keys = Object.keys(TitlePosterPairs);
  const randomKey = getRandomPositiveInteger(0, keys.length - 1);

  return [keys[randomKey], `images/posters/${TitlePosterPairs[keys[randomKey]]}`];
};

const getDescription = () => {
  const temp = getRandomArray(getRandomPositiveInteger(1, 5), descriptions);

  return temp.join(' ');
};

export const generateFilm = () => {
  const [title, poster] = getTitleAndPoster();
  const comments = new Array(getRandomPositiveInteger(0, 5)).fill().map(() => generateComment());
  const alreadyWatched = Boolean(getRandomPositiveInteger(0, 1));
  let watchingDate = null;

  alreadyWatched ? watchingDate = getRandomDate(-7, -12, -2) : null;

  return {
    title: title,
    alternativeTitle: `${title} alternative title`,
    totalRating: getRandomPositiveFloat(0, 10, 1),
    poster,
    ageRating: getRandomArrayElement(ageRatings),
    director: getRandomArrayElement(stars),
    writers: getRandomArray(getRandomPositiveInteger(1, 3), stars),
    actors: getRandomArray(getRandomPositiveInteger(1, 8), stars),
    release: {
      date: getRandomDate(-7, -12, -75),
      country: getRandomArrayElement(countrys),
    },
    runtime: getRandomPositiveInteger(20, 280),
    genre: getRandomArray(getRandomPositiveInteger(1, 3), genres),
    description: getDescription(),
    watchlist: Boolean(getRandomPositiveInteger(0, 1)),
    alreadyWatched: alreadyWatched,
    watchingDate,
    favorite: Boolean(getRandomPositiveInteger(0, 1)),
    comments,
  };
};

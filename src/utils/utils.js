import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { RankTrie, TimeDelta } from '../const.js';

export const getRuntimeString = (runtimeInMinutes) => {
  const hours = Math.floor(runtimeInMinutes / 60);
  const minutes = runtimeInMinutes % 60;

  return hours > 0 ?`${hours}h ${minutes}m` : `${minutes}m`;
};

export const getUserRank = (watchedFilmAmount) => {
  const tires = Object.entries(RankTrie);
  for(const tire of tires) {
    if (watchedFilmAmount <= tire[0]) {
      return tire[1];
    }
  }

  return tires[tires.length - 1][1];
};

export const isDateInTimeGap = (date, gap, unit) => {
  if (unit === TimeDelta.ALL_TIME) {
    return true;
  }

  const today = dayjs();
  let beforeDate;

  switch (unit) {
    case TimeDelta.TODAY:
      beforeDate = dayjs().add(-gap, 'day');
      break;
    case TimeDelta.WEEK:
      beforeDate = dayjs().add(-gap, 'week');
      break;
    case TimeDelta.MONTH:
      beforeDate = dayjs().add(-gap, 'month');
      break;
    case TimeDelta.YEAR:
      beforeDate = dayjs().add(-gap, 'year');
      break;
    default:
      throw new Error(`Unhandled unit: ${unit}`);
  }

  return dayjs(date).isBetween(beforeDate, today, null, '[]');
};

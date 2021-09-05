import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getUserRank, isDateInTimeGap } from '../../utils/utils.js';
import AbstractView from '../abstract-view.js';
import { TimeDelta } from '../../const.js';

const getStatisticsTemplate = ({ rank, totalWatched, totalDuration, topGenre }) => (
  `<section class="statistic">
  <p class="statistic__rank">
    Your rank
    <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    <span class="statistic__rank-label">${rank}</span>
  </p>

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${TimeDelta.ALL_TIME}" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${TimeDelta.TODAY}">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${TimeDelta.WEEK}">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${TimeDelta.MONTH}">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${TimeDelta.YEAR}">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${totalWatched} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">
        ${Math.floor(totalDuration / 60)}
        <span class="statistic__item-description">h</span>
        ${totalDuration % 60}
        <span class="statistic__item-description">m</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

  </section>`
);

const renderChart = (data) => {
  const labels = Object.keys(data);
  const watched = Object.values(data);

  const BAR_HEIGHT = 50;
  const statisticCtx = document.querySelector('.statistic__chart');
  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: watched,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export default class Statistic extends AbstractView {
  constructor(statisticData) {
    super();
    this._initialData = statisticData;
    this._data = {};
    this._sortHandler = this._sortHandler.bind(this);
    this._selectedTimeDelta = TimeDelta.ALL_TIME;
    this._setStatistic(this._initialData);
    this._chart = null;
    this._setSortHandler();
  }

  init() {
    this._chart = renderChart(this._data.watchedByGenre);
  }

  getTemplate() {
    return getStatisticsTemplate(this._data);
  }

  _setStatistic(data) {
    const genres = {};
    let totalWatched = 0;
    let totalDuration = 0;
    let topGenre = '';
    let totalWatchedAllTime = 0;

    data.forEach((film) => {
      if (film.alreadyWatched) {
        totalWatchedAllTime++;
      }

      if (
        film.alreadyWatched
        && isDateInTimeGap(film.watchingDate, 1, this._selectedTimeDelta)
      ) {
        totalWatched++;
        totalDuration += film.runtime;

        film.genre.forEach((genre) => {
          if (!genres[genre]) {
            genres[genre] = 1;
          } else {
            genres[genre] += 1;
          }
        });
      }
    });

    topGenre = Object.entries(genres).reduce((prev, current) => {
      if (current[1] > prev[1]) {
        return current;
      }
      return prev;
    }, ['', 0]);

    const watchedByGenre = Object.fromEntries(
      Object.entries(genres).sort(([, a], [, b]) => b - a),
    );

    this._data = {
      rank: getUserRank(totalWatchedAllTime),
      totalWatched,
      totalDuration,
      topGenre: topGenre[0],
      watchedByGenre,
    };
  }

  _sortHandler(event) {
    this._selectedTimeDelta = event.target.value;
    this._setStatistic(this._initialData);

    this._updateStatisticText();
    this._updateChart();
  }

  _updateChart() {
    if (this._chart) {
      this._chart.destroy();
    }

    this._chart = renderChart(this._data.watchedByGenre);
  }

  _updateStatisticText() {
    const listItemsTemplate = `<li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${this._data.totalWatched}
        <span class="statistic__item-description">movies</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">
        ${Math.floor(this._data.totalDuration / 60)}
        <span class="statistic__item-description">h</span>
        ${this._data.totalDuration % 60}
        <span class="statistic__item-description">m</span>
      </p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${this._data.topGenre}</p>
    </li>`;

    this.getElement().querySelector('.statistic__text-list').innerHTML = listItemsTemplate;
  }

  _setSortHandler() {
    [...this.getElement().querySelectorAll('.statistic__filters-input')]
      .forEach((element) => element.addEventListener('input', this._sortHandler));
  }
}

import he from 'he';
import dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTimePlugin);

const getCommentTemplate = (comment) => {
  const dateString = dayjs().to(dayjs(comment.date));

  return `<li class="film-details__comment" data-comment-id="${comment.id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emote}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment.text)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dateString}</span>
        <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
      </p>
    </div>
  </li>`;
};

export const getCommentsTemplate = (comments) => comments.map((comment) => getCommentTemplate(comment)).join('');

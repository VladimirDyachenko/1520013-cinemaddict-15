import dayjs from 'dayjs';

const getCommentTemplate = (comment) => {
  const dateString = dayjs(comment.date).format('YYYY/MM/DD h:mm').toString();

  return `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emote}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dateString}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
};

export const getCommentsTemplate = (comments) => comments.map((comment) => getCommentTemplate(comment)).join('');

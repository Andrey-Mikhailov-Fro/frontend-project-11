import onChange from 'on-change';
import validate from './validation';
import view from './view';

export default (texts) => {
  const state = {
    rssForm: {
      state: 'default',
      errors: '',
    },
    rssModalCard: {
      activeId: '',
    },
    uiState: {
      readPosts: [],
    },
    feeds: [],
    posts: [],
  };

  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');

  const [render, feeds, posts, readPosts] = view(texts);

  state.feeds = feeds;
  state.posts = posts;
  state.uiState.readPosts = readPosts;

  const watchedState = onChange(state, render);

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = input.value;
    const validationResult = validate(url);

    validationResult.then(() => {
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.errors = '';
      watchedState.rssForm.state = 'default';
    }).catch((error) => {
      watchedState.rssForm.state = 'invalid';
      [watchedState.rssForm.errors] = error.errors;
    }).then(() => {
      const findBtns = () => {
        const btns = document.querySelectorAll('[data-bs-toggle]');
        btns.forEach((button) => {
          button.addEventListener('click', () => {
            const currentId = button.dataset.id;
            watchedState.rssModalCard.activeId = currentId;
            const isNewReadPost = watchedState.uiState.readPosts
              .every((post) => post.id !== currentId);

            if (isNewReadPost) {
              watchedState.uiState.readPosts.push({ id: currentId });
            }
          });
        });

        setTimeout(findBtns, 5000);
      };

      setTimeout(findBtns, 1000);
    });
  });
};

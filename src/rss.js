import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId';
import validate from './validation';
import view from './view';
import parse from './parser';
import getFlow from './getFlow';

export default (texts) => {
  const state = {
    rssForm: {
      state: 'default',
      errors: '',
    },
    rssModalCard: {
      activePost: null,
    },
    uiState: {
      readPosts: new Set(),
    },
    feeds: [],
    posts: [],
  };

  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');

  const render = view(texts);

  const watchedState = onChange(state, render);

  const findBtns = () => {
    const btns = document.querySelectorAll('[data-bs-toggle]');

    btns.forEach((button) => {
      button.addEventListener('click', () => {
        const currentId = button.dataset.id;
        const readPost = state.posts.find((post) => post.id.toString() === currentId);
        const isNewReadPost = watchedState.uiState.readPosts.has(readPost);
        readPost.read = true;

        if (isNewReadPost) {
          watchedState.uiState.readPosts.add(readPost);
        }

        watchedState.rssModalCard.activePost = readPost;
      });
    });
  };

  const update = () => {
    const updateInterval = 5000;

    const completedChecks = state.feeds.map((feedForUpdate) => {
      const updatedFlow = getFlow(feedForUpdate.url);
      return updatedFlow.then((flowData) => {
        const refresh = parse(flowData.data.contents);

        refresh.posts.forEach((post) => {
          const id = uniqueId();
          const notLoaded = state.posts.every((loadedPost) => (loadedPost.head !== post.head)
        && (loadedPost.link !== post.link)
        && (loadedPost.description !== post.description));
          const preparedPost = { id, ...post };

          if (notLoaded) {
            watchedState.posts = [...state.posts, preparedPost];
          }
        });

        findBtns();
      });
    });

    Promise.all(completedChecks).then(() => setTimeout(update, updateInterval));
  };

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();

    watchedState.rssForm.state = 'loading';
    const url = input.value;
    const validationResult = validate(url, state.feeds);

    validationResult.then(() => {
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.errors = '';
      return getFlow(url);
    }).then((flow) => {
      const { feed, posts } = parse(flow.data.contents, url);
      watchedState.rssForm.state = 'success';

      feed.id = uniqueId();
      watchedState.feeds = [...state.feeds, feed];

      posts.forEach((post) => {
        const id = uniqueId();
        const notAlreadyLoaded = state.posts.every((loadedPost) => (loadedPost.head !== post.head)
          && (loadedPost.link !== post.link)
          && (loadedPost.description !== post.description));
        const preparedPost = { id, ...post };

        if (notAlreadyLoaded) {
          watchedState.posts = [...state.posts, preparedPost];
        }
      });

      findBtns();
    })
      .catch((error) => {
        watchedState.rssForm.state = 'invalid';

        if (Object.hasOwn(error, 'errors')) {
          watchedState.rssForm.state = 'invalid';
          [watchedState.rssForm.errors] = error.errors;
        } else {
          watchedState.rssForm.errors = error.message;
        }
      });
  });

  update();
};

import onChange from 'on-change';
import validate from './validation';
import view from './view';
import parse from './parser';
import getFlow from './getFlow';

const generateUniqID = (items) => {
  const exisitngIds = items.map((item) => item.id);
  const lastId = exisitngIds.length === 0 ? 1 : exisitngIds.at(-1);
  const newId = lastId + 1;
  exisitngIds.push(newId);
  return newId;
};

export default (texts) => {
  const state = {
    rssForm: {
      state: 'default',
      errors: '',
    },
    rssModalCard: {
      activePost: {},
    },
    uiState: {
      readPosts: [],
    },
    feeds: [],
    posts: [],
  };

  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');

  const render = view(texts);

  const watchedState = onChange(state, render);

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();

    watchedState.rssForm.state = 'loading';
    const url = input.value;
    const validationResult = validate(url, state.feeds);

    validationResult.then(() => {
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.errors = '';
    }).then(() => getFlow(url))
      .then((flow) => {
        const { feed, posts } = parse(flow.data.contents, url);
        watchedState.rssForm.state = 'success';

        feed.id = generateUniqID(state.feeds);
        watchedState.feeds = [...state.feeds, feed];

        posts.forEach((post) => {
          const id = generateUniqID(state.posts);
          const notAlreadyLoaded = state.posts.every((loadedPost) => (loadedPost.head !== post.head)
          && (loadedPost.link !== post.link)
          && (loadedPost.description !== post.description));
          const preparedPost = { id, ...post };

          if (notAlreadyLoaded) {
            watchedState.posts = [...state.posts, preparedPost];
          }
        });

        const findBtns = () => {
          const btns = document.querySelectorAll('[data-bs-toggle]');

          btns.forEach((button) => {
            button.addEventListener('click', () => {
              const currentId = button.dataset.id;
              const isNewReadPost = watchedState.uiState.readPosts
                .every((post) => post.id !== currentId);

              const readPost = state.posts.find((post) => post.id.toString() === currentId);

              readPost.read = true;

              if (isNewReadPost) {
                watchedState.uiState.readPosts = [...state.uiState.readPosts, readPost];
              }

              watchedState.rssModalCard.activePost = readPost;
            });
          });
        };

        const update = () => {
          state.feeds.forEach((feedForUpdate) => {
            const updatedFlow = getFlow(feedForUpdate.url);
            updatedFlow.then((flowData) => {
              const refresh = parse(flowData.data.contents);

              refresh.posts.forEach((post) => {
                const id = generateUniqID(state.posts);
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

            setTimeout(update, 5000);
          });
        };

        update();
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
};

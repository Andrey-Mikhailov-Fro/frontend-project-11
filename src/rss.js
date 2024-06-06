import onChange from 'on-change';
import validate from './validation';
import view from './view';
import parser from './parser';
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

    const url = input.value;
    const validationResult = validate(url);

    validationResult.then(() => {
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.errors = '';
    }).catch((error) => {
      watchedState.rssForm.state = 'invalid';
      [watchedState.rssForm.errors] = error.errors;
    }).then(() => getFlow(url))
      .then((flow) => {
        watchedState.rssForm.state = 'success';

        const { feed, posts } = parser(flow.data.contents);

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

              if (isNewReadPost) {
                watchedState.uiState.readPosts = [...state.uiState.readPosts, readPost];
              }

              watchedState.rssModalCard.activePost = readPost;
            });
          });
        };

        const update = () => {
          const updatedFlow = parser(flow.data.contents);
          updatedFlow.posts.forEach((post) => {
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

          setTimeout(update, 5000);
        };

        update();
      })
      .catch((parsingError) => {
        watchedState.rssForm.state = 'invalid';
        [watchedState.rssForm.errors] = parsingError.errors;
      });
  });
};

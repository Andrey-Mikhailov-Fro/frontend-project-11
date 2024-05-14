import onChange from 'on-change';
import validate from './validation';
import view from './view';

export default (texts) => {
  const state = {
    rssForm: {
      state: 'valid',
      errors: '',
    },
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
    });
  });
};

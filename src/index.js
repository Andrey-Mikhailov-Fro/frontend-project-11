import './styles.scss';
import 'bootstrap';
import onChange from 'on-change';
import validate from './validation';

const rss = () => {
  const state = {
    rssForm: {
      state: 'valid',
      errors: [],
    },
  };

  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const render = (path, value) => {
    if (path === 'rssForm.state') {
      if (value !== 'valid') {
        input.classList.add('is-invalid');
      } else {
        input.classList.remove('is-invalid');
      }
    }

    if (path === 'rssForm.errors') {
      const [errorText] = value;
      feedback.textContent = errorText;
    }
  };

  const watchedState = onChange(state, render);

  rssForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = input.value;
    const validationResult = validate(url);

    validationResult.then((valid) => {
      if (valid) {
        watchedState.rssForm.state = 'valid';
        watchedState.rssForm.errors = [];
        console.log('success!');
        console.log(validationResult);
      } else {
        watchedState.rssForm.state = 'invalid';
        watchedState.rssForm.errors = [];
        console.log('error!');
        console.log(validationResult);
      }
    });
  });
};

rss();

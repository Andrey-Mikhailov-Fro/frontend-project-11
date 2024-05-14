export default (texts) => {
  const head = document.querySelector('h1');
  const subHead = head.nextElementSibling;
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');
  const label = rssForm.querySelector('label');
  const submitBtn = rssForm.querySelector('button');
  const example = rssForm.nextElementSibling;
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
      feedback.textContent = texts.t(value);
    }
  };

  head.textContent = texts.t('rssForm.head');
  subHead.textContent = texts.t('rssForm.subHead');
  label.textContent = texts.t('rssForm.inputLabel');
  input.setAttribute('placeholder', texts.t('rssForm.inputLabel'));
  submitBtn.textContent = texts.t('rssForm.submitBtn');
  example.textContent = texts.t('rssForm.example');

  return render;
};

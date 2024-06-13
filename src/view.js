const formFeeds = (section, feedContainer) => {
  const list = section.querySelector('ul');

  const newList = document.createElement('ul');
  newList.classList.add('list-group', 'border-0', 'rounded-0');

  feedContainer.forEach((feed) => {
    const place = document.createElement('li');
    place.classList.add('list-group-item', 'border-0', 'border-end-0');

    const listItemHead = document.createElement('h3');
    listItemHead.classList.add('h6', 'm-0');
    listItemHead.textContent = feed.head;

    const listItemDescription = document.createElement('p');
    listItemDescription.classList.add('m-0', 'small', 'text-black-50');
    listItemDescription.textContent = feed.description;

    place.append(listItemHead, listItemDescription);
    newList.append(place);
  });

  list.replaceWith(newList);
};

const formPostList = (section, postContainer) => {
  const oldList = section.querySelector('ul');
  const newList = document.createElement('ul');
  newList.classList.add('list-group', 'border-0', 'rounded-0');

  postContainer.forEach((post) => {
    const place = document.createElement('li');
    place.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const font = post.read ? 'fw-normal' : 'fw-bold';

    const listItemName = document.createElement('a');
    listItemName.setAttribute('href', post.link);
    listItemName.classList.add(font);
    listItemName.setAttribute('data-id', post.id);
    listItemName.textContent = post.head;

    const viewBtn = document.createElement('button');
    viewBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    viewBtn.setAttribute('type', 'button');
    viewBtn.setAttribute('data-id', post.id);
    viewBtn.setAttribute('data-testid', post.id);
    viewBtn.setAttribute('data-bs-toggle', 'modal');
    viewBtn.setAttribute('data-bs-target', '#modal');
    viewBtn.textContent = 'Просмотр';

    place.append(listItemName, viewBtn);
    newList.append(place);
  });

  oldList.replaceWith(newList);
};

const createFeedPostsSections = (section) => {
  const headText = section.classList.contains('feeds') ? 'Фиды' : 'Посты';

  const card = document.createElement('div');
  const head = document.createElement('h2');
  const list = document.createElement('ul');
  card.classList.add('card-body');
  head.classList.add('card-title', 'h4');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  head.textContent = headText;
  card.replaceChildren(head, list);
  section.replaceChildren(card);
};

const prepareElements = () => {
  const head = document.querySelector('h1');
  const subHead = head.nextElementSibling;
  const rssForm = document.querySelector('.rss-form');
  const input = rssForm.querySelector('#url-input');
  const label = rssForm.querySelector('label');
  const submitBtn = rssForm.querySelector('button');
  const example = rssForm.nextElementSibling;
  const feedback = document.querySelector('.feedback');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');

  return [head, subHead, input, label, submitBtn, example, feedback, feeds, posts, rssForm];
};

export default (texts) => {
  const [head,
    subHead,
    input,
    label,
    submitBtn,
    example,
    feedback,
    feeds,
    posts,
    rssForm] = prepareElements();

  const render = (path, value) => {
    if (path === 'rssForm.state') {
      if (value === 'loading') {
        submitBtn.disabled = true;
      }

      if (value === 'invalid') {
        submitBtn.disabled = false;
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      } else if (value === 'valid') {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
      } else if (value === 'success') {
        submitBtn.disabled = false;
        feedback.classList.add('text-success');
        feedback.textContent = texts.t('rssForm.success');
        input.value = '';
        rssForm.focus();

        [feeds, posts].forEach(createFeedPostsSections);
      }
    }

    if (path === 'feeds') {
      formFeeds(feeds, value);
    }

    if (path === 'posts') {
      formPostList(posts, value);
    }

    if (path === 'rssForm.errors') {
      feedback.textContent = texts.t(value);
    }

    if (path === 'rssModalCard.activePost') {
      const modalCard = document.querySelector('#modal');
      const modalTitle = modalCard.querySelector('.modal-title');
      const modalBody = modalCard.querySelector('.modal-body');
      const readAllBtn = modalCard.querySelector('a');

      modalTitle.textContent = value.head;
      modalBody.textContent = value.description;
      readAllBtn.setAttribute('href', value.link);
    }

    if (path === 'uiState.readPosts') {
      const links = posts.querySelectorAll('a');
      links.forEach((link) => {
        const { id } = link.dataset;

        value.forEach((post) => {
          if (id === post.id.toString()) {
            link.classList.remove('fw-bold');
            link.classList.add('fw-normal');
          }
        });
      });
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

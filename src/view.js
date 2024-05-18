import './styles.scss';
import getFlow from './getFlow';
import parser from './parser';

const postIds = [];
const feedIds = [];

const feedContainer = [];
const postContainer = [];

const generateUniqID = (exisitngIds) => {
  const newId = Math.round(Math.random() * 1000);
  const resultId = exisitngIds.includes(newId) ? generateUniqID(exisitngIds) : newId;
  exisitngIds.push(resultId);
  return resultId;
};

const formFeeds = (element, section) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');

  const place = document.createElement('li');
  place.classList.add('list-group-item', 'border-0', 'border-end-0');

  const listItemHead = document.createElement('h3');
  listItemHead.classList.add('h6', 'm-0');
  listItemHead.textContent = title.textContent;

  const listItemDescription = document.createElement('p');
  listItemDescription.classList.add('m-0', 'small', 'text-black-50');
  listItemDescription.textContent = description.textContent;

  place.replaceChildren(listItemHead, listItemDescription);
  section.append(place);

  const id = generateUniqID(feedIds);
  const thisFeed = {
    id,
    head: title.textContent,
    description: description.textContent,
  };
  feedContainer.push(thisFeed);

  return id;
};

const formPost = (element, section, feedId) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');
  const link = element.querySelector('link');

  const place = document.createElement('li');
  place.classList.add('list-group-item', 'border-0', 'border-end-0');

  const id = generateUniqID(postIds);

  const listItemName = document.createElement('a');
  listItemName.setAttribute('href', link.textContent);
  listItemName.classList.add('fw-bold');
  listItemName.setAttribute('data-id', id);
  listItemName.textContent = title.textContent;

  const viewBtn = document.createElement('button');
  viewBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  viewBtn.setAttribute('type', 'button');
  viewBtn.setAttribute('data-id', id);
  viewBtn.setAttribute('data-bs-toggle', 'modal');
  viewBtn.setAttribute('data-bs-target', '#modal');
  viewBtn.textContent = 'Просмотр';

  place.replaceChildren(listItemName, viewBtn);
  section.append(place);

  const thisPost = {
    id,
    feedId,
    head: title.textContent,
    description: description.textContent,
    link: link.textContent,
  };

  postContainer.push(thisPost);
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
  section.append(card);
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
      if (value !== 'valid') {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      } else {
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger');
        feedback.classList.add('text-success');
        feedback.textContent = texts.t('rssForm.success');
        const url = new URL(input.value);
        const feed = getFlow(url);
        feed.then((data) => {
          const parsedData = parser(data.data.contents);

          [feeds, posts].forEach(createFeedPostsSections);

          const thisFeedId = formFeeds(parsedData, feeds);
          const postItems = parsedData.querySelectorAll('item');
          postItems.forEach((post) => formPost(post, posts, thisFeedId));
        });

        input.value = '';
        rssForm.focus();
      }
    }

    if (path === 'rssForm.errors') {
      feedback.textContent = texts.t(value);
    }

    if (path === 'rssModalCard.activeId') {
      const modalCard = document.querySelector('#modal');
      const modalTitle = modalCard.querySelector('.modal-title');
      const modalBody = modalCard.querySelector('.modal-body');
      const readAllBtn = modalCard.querySelector('a');

      const [currentPost] = postContainer.filter((post) => post.id.toString() === value);

      modalTitle.textContent = currentPost.head;
      modalBody.textContent = currentPost.description;
      readAllBtn.setAttribute('href', currentPost.link);
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
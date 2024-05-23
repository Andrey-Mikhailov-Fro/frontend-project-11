import './styles.scss';
import getFlow from './getFlow';
import parser from './parser';

const postIds = [];
const feedIds = [];

const feedContainer = [];
const postContainer = [];
const readPosts = [];

const generateUniqID = (exisitngIds) => {
  const lastId = exisitngIds.length === 0 ? 1 : exisitngIds.at(-1);
  const newId = lastId + 1;
  exisitngIds.push(newId);
  return newId;
};

const formFeeds = (element, section) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');

  const id = generateUniqID(feedIds);
  const thisFeed = {
    id,
    head: title.textContent,
    description: description.textContent,
  };

  feedContainer.push(thisFeed);

  const list = section.querySelector('ul');

  feedContainer.forEach((feed) => {
    const place = document.createElement('li');
    place.classList.add('list-group-item', 'border-0', 'border-end-0');

    const listItemHead = document.createElement('h3');
    listItemHead.classList.add('h6', 'm-0');
    listItemHead.textContent = feed.head;

    const listItemDescription = document.createElement('p');
    listItemDescription.classList.add('m-0', 'small', 'text-black-50');
    listItemDescription.textContent = feed.description;

    place.replaceChildren(listItemHead, listItemDescription);
    list.append(place);
  });

  return id;
};

const addPost = (element, feedId) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');
  const link = element.querySelector('link');

  const notAlreadyLoaded = postContainer.every((post) => (title.textContent !== post.head)
  && (link.textContent !== post.link)
  && (description.textContent !== post.description));

  if (!notAlreadyLoaded) {
    return;
  }

  const id = generateUniqID(postIds);

  const thisPost = {
    id,
    feedId,
    head: title.textContent,
    description: description.textContent,
    link: link.textContent,
  };

  postContainer.push(thisPost);
};

const formPostList = (section) => {
  const oldList = section.querySelector('ul');
  const newList = document.createElement('ul');

  postContainer.forEach((post) => {
    const place = document.createElement('li');
    place.classList.add('list-group-item', 'border-0', 'border-end-0');

    const notRead = readPosts.every((link) => link.id !== post.id.toString());
    const font = notRead ? 'fw-bold' : 'fw-normal';

    const listItemName = document.createElement('a');
    listItemName.setAttribute('href', post.link);
    listItemName.classList.add(font);
    listItemName.setAttribute('data-id', post.id);
    listItemName.setAttribute('data-testid', post.id);
    listItemName.textContent = post.head;

    const viewBtn = document.createElement('button');
    viewBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    viewBtn.setAttribute('type', 'button');
    viewBtn.setAttribute('data-id', post.id);
    viewBtn.setAttribute('data-bs-toggle', 'modal');
    viewBtn.setAttribute('data-bs-target', '#modal');
    viewBtn.textContent = 'Просмотр';

    place.replaceChildren(listItemName, viewBtn);
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
      if (value === 'invalid') {
        input.classList.add('is-invalid');
        feedback.classList.add('text-danger');
      } else if (value === 'valid') {
        input.classList.remove('is-invalid');

        const url = new URL(input.value);
        const flow = getFlow(url);

        let currentId;

        flow.then((data) => {
          const parsedData = parser(data.data.contents);

          [feeds, posts].forEach(createFeedPostsSections);

          const thisFeedId = formFeeds(parsedData, feeds);
          const postItems = parsedData.querySelectorAll('item');
          postItems.forEach((post) => addPost(post, thisFeedId));

          feedback.classList.remove('text-danger');
          feedback.classList.add('text-success');
          feedback.textContent = texts.t('rssForm.success');

          formPostList(posts);

          currentId = thisFeedId;
        }).then(() => {
          input.value = '';
          rssForm.focus();

          const updatePosts = (feedId) => {
            const refresh = getFlow(url);
            refresh.then((data) => {
              const parsedData = parser(data.data.contents);
              const postItems = parsedData.querySelectorAll('item');
              postItems.forEach((post) => addPost(post, feedId));
            });

            formPostList(posts);

            setTimeout(updatePosts, 5000, currentId);
          };

          setTimeout(updatePosts, 5000, currentId);
        }).catch((error) => {
          feedback.textContent = texts.t(error.message);
          input.classList.add('is-invalid');
          feedback.classList.add('text-danger');
        });
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

    if (path === 'uiState.readPosts') {
      const links = posts.querySelectorAll('a');
      links.forEach((link) => {
        const { id } = link.dataset;

        value.forEach((post) => {
          if (id === post.id) {
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

  return [render, feedContainer, postContainer, readPosts];
};

const addFeed = (element, url) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');
  const altProtocol = url.protocol === 'http:' ? 'https:' : 'http:';
  const href = url.toString();
  const altUrl = new URL(href);
  altUrl.protocol = altProtocol;

  const thisFeed = {
    head: title.textContent,
    description: description.textContent,
    url,
    altUrl,
  };

  return thisFeed;
};

const addPost = (element) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');
  const link = element.querySelector('link');

  const thisPost = {
    head: title.textContent,
    description: description.textContent,
    link: link.textContent,
    read: false,
  };

  return thisPost;
};

export default (html, url) => {
  const parser = new DOMParser();
  const parsedPage = parser.parseFromString(html, 'text/xml');
  const parsingError = parsedPage.querySelector('parsererror');

  if (parsingError) {
    // eslint-disable-next-line no-unused-vars
    const errorDescription = parsingError.querySelector('div').textContent;
    throw new Error('rssForm.errors.empty');
  } else {
    const feed = addFeed(parsedPage, url);
    const prePosts = parsedPage.querySelectorAll('item');
    const posts = Array.from(prePosts).map((prePost) => addPost(prePost));

    return {
      feed,
      posts,
    };
  }
};

const addFeed = (element) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');

  const thisFeed = {
    head: title.textContent,
    description: description.textContent,
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

export default (html) => {
  const parser = new DOMParser();
  const parsedPage = parser.parseFromString(html, 'text/xml');
  const parsingError = parsedPage.querySelector('parsererror');

  if (parsingError) {
    throw new Error('rssForm.errors.empty');
  } else {
    const testRss = parsedPage.querySelector('description');

    if (testRss === null) {
      throw new Error();
    } else {
      const feed = addFeed(parsedPage);

      const prePosts = parsedPage.querySelectorAll('item');
      const posts = Array.from(prePosts).map((prePost) => addPost(prePost));

      return {
        feed,
        posts,
      };
    }
  }
};

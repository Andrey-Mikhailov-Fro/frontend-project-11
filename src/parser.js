const addFeed = (element, url) => {
  const title = element.querySelector('title');
  const description = element.querySelector('description');

  const thisFeed = {
    head: title.textContent,
    description: description.textContent,
    url,
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
    /* const errorDescription = parsingError.querySelector('div').textContent;
    но что с ней делать, я, честно говоря, не понимаю. В ТЗ ни слова об этом. */
    throw new Error('rssForm.errors.empty');
  } else {
    const testRss = parsedPage.querySelector('description');

    if (testRss === null) {
      throw new Error();
    } else {
      const feed = addFeed(parsedPage, url);

      const prePosts = parsedPage.querySelectorAll('item');
      const posts = Array.from(prePosts).map((prePost) => addPost(prePost));

      return {
        feed,
        posts,
      };
    }
  }
};

export default (html) => {
  const parser = new DOMParser();
  const parsedPage = parser.parseFromString(html, 'text/xml');
  const testRss = parsedPage.querySelector('description');

  if (testRss !== null) {
    return parsedPage;
  }
  throw new Error('rssForm.errors.empty');
};

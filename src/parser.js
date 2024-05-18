export default (html) => {
  const parser = new DOMParser();
  const parsedPage = parser.parseFromString(html, 'text/xml');
  return parsedPage;
};

import axios from 'axios';

const proxyingUrl = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get');
  newUrl.searchParams.set('disableCache', true);
  newUrl.searchParams.set('url', url);
  return newUrl.toString();
};

export default (url) => {
  const allOriginsUrl = proxyingUrl(url);
  return axios.get(allOriginsUrl).catch(() => {
    throw new Error('rssForm.errors.network');
  });
};

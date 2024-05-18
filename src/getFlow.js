import axios from 'axios';

export default (url) => {
  const allOriginsUrl = new URL(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
  return axios.get(allOriginsUrl);
};

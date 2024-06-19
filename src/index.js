import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import i18next from 'i18next';
import ru from './locales/ru';
import rss from './rss';

const getLocaleInstance = () => {
  const textsInstance = i18next.createInstance();

  textsInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => rss(textsInstance));
};

getLocaleInstance();

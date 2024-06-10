import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import i18next from 'i18next';
import ru from './locales';
import rss from './rss';

const texts = i18next.createInstance();

texts.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
});

rss(texts);

import { string, setLocale } from 'yup';

const loaded = [];

const validate = (rssUrl) => {
  setLocale({
    mixed: {
      notOneOf: 'rssForm.errors.alreadyExist',
    },
    string: {
      required: 'rssForm.errors.required',
      url: 'rssForm.errors.url',
    },
  });

  const schema = string().required().notOneOf(loaded).url();

  return schema.validate(rssUrl).then(() => {
    if (!loaded.includes(rssUrl)) {
      loaded.push(rssUrl);
    }
  });
};

export default validate;

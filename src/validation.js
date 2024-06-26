import { string, setLocale } from 'yup';

const validate = (rssUrl, loadedFeeds) => {
  setLocale({
    mixed: {
      notOneOf: 'rssForm.errors.alreadyExist',
    },
    string: {
      required: 'rssForm.errors.required',
      url: 'rssForm.errors.url',
    },
  });

  const loaded = loadedFeeds.flatMap((feed) => [feed.url.toString(), feed.altUrl.toString()]);

  const schema = string().required().notOneOf(loaded).url();

  return schema.validate(rssUrl.toString()).then(() => {
    if (!loaded.includes(rssUrl)) {
      loaded.push(rssUrl);
    }
  });
};

export default validate;

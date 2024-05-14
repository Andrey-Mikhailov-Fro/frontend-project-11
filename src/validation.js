import { string, setLocale } from 'yup';

const validate = (rssUrl) => {
  setLocale({
    string: {
      required: 'rssForm.errors.required',
      url: 'rssForm.errors.url',
    },
  });

  const schema = string().required().url();
  return schema.validate(rssUrl);
};

export default validate;

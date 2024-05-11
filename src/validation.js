import { string } from 'yup';

const validate = (rssUrl) => {
  const schema = string().required().url();
  return schema.isValid(rssUrl);
};

export default validate;

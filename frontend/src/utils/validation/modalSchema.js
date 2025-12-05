import * as Yup from 'yup';
import i18n from '../../app/i18n.js';

const modalSchema = (existingNames, currentName = '') => {
  const { t } = i18n;
  return Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t('validation.modal.required'))
      .min(3, t('validation.modal.tooShort'))
      .max(20, t('validation.modal.tooLong'))
      .notOneOf(
        existingNames.filter((name) => name !== currentName),
        t('validation.modal.channelExists'),
      ),
  });
};

export default modalSchema;

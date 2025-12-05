import * as Yup from 'yup';
import i18n from '../../app/i18n.js';

const signupSchema = () => {
  const { t } = i18n;
  return Yup.object({
    name: Yup.string()
      .min(3, t('validation.auth.tooLong'))
      .max(20, t('validation.auth.tooLong'))
      .required(t('validation.auth.required'))
      .label(t('auth.formField.name')),

    password: Yup.string()
      .min(6, t('validation.auth.tooShort'))
      .required(t('validation.auth.required'))
      .label(t('auth.formField.password')),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('validation.auth.passwordsMustMatch'))
      .required(t('validation.auth.required'))
      .label(t('auth.formField.confirmPassword')),
  });
};

export default signupSchema;

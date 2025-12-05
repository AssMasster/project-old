import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import StyledWrapper from '../../../styles/authFormStyles.js';
import { ROUTES } from '../../routes.jsx';

const AuthForm = ({
  t,
  title,
  fields,
  initialValues,
  onSubmit,
  redirectPrompt,
  switchLink,
  redirectName,
  schema,
  buttonName,
}) => {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <div className="login-box">
        <p>{title}</p>
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          validateOnBlur={false}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
              await onSubmit(values);
              navigate(ROUTES.ROOT);
            } catch (error) {
              const status = error?.response?.status;
              let userMessage;
              switch (status) {
                case 401:
                  userMessage = t('auth.errors.loginFailed');
                  break;
                case 409:
                  userMessage = t('auth.errors.userExists');
                  break;
                default:
                  userMessage = t('auth.errors.network');
                  break;
              }
              setErrors({ name: userMessage });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, isSubmitting }) => (
            <Form noValidate>
              {fields.map(({ name, label, type = 'text' }) => (
                <div className="user-box" key={name}>
                  <Field
                    id={name}
                    name={name}
                    type={type}
                    required
                    className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage
                    name={name}
                    component="div"
                    className="invalid-feedback"
                  />
                  <label htmlFor={name}>{label}</label>
                </div>
              ))}

              <button type="submit" className="btn" disabled={isSubmitting}>
                <span />
                <span />
                <span />
                <span />
                {buttonName}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-redirect">
          {redirectPrompt}
          <Link to={switchLink} className="my-link">
            {redirectName}
          </Link>
        </p>
      </div>
    </StyledWrapper>
  );
};

export default AuthForm;

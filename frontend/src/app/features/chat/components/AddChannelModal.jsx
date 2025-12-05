import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import FocusLock from 'react-focus-lock';
import modalSchema from '../../../../utils/validation/modalSchema.js';
import { selectAllChannels } from '../channelSlice.js';
import { addChannel } from '../../../../services/api/channelsApi.js';
import { closeModal } from '../../ui/modalSlice.js';
import useToast from '../../../../hooks/useToast.js';

const AddChannelModal = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();
  const channelNames = useSelector(selectAllChannels).map((c) => c.name);

  const handleClose = () => dispatch(closeModal());

  const handleSubmit = async ({ name }, helpers) => {
    try {
      await dispatch(addChannel({ name })).unwrap();
      showSuccess('modal.add.toastSuccess');
      handleClose();
    } catch (err) {
      showError(err);
      helpers.setErrors({ name: err.message || t('modal.form.netError') });
      helpers.setSubmitting(false);
    }
  };

  return (
    <Modal show onHide={handleClose} data-bs-theme="dark">
      <FocusLock returnFocus>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={modalSchema(channelNames)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{t('modal.add.title')}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <label className="sr-only" htmlFor="channel-name">
                  {t('modal.add.labelText')}
                </label>

                <Field name="name">
                  {({ field }) => (
                    <FormControl
                      {...field}
                      id="channel-name"
                      type="text"
                      placeholder={t('modal.add.placeholder')}
                      data-autofocus
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-danger"
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t('modal.add.buttonCancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {t('modal.add.buttonConfirm')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </FocusLock>
    </Modal>
  );
};

export default AddChannelModal;

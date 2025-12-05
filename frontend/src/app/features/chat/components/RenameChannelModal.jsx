import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, FormControl } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import FocusLock from 'react-focus-lock';
import modalSchema from '../../../../utils/validation/modalSchema.js';
import { selectAllChannels } from '../channelSlice.js';
import { renameChannel } from '../../../../services/api/channelsApi.js';
import { closeModal } from '../../ui/modalSlice.js';
import useToast from '../../../../hooks/useToast.js';

const RenameChannelModal = ({ channelId }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useToast();
  const dispatch = useDispatch();

  const channels = useSelector(selectAllChannels);
  const current = channels.find((c) => c.id === channelId);
  const channelNames = channels.map((c) => c.name);

  const handleClose = () => dispatch(closeModal());

  const handleSubmit = async ({ name }, helpers) => {
    try {
      await dispatch(renameChannel({ id: channelId, name })).unwrap();
      showSuccess('modal.rename.toastSuccess');
      helpers.setSubmitting(false);
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
          initialValues={{ name: current?.name ?? '' }}
          validationSchema={modalSchema(channelNames)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{t('modal.rename.title')}</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <label className="sr-only" htmlFor="channel-name">
                  {t('modal.rename.labelText')}
                </label>

                <Field name="name">
                  {({ field }) => (
                    <FormControl
                      {...field}
                      id="channel-name"
                      type="text"
                      placeholder={t('modal.rename.placeholder')}
                      data-autofocus
                      onFocus={(e) => e.target.select()}
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
                  {t('modal.rename.buttonCancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {t('modal.rename.buttonConfirm')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </FocusLock>
    </Modal>
  );
};

export default RenameChannelModal;

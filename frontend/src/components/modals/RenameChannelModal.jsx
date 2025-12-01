import React, { useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

const RenameChannelModal = ({ show, onHide, channelId, onSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items: channels, loading } = useSelector(state => state.channels);
  const channel = useSelector(state => 
    state.channels.items.find(ch => ch.id === channelId)
  );
  const inputRef = useRef(null);

  const channelSchema = yup.object().shape({
    name: yup
      .string()
      .min(3, t('channels.channelNameLength'))
      .max(20, t('channels.channelNameLength'))
      .required(t('common.required')),
  });

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!channelId) return;
    
    try {
      await onSubmit(values.name);
      resetForm();
    } catch (error) {
      console.error('Error renaming channel:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
      </Modal.Header>
      
      <Formik
        initialValues={{ name: channel.name }}
        validationSchema={channelSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Field 
                  innerref={inputRef}
                  name="name"
                  as={Form.Control}
                  type="text"
                  placeholder={t('channels.enterChannelName')}
                  disabled={isSubmitting}
                  isInvalid={channels.some(ch => 
                    ch.id !== channelId && 
                    ch.name.toLowerCase() === values.name.toLowerCase()
                  )}
                />
                <ErrorMessage name="name" component={Form.Text} className="text-danger" />
                {channels.some(ch => 
                  ch.id !== channelId && 
                  ch.name.toLowerCase() === values.name.toLowerCase()
                ) && (
                  <Form.Text className="text-danger">
                    {t('channels.channelExists')}
                  </Form.Text>
                )}
              </Form.Group>
            </Modal.Body>
            
            <Modal.Footer>
              <Button 
                variant="secondary" 
                onClick={onHide}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting || 
                  channels.some(ch => 
                    ch.id !== channelId && 
                    ch.name.toLowerCase() === values.name.toLowerCase()
                  )
                }
              >
                {isSubmitting ? t('common.sending') : t('common.save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
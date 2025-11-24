import React, { useEffect, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { renameChannel } from '../../store/slices/channelsSlice';
import * as yup from 'yup';

const channelSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Название должно быть от 3 до 20 символов')
    .max(20, 'Название должно быть от 3 до 20 символов')
    .required('Обязательное поле'),
});

const RenameChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch();
  const { items: channels, loading } = useSelector(state => state.channels);
  const channel = useSelector(state => 
    state.channels.items.find(ch => ch.id === channelId)
  );
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [show]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!channelId) return;
    
    try {
      await dispatch(renameChannel({ 
        channelId, 
        newName: values.name 
      })).unwrap();
      resetForm();
      onHide();
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
        <Modal.Title>Переименовать канал</Modal.Title>
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
                  innerRef={inputRef}
                  name="name"
                  as={Form.Control}
                  type="text"
                  placeholder="Введите новое название канала"
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
                    Канал с таким именем уже существует
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
                Отменить
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
                {isSubmitting ? 'Переименование...' : 'Переименовать'}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default RenameChannelModal;
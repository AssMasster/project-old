import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { removeChannel } from '../../store/slices/channelsSlice';

const RemoveChannelModal = ({ show, onHide, channelId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.channels);
  const channel = useSelector(state => 
    state.channels.items.find(ch => ch.id === channelId)
  );

  const handleRemove = async () => {
    if (!channelId || channel?.removable === false) return;
    
    try {
      await dispatch(removeChannel(channelId)).unwrap();
      onHide();
    } catch (error) {
      console.error('Error removing channel:', error);
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>Уверены, что хотите удалить канал <strong>#{channel.name}</strong>?</p>
        <p className="text-muted">Все сообщения в этом канале будут удалены.</p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Отменить
        </Button>
        <Button 
          variant="danger" 
          onClick={handleRemove}
          disabled={loading || channel.removable === false}
        >
          {loading ? 'Удаление...' : 'Удалить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
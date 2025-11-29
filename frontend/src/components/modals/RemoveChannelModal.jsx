import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const RemoveChannelModal = ({ show, onHide, channelId, onSubmit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.channels);
  const channel = useSelector(state => 
    state.channels.items.find(ch => ch.id === channelId)
  );

  const handleRemove = async () => {
    if (!channelId || channel?.removable === false) return;
    
    try {
      await onSubmit();
    } catch (error) {
      console.error('Error removing channel:', error);
    }
  };

  if (!channel) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('channels.removeChannel')}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <p>
          {t('channels.removeConfirm')} <strong>#{channel.name}</strong>?
        </p>
        <p className="text-muted">
          {t('channels.removeWarning')}
        </p>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {t('common.cancel')}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleRemove}
          disabled={loading || channel.removable === false}
        >
          {loading ? t('common.sending') : t('common.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannelModal;
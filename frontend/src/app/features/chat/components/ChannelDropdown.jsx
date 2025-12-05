import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { openModal } from '../../ui/modalSlice.js';

const ChannelDropdown = ({ channelId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  const handleToggle = useCallback((nextShow) => setShow(nextShow), []);
  const closeDropdown = useCallback(() => setShow(false), []);

  const openRemove = () => {
    closeDropdown();
    dispatch(openModal({ type: 'removeChannel', props: { channelId } }));
  };

  const openRename = () => {
    closeDropdown();
    dispatch(openModal({ type: 'renameChannel', props: { channelId } }));
  };

  return (
    <Dropdown
      as={ButtonGroup}
      className="dropdown"
      show={show}
      onToggle={handleToggle}
    >
      <Dropdown.Toggle split variant="success">
        <span className="sr-only">{t('sidebar.channelActions')}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as="button" onClick={openRemove}>
          {t('modal.remove.menuItem')}
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={openRename}>
          {t('modal.rename.menuItem')}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelDropdown;

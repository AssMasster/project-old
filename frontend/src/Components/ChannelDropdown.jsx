import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChannelDropdown = ({ channelId, onRename, onRemove, children }) => {
  const [show, setShow] = useState(false);
  const channel = useSelector(state => 
    state.channels.items.find(ch => ch.id === channelId)
  );

  const handleToggle = (isOpen) => {
    setShow(isOpen);
  };

  const handleRename = () => {
    onRename(channelId);
    setShow(false);
  };

  const handleRemove = () => {
    onRemove(channelId);
    setShow(false);
  };

  if (!channel) return children;

  return (
    <Dropdown show={show} onToggle={handleToggle}>
      <Dropdown.Toggle as="div" className="channel-toggle">
        {children}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRename}>
          Переименовать
        </Dropdown.Item>
        {channel.removable !== false && (
          <Dropdown.Item onClick={handleRemove} className="text-danger">
            Удалить
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChannelDropdown;
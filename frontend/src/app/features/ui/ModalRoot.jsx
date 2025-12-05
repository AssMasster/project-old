import React from 'react';
import { useSelector } from 'react-redux';
import RenameChannelModal from '../chat/components/RenameChannelModal.jsx';
import AddChannelModal from '../chat/components/AddChannelModal.jsx';
import RemoveChannelModal from '../chat/components/RemoveChannelModal.jsx';

const MODAL_MAP = {
  removeChannel: RemoveChannelModal,
  renameChannel: RenameChannelModal,
  addChannel: AddChannelModal,
};

const ModalRoot = () => {
  const { isOpen, type, props } = useSelector((s) => s.modal);

  if (!isOpen) return null;
  const SpecificModal = MODAL_MAP[type];
  if (!SpecificModal) return null;

  return <SpecificModal {...props} />;
};

export default ModalRoot;

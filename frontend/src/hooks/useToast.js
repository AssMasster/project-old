import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useToast = () => {
  const { t } = useTranslation();

  const showSuccess = useCallback((message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
    });
  }, []);

  const showError = useCallback((message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
    });
  }, []);

  const showNetworkError = useCallback(() => {
    showError(t('notifications.networkError'));
  }, [showError, t]);

  const showLoadDataError = useCallback(() => {
    showError(t('notifications.loadDataError'));
  }, [showError, t]);

  const showChannelAdded = useCallback(() => {
    showSuccess(t('notifications.channelAdded'));
  }, [showSuccess, t]);

  const showChannelRenamed = useCallback(() => {
    showSuccess(t('notifications.channelRenamed'));
  }, [showSuccess, t]);

  const showChannelRemoved = useCallback(() => {
    showSuccess(t('notifications.channelRemoved'));
  }, [showSuccess, t]);

  const showMessageSent = useCallback(() => {
    showSuccess(t('notifications.messageSent'));
  }, [showSuccess, t]);

  const showAuthError = useCallback(() => {
    showError(t('notifications.authError'));
  }, [showError, t]);

  const showUnknownError = useCallback(() => {
    showError(t('notifications.unknownError'));
  }, [showError, t]);

  return {
    showSuccess,
    showError,
    showNetworkError,
    showLoadDataError,
    showChannelAdded,
    showChannelRenamed,
    showChannelRemoved,
    showMessageSent,
    showAuthError,
    showUnknownError,
  };
};
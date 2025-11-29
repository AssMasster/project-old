// frontend/src/hooks/useToast.js
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

  const showWarning = useCallback((message) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 4000,
    });
  }, []);

  const showNetworkError = useCallback(() => {
    showError(t('notifications.networkError'));
  }, [showError, t]);

  const showLoadDataError = useCallback(() => {
    showError(t('notifications.loadDataError'));
  }, [showError, t]);

  const showChannelAdded = useCallback((hadProfanity = false) => {
    let message = t('notifications.channelAdded');
    if (hadProfanity) {
      message += ` (${t('validation.profanityWarning')})`;
    }
    showSuccess(message);
  }, [showSuccess, t]);

  const showChannelRenamed = useCallback((hadProfanity = false) => {
    let message = t('notifications.channelRenamed');
    if (hadProfanity) {
      message += ` (${t('validation.profanityWarning')})`;
    }
    showSuccess(message);
  }, [showSuccess, t]);

  const showChannelRemoved = useCallback(() => {
    showSuccess(t('notifications.channelRemoved'));
  }, [showSuccess, t]);

  const showMessageSent = useCallback((hadProfanity = false) => {
    let message = t('notifications.messageSent');
    if (hadProfanity) {
      message += ` (${t('validation.profanityWarning')})`;
    }
    showSuccess(message);
  }, [showSuccess, t]);

  const showAuthError = useCallback(() => {
    showError(t('notifications.authError'));
  }, [showError, t]);

  const showUnknownError = useCallback(() => {
    showError(t('notifications.unknownError'));
  }, [showError, t]);

  const showProfanityWarning = useCallback(() => {
    showWarning(t('validation.profanityWarning'));
  }, [showWarning, t]);

  return {
    showSuccess,
    showError,
    showWarning,
    showNetworkError,
    showLoadDataError,
    showChannelAdded,
    showChannelRenamed,
    showChannelRemoved,
    showMessageSent,
    showAuthError,
    showUnknownError,
    showProfanityWarning,
  };
};
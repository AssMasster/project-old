import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const useToast = () => {
  const { t } = useTranslation();

  const showSuccess = (messageKey) => toast.success(t(messageKey));

  const showError = (error) => {
    const message = error.message || t('modal.form.netError');
    toast.error(message);
  };
  return { showSuccess, showError };
};

export default useToast;

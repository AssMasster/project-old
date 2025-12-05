import Rollbar from 'rollbar';

const rollbarConfig = new Rollbar({
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: import.meta.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbarConfig;

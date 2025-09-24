
export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  extra: {
    ...config.extra,
    apiBaseURL: process.env.API_URL ?? 'http://localhost:3000/api',
  }
});

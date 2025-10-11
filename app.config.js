
export default ({ config }) => ({
  ...config,
  name: process.env.APP_NAME ?? config.name,
  android: {
    ...config.android,
    package: process.env.PACKAGE_NAME ?? config.android?.package,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  ios: {
    ...config.ios,
    bundleIdentifier: process.env.PACKAGE_NAME ?? config.ios?.bundleIdentifier,
  },
  extra: {
    ...config.extra,
    apiBaseURL: process.env.API_URL ?? 'http://localhost:3000',
  }
});

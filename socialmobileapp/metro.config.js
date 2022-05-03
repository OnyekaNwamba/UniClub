/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  assets: ['src/assets/fonts'],
  resolver: {
    sourceExts: ['jsx', 'js', 'json', 'ts', 'tsx'],
  },
  // server: {port: 8088},
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

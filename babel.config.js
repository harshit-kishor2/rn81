module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    //  module-resolver for path alias
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@app': './src',
          '@root': './src/_app_',
          '@components': './src/components',
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@utils': './src/utils',
          '@assets': './assets',
        },
      },
    ],

    // Reanimated plugin has to be listed last after all other plugins
    'react-native-worklets/plugin',
  ],
};

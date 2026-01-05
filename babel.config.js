module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@pages': './src/pages',
            '@shared': './src/shared',
            '@': './',
          },
        },
      ],
      'expo-router/babel',
    ],
  };
};

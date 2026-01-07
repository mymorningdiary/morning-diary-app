module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@application': './src/application',
            '@pages': './src/pages',
            '@features': './src/features',
            '@entities': './src/entities',
            '@shared': './src/shared',
            '@assets': './assets',
            '@': './',
          },
        },
      ],
      'expo-router/babel',
    ],
  };
};

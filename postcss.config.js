module.exports = {
    plugins: [
      require('postcss-import'),
      require('autoprefixer'),
      require('postcss-nested'),
      require('postcss-preset-env')({
        stage: 0, // or your preferred stage
      }),
      require('cssnano')({
        preset: 'default',
      }),
    ],
  };
  
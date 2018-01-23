module.exports = {
  ident: 'postcss',
  plugins: [
    require('postcss-import'),
    require('postcss-simple-vars'),
    require('postcss-animation'),
    require('postcss-cssnext')({
      warnForDuplicates: false
    }),
    require('rucksack-css'),
    require('postcss-nested'),
    require('postcss-at2x'),
    require('colorguard'),
    require('cssnano')
  ]
};

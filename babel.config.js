module.exports = {
  env: {
    development: {
      plugins: [
        'react-hot-loader/babel',
      ],
    }
  },
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/proposal-object-rest-spread',
  ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}

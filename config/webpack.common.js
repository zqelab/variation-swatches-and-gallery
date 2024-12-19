const paths = require('./paths')

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
		admin: [
			paths.src + '/admin/src/index.js',
			paths.src + '/admin/src/styles/index.scss',
		],
		public: [
			paths.src + '/public/src/index.js',
			paths.src + '/public/src/styles/index.scss',
		]
	},

  // Where webpack outputs the assets and bundles
  output: {
		path: paths.build,
		filename: '[name]/js/variation-swatches-and-gallery-[name]-[hash].js',
		publicPath: '/',
	},
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  },
  // Customize the webpack build process
  plugins: [
  ],

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },

      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },

      // Fonts and SVGs: Inline files
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
      assets: paths.public,
    },
  },
}

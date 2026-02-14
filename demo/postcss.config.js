const babelConfig = require("./babel.config.js");

module.exports = {
  plugins: {
    "@stylexjs/postcss-plugin": {
      include: [
        "pages/**/*.{ts,tsx}",
        "../src/**/*.{ts,tsx}",
      ],
      babelConfig: babelConfig,
      useCSSLayers: false,
    },
    autoprefixer: {},
  },
};

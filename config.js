const isDev = (process.env.NODE_ENV !== "build" && process.env.NODE_ENV !== "build-wordpress");

const environments = {
  dev: {
    backend: "http://127.0.0.1:9000/api-new/"
  },
  watch: {
    backend: "https://api.workshopbutler.com/"
  },
  build: {
    backend: "https://api.workshopbutler.com/"
  },
  "build-wordpress": {
    backend: "https://api.workshopbutler.com/"
  }
};

const options = {
  apiKey: process.env.API_KEY,
  theme: 'alfred',
  apiVersion: '2020-04-06',
  lang: process.env.LANG ? process.env.LANG : 'en',
};

const mapping = {
  widgets: './app.ts',
  templates: './templates.ts',
  'styles': 'styles/common.less'
};

module.exports = {
  isDev,
  src: isDev ? 'site/static/' : `dist/`,
  env: environments[process.env.NODE_ENV],
  entry: mapping,
  options: options,
  wordpress: process.env.NODE_ENV === "build-wordpress"
};

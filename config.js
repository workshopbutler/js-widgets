
const isDev = (process.env.NODE_ENV !== "build");

const environments = {
    dev: {
        backend: "http://127.0.0.1:9000/api-new/"
    },
    watch: {
        backend: "https://api.workshopbutler.com/"
    },
    build: {
        backend: "https://api.workshopbutler.com/"
    }
};

const options = {
    apiKey: process.env.API_KEY,
    theme: 'hayes',
    apiVersion: '2018-06-28'
};

const mapping = {
    widgets: './app.js',
    'styles': 'styles/common.less'
};

module.exports = {
    isDev,
    src: isDev ? `.tmp/` : `dist/`,
    env: environments[process.env.NODE_ENV],
    entry: mapping,
    options: options
};

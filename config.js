
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
    theme: 'alfred',
    themeVersion: '0.5.3'
};

const mapping = {
    widgets: './app.js',
    // themes: '../themes/src/styles/common.less'
};

module.exports = {
    isDev,
    src: isDev ? `.tmp/` : `dist/`,
    env: environments[process.env.NODE_ENV],
    entry: mapping,
    options: options
};


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
    theme: 'dacota',
    themeVersion: '0.4.0'
};

const mapping = {
    widgets: './app.js'
};

module.exports = {
    isDev,
    src: isDev ? `.tmp/` : `dist/`,
    env: environments[process.env.NODE_ENV],
    entry: mapping,
    options: options
};

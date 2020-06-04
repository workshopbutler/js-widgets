module.exports = function (eleventyConfig) {
    //eleventyConfig.addPassthroughCopy('src/images')

    return {
        dir: { input: 'el-site', output: 'public', data: '_data' },
        passthroughFileCopy: true,
        templateFormats: ['njk', 'md', 'css', 'html', 'yml'],
        htmlTemplateEngine: 'njk'
    }
}

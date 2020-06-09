module.exports = function (eleventyConfig) {
    //eleventyConfig.addPassthroughCopy('site/css')
    //eleventyConfig.addPassthroughCopy('site/js')

    return {
        dir: { input: 'el-site', output: 'public', data: '_data' },
        passthroughFileCopy: true,
        templateFormats: ['njk', 'md', 'html', 'yml', 'js', 'css'],
        htmlTemplateEngine: 'njk'
    }
}
